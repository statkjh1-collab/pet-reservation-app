<script setup>
import { ref, computed } from 'vue'
import { useReservationStore, SPACES, BUSINESS_START, BUSINESS_END } from '@/stores/reservations'

const store = useReservationStore()

const ADMIN_PW = 'admin1234'
const pw = ref('')
const authed = ref(false)
const authErr = ref('')

function tryLogin() {
  if (pw.value === ADMIN_PW) {
    authed.value = true
    authErr.value = ''
  } else {
    authErr.value = '비밀번호가 틀렸어요.'
  }
}

const adminTab = ref('reservations') // 'reservations' | 'schedule'

const filter = ref('전체')
const statusOptions = ['전체', '대기중', '확정', '취소']

const filtered = computed(() =>
  filter.value === '전체'
    ? store.reservations
    : store.reservations.filter((r) => r.status === filter.value),
)

const statusClass = {
  대기중: 'badge-pending',
  확정: 'badge-confirmed',
  취소: 'badge-cancelled',
}

// 공간 현황 (시간단위 뷰)
const BUSINESS_RANGE = BUSINESS_END - BUSINESS_START
const hourMarks = Array.from(
  { length: BUSINESS_END / 60 - BUSINESS_START / 60 + 1 },
  (_, i) => BUSINESS_START / 60 + i,
)

const scheduleDate = ref(new Date().toISOString().slice(0, 10))

function toMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function rentalsForSpace(space) {
  return store.rentalReservations
    .filter((r) => r.space === space && r.date === scheduleDate.value && r.status !== '취소')
    .map((r) => {
      const start = Math.max(toMinutes(r.startTime), BUSINESS_START)
      const end = Math.min(toMinutes(r.endTime), BUSINESS_END)
      return {
        ...r,
        left: ((start - BUSINESS_START) / BUSINESS_RANGE) * 100,
        width: ((end - start) / BUSINESS_RANGE) * 100,
      }
    })
}
</script>

<template>
  <main class="page">
    <h1>관리자</h1>

    <div v-if="!authed" class="card login-card">
      <p class="dim">관리자 비밀번호를 입력하세요.</p>
      <input
        v-model="pw"
        type="password"
        placeholder="비밀번호"
        @keyup.enter="tryLogin"
      />
      <button class="btn-primary" @click="tryLogin">로그인</button>
      <p v-if="authErr" class="error">{{ authErr }}</p>
    </div>

    <template v-else>
      <div class="admin-tabs">
        <button
          :class="['admin-tab', { active: adminTab === 'reservations' }]"
          @click="adminTab = 'reservations'"
        >
          예약 관리
        </button>
        <button
          :class="['admin-tab', { active: adminTab === 'schedule' }]"
          @click="adminTab = 'schedule'"
        >
          공간 현황
        </button>
      </div>

      <template v-if="adminTab === 'reservations'">
        <section class="stats">
          <div class="stat-card">
            <span class="stat-number">{{ store.total }}</span>
            <span class="stat-label">전체 예약</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ store.pending }}</span>
            <span class="stat-label">대기중</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ store.confirmed }}</span>
            <span class="stat-label">확정</span>
          </div>
        </section>

        <div class="filter-tabs">
          <button
            v-for="opt in statusOptions"
            :key="opt"
            :class="['tab', { active: filter === opt }]"
            @click="filter = opt"
          >
            {{ opt }}
          </button>
        </div>

        <div v-if="filtered.length === 0" class="empty">예약이 없어요.</div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>유형</th>
              <th>대상</th>
              <th>예약자</th>
              <th>일시</th>
              <th>상세</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filtered" :key="r.id">
              <td>{{ r.type === 'rental' ? '🏢 대여' : '🐾 미용' }}</td>
              <td v-if="r.type === 'rental'">{{ r.space }}</td>
              <td v-else>{{ r.dogName }} <span class="dim">({{ r.breed }})</span></td>
              <td v-if="r.type === 'rental'">{{ r.renterName }} · {{ r.renterPhone }}</td>
              <td v-else>{{ r.ownerName }} · {{ r.phone }}</td>
              <td v-if="r.type === 'rental'">{{ r.date }} {{ r.startTime }}–{{ r.endTime }}</td>
              <td v-else>{{ r.date }} {{ r.time }}</td>
              <td v-if="r.type === 'rental'">{{ r.purpose || '-' }}</td>
              <td v-else>{{ r.service }}</td>
              <td><span :class="['badge', statusClass[r.status]]">{{ r.status }}</span></td>
              <td class="row-actions">
                <button
                  v-if="r.status === '대기중'"
                  class="btn-confirm"
                  @click="store.updateStatus(r.id, '확정')"
                >
                  확정
                </button>
                <button
                  v-if="r.status !== '취소'"
                  class="btn-cancel"
                  @click="store.updateStatus(r.id, '취소')"
                >
                  취소
                </button>
                <button class="btn-delete" @click="store.deleteReservation(r.id)">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-else>
        <div class="schedule-date-field">
          <label>날짜</label>
          <input v-model="scheduleDate" type="date" />
        </div>

        <div class="timeline-hours">
          <span class="space-label-spacer"></span>
          <div class="timeline-hours-track">
            <span v-for="h in hourMarks" :key="h" class="hour-label">{{ h }}시</span>
          </div>
        </div>

        <div class="space-row" v-for="space in SPACES" :key="space">
          <div class="space-label">{{ space }}</div>
          <div class="timeline-track">
            <div
              v-for="r in rentalsForSpace(space)"
              :key="r.id"
              :class="['timeline-block', statusClass[r.status]]"
              :style="{ left: r.left + '%', width: r.width + '%' }"
              :title="`${r.renterName} · ${r.startTime}-${r.endTime}`"
            >
              {{ r.renterName }} {{ r.startTime }}-{{ r.endTime }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </main>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page h1 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  background: #fff;
}

.login-card {
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-card input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
}

.dim {
  color: #9ca3af;
  font-size: 0.85rem;
}

.error {
  color: #dc2626;
  font-size: 0.85rem;
}

.btn-primary {
  background: #f59e0b;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.admin-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.admin-tab {
  padding: 0.5rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6b7280;
}

.admin-tab.active {
  background: #111;
  color: #fff;
  border-color: #111;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  flex: 1;
  background: #fef3c7;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #d97706;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.4rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6b7280;
}

.tab.active {
  background: #111;
  color: #fff;
  border-color: #111;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 4rem 0;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.admin-table th,
.admin-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}

.admin-table th {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
}

.badge {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-weight: 600;
}

.badge-pending {
  background: #fef3c7;
  color: #d97706;
}

.badge-confirmed {
  background: #d1fae5;
  color: #059669;
}

.badge-cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.row-actions {
  display: flex;
  gap: 0.4rem;
}

.row-actions button {
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

.btn-confirm {
  background: #d1fae5;
  color: #059669;
}

.btn-cancel {
  background: #fef3c7;
  color: #d97706;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.schedule-date-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.schedule-date-field label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.schedule-date-field input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
}

.timeline-hours {
  display: flex;
  margin-bottom: 0.5rem;
}

.space-label-spacer {
  flex: 0 0 140px;
}

.timeline-hours-track {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.hour-label {
  font-size: 0.75rem;
  color: #9ca3af;
}

.space-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 0.75rem;
}

.space-label {
  flex: 0 0 140px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.timeline-track {
  position: relative;
  flex: 1;
  height: 42px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.timeline-block {
  position: absolute;
  top: 3px;
  bottom: 3px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
