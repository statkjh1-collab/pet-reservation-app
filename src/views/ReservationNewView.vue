<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReservationStore, SPACES, BUSINESS_START, BUSINESS_END } from '@/stores/reservations'

const router = useRouter()
const route = useRoute()
const store = useReservationStore()

const mode = ref(route.query.type === 'rental' ? 'rental' : 'grooming') // 'grooming' | 'rental'
const error = ref('')

const groomingForm = reactive({
  dogName: '',
  breed: '',
  ownerName: '',
  phone: '',
  date: '',
  time: '',
  service: '',
  notes: '',
})

const rentalForm = reactive({
  renterName: '',
  renterPhone: '',
  space: '',
  date: '',
  startTime: '',
  endTime: '',
  purpose: '',
})

const services = ['미용', '훈련', '호텔링', '유치원']

function submitGrooming() {
  store.addReservation({ ...groomingForm, type: 'grooming' })
  router.push('/reservations')
}

// 30분 단위 시간 슬롯. 공간·날짜가 정해지면 기존 예약과 겹치는 슬롯은 회색으로 비활성화됨.
const SLOT_STEP = 30
function toHHMM(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const slots = computed(() => {
  if (!rentalForm.space || !rentalForm.date) return []
  const list = []
  for (let m = BUSINESS_START; m < BUSINESS_END; m += SLOT_STEP) {
    const startStr = toHHMM(m)
    const endStr = toHHMM(m + SLOT_STEP)
    list.push({
      i: list.length,
      startStr,
      endStr,
      disabled: !store.isRentalSlotAvailable(rentalForm.space, rentalForm.date, startStr, endStr),
    })
  }
  return list
})

const selectedStart = ref(null)
const selectedEnd = ref(null)

watch([() => rentalForm.space, () => rentalForm.date], () => {
  selectedStart.value = null
  selectedEnd.value = null
  rentalForm.startTime = ''
  rentalForm.endTime = ''
})

function pickSlot(slot) {
  if (slot.disabled) return
  error.value = ''

  if (selectedStart.value === null || (selectedStart.value === selectedEnd.value && slot.i === selectedStart.value)) {
    selectedStart.value = slot.i
    selectedEnd.value = slot.i
  } else {
    const lo = Math.min(selectedStart.value, slot.i)
    const hi = Math.max(selectedStart.value, slot.i)
    const rangeOk = slots.value.slice(lo, hi + 1).every((s) => !s.disabled)
    if (!rangeOk) {
      error.value = '선택한 범위 안에 이미 예약된 시간이 있어요.'
      selectedStart.value = slot.i
      selectedEnd.value = slot.i
    } else {
      selectedStart.value = lo
      selectedEnd.value = hi
    }
  }

  rentalForm.startTime = slots.value[selectedStart.value].startStr
  rentalForm.endTime = slots.value[selectedEnd.value].endStr
}

function submitRental() {
  error.value = ''
  const ok = store.addRentalReservation({ ...rentalForm })
  if (!ok) {
    error.value = '해당 시간에 이미 예약된 공간이에요. 다른 시간이나 공간을 선택해주세요.'
    return
  }
  router.push('/reservations')
}
</script>

<template>
  <main class="new-page">
    <h1>새 예약</h1>

    <div class="mode-tabs">
      <button
        type="button"
        :class="['mode-tab', { active: mode === 'grooming' }]"
        @click="mode = 'grooming'"
      >
        🐾 미용 예약
      </button>
      <button
        type="button"
        :class="['mode-tab', { active: mode === 'rental' }]"
        @click="mode = 'rental'"
      >
        🏢 공간 대여
      </button>
    </div>

    <form v-if="mode === 'grooming'" class="form" @submit.prevent="submitGrooming">
      <fieldset>
        <legend>강아지 정보</legend>
        <div class="field-row">
          <div class="field">
            <label>강아지 이름 <span>*</span></label>
            <input v-model="groomingForm.dogName" required placeholder="예) 뭉치" />
          </div>
          <div class="field">
            <label>견종</label>
            <input v-model="groomingForm.breed" placeholder="예) 말티즈" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>보호자 정보</legend>
        <div class="field-row">
          <div class="field">
            <label>보호자 이름 <span>*</span></label>
            <input v-model="groomingForm.ownerName" required placeholder="예) 홍길동" />
          </div>
          <div class="field">
            <label>연락처 <span>*</span></label>
            <input v-model="groomingForm.phone" required placeholder="010-0000-0000" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>예약 정보</legend>
        <div class="field-row">
          <div class="field">
            <label>날짜 <span>*</span></label>
            <input v-model="groomingForm.date" type="date" required />
          </div>
          <div class="field">
            <label>시간 <span>*</span></label>
            <input v-model="groomingForm.time" type="time" required />
          </div>
        </div>
        <div class="field">
          <label>서비스 <span>*</span></label>
          <div class="service-buttons">
            <button
              v-for="s in services"
              :key="s"
              type="button"
              :class="['service-btn', { selected: groomingForm.service === s }]"
              @click="groomingForm.service = s"
            >
              {{ s }}
            </button>
          </div>
          <input type="hidden" v-model="groomingForm.service" required />
        </div>
        <div class="field">
          <label>메모</label>
          <textarea v-model="groomingForm.notes" rows="3" placeholder="특이사항이 있으면 적어주세요" />
        </div>
      </fieldset>

      <div class="form-actions">
        <RouterLink to="/reservations" class="btn-back">취소</RouterLink>
        <button type="submit" class="btn-submit" :disabled="!groomingForm.service">
          예약 등록
        </button>
      </div>
    </form>

    <form v-else class="form" @submit.prevent="submitRental">
      <fieldset>
        <legend>대여자 정보</legend>
        <div class="field-row">
          <div class="field">
            <label>이름 <span>*</span></label>
            <input v-model="rentalForm.renterName" required placeholder="예) 홍길동" />
          </div>
          <div class="field">
            <label>연락처 <span>*</span></label>
            <input v-model="rentalForm.renterPhone" required placeholder="010-0000-0000" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>대여 정보</legend>
        <div class="field">
          <label>공간 <span>*</span></label>
          <div class="service-buttons">
            <button
              v-for="s in SPACES"
              :key="s"
              type="button"
              :class="['service-btn', { selected: rentalForm.space === s }]"
              @click="rentalForm.space = s"
            >
              {{ s }}
            </button>
          </div>
          <input type="hidden" v-model="rentalForm.space" required />
        </div>
        <div class="field-row">
          <div class="field">
            <label>날짜 <span>*</span></label>
            <input v-model="rentalForm.date" type="date" required />
          </div>
        </div>
        <div class="field">
          <label>시간 <span>*</span></label>
          <p v-if="slots.length === 0" class="dim">공간과 날짜를 먼저 선택하세요.</p>
          <template v-else>
            <div class="slot-grid">
              <button
                v-for="slot in slots"
                :key="slot.i"
                type="button"
                class="slot-btn"
                :class="{
                  disabled: slot.disabled,
                  selected:
                    selectedStart !== null && slot.i >= selectedStart && slot.i <= selectedEnd,
                }"
                :disabled="slot.disabled"
                @click="pickSlot(slot)"
              >
                {{ slot.startStr }}
              </button>
            </div>
            <p v-if="rentalForm.startTime" class="dim">
              선택한 시간: {{ rentalForm.startTime }} ~ {{ rentalForm.endTime }}
            </p>
          </template>
        </div>
        <div class="field">
          <label>용도</label>
          <input v-model="rentalForm.purpose" placeholder="예) 실습, 개인 연습" />
        </div>
      </fieldset>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="form-actions">
        <RouterLink to="/reservations" class="btn-back">취소</RouterLink>
        <button
          type="submit"
          class="btn-submit"
          :disabled="!rentalForm.space || !rentalForm.startTime"
        >
          대여 신청
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.new-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

h1 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.mode-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mode-tab {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6b7280;
}

.mode-tab.active {
  background: #111;
  color: #fff;
  border-color: #111;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

fieldset {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem;
}

legend {
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0 0.5rem;
  color: #374151;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

label span {
  color: #ef4444;
}

input,
textarea {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

input:focus,
textarea:focus {
  border-color: #f59e0b;
}

.service-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.service-btn {
  padding: 0.4rem 1.1rem;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  color: #4b5563;
}

.service-btn.selected {
  background: #f59e0b;
  color: #fff;
  border-color: #f59e0b;
  font-weight: 600;
}

.dim {
  color: #9ca3af;
  font-size: 0.85rem;
  margin: 0.25rem 0 0;
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.4rem;
}

.slot-btn {
  padding: 0.4rem 0;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.8rem;
  color: #4b5563;
}

.slot-btn.disabled {
  background: #f3f4f6;
  color: #d1d5db;
  border-color: #e5e7eb;
  cursor: not-allowed;
}

.slot-btn.selected {
  background: #f59e0b;
  color: #fff;
  border-color: #f59e0b;
  font-weight: 600;
}

.error {
  color: #dc2626;
  font-size: 0.9rem;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-back {
  padding: 0.6rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-decoration: none;
  color: #374151;
  font-size: 0.95rem;
}

.btn-submit {
  padding: 0.6rem 1.5rem;
  background: #f59e0b;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}

.btn-submit:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
</style>
