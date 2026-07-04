<script setup>
import { ref } from 'vue'
import { useReservationStore } from '@/stores/reservations'

const store = useReservationStore()
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
</script>

<script>
import { computed } from 'vue'
</script>

<template>
  <main class="list-page">
    <div class="list-header">
      <h1>예약 목록</h1>
      <RouterLink to="/reservations/new" class="btn-primary">+ 새 예약</RouterLink>
    </div>

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

    <div v-else class="cards">
      <div class="card" v-for="r in filtered" :key="r.id">
        <div class="card-top">
          <div v-if="r.type === 'rental'">
            <span class="dog-name">🏢 {{ r.space }}</span>
          </div>
          <div v-else>
            <span class="dog-name">{{ r.dogName }}</span>
            <span class="breed">{{ r.breed }}</span>
          </div>
          <span :class="['badge', statusClass[r.status]]">{{ r.status }}</span>
        </div>
        <div v-if="r.type === 'rental'" class="card-info">
          <span>📅 {{ r.date }} {{ r.startTime }}–{{ r.endTime }}</span>
          <span>👤 {{ r.renterName }} · {{ r.renterPhone }}</span>
        </div>
        <div v-else class="card-info">
          <span>📅 {{ r.date }} {{ r.time }}</span>
          <span>✂️ {{ r.service }}</span>
          <span>👤 {{ r.ownerName }} · {{ r.phone }}</span>
        </div>
        <p v-if="r.type === 'rental' && r.purpose" class="notes">{{ r.purpose }}</p>
        <p v-else-if="r.notes" class="notes">{{ r.notes }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.list-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.list-header h1 {
  font-size: 1.6rem;
  font-weight: 800;
}

.btn-primary {
  background: #f59e0b;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
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

.cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem;
  background: #fff;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.dog-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-right: 0.5rem;
}

.breed {
  font-size: 0.85rem;
  color: #9ca3af;
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

.card-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.notes {
  font-size: 0.85rem;
  color: #6b7280;
  background: #f9fafb;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin: 0.5rem 0;
}

</style>
