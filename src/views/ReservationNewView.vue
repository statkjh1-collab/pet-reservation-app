<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useReservationStore } from '@/stores/reservations'

const router = useRouter()
const store = useReservationStore()

const form = reactive({
  dogName: '',
  breed: '',
  ownerName: '',
  phone: '',
  date: '',
  time: '',
  service: '',
  notes: '',
})

const services = ['미용', '훈련', '호텔링', '유치원']

function submit() {
  store.addReservation({ ...form })
  router.push('/reservations')
}
</script>

<template>
  <main class="new-page">
    <h1>새 예약</h1>

    <form class="form" @submit.prevent="submit">
      <fieldset>
        <legend>강아지 정보</legend>
        <div class="field-row">
          <div class="field">
            <label>강아지 이름 <span>*</span></label>
            <input v-model="form.dogName" required placeholder="예) 뭉치" />
          </div>
          <div class="field">
            <label>견종</label>
            <input v-model="form.breed" placeholder="예) 말티즈" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>보호자 정보</legend>
        <div class="field-row">
          <div class="field">
            <label>보호자 이름 <span>*</span></label>
            <input v-model="form.ownerName" required placeholder="예) 홍길동" />
          </div>
          <div class="field">
            <label>연락처 <span>*</span></label>
            <input v-model="form.phone" required placeholder="010-0000-0000" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>예약 정보</legend>
        <div class="field-row">
          <div class="field">
            <label>날짜 <span>*</span></label>
            <input v-model="form.date" type="date" required />
          </div>
          <div class="field">
            <label>시간 <span>*</span></label>
            <input v-model="form.time" type="time" required />
          </div>
        </div>
        <div class="field">
          <label>서비스 <span>*</span></label>
          <div class="service-buttons">
            <button
              v-for="s in services"
              :key="s"
              type="button"
              :class="['service-btn', { selected: form.service === s }]"
              @click="form.service = s"
            >
              {{ s }}
            </button>
          </div>
          <input type="hidden" v-model="form.service" required />
        </div>
        <div class="field">
          <label>메모</label>
          <textarea v-model="form.notes" rows="3" placeholder="특이사항이 있으면 적어주세요" />
        </div>
      </fieldset>

      <div class="form-actions">
        <RouterLink to="/reservations" class="btn-back">취소</RouterLink>
        <button type="submit" class="btn-submit" :disabled="!form.service">예약 등록</button>
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
