<script setup>
import { useReservationStore } from '@/stores/reservations'
import { RouterLink } from 'vue-router'

const store = useReservationStore()
</script>

<template>
  <main class="home">
    <section class="hero">
      <h1>🐶 강아지 예약 관리</h1>
      <p>미용, 훈련, 호텔링, 유치원 예약을 한 곳에서 관리하세요.</p>
      <RouterLink to="/reservations/new" class="btn-cta">지금 예약하기</RouterLink>
    </section>

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

    <section class="services">
      <h2>서비스 안내</h2>
      <div class="service-grid">
        <div class="service-card" v-for="s in services" :key="s.name">
          <span class="service-icon">{{ s.icon }}</span>
          <strong>{{ s.name }}</strong>
          <p>{{ s.desc }}</p>
        </div>
      </div>
    </section>

    <section class="rental-banner">
      <div class="rental-text">
        <h2>🏢 미용사이신가요?</h2>
        <p>장비를 갖춘 스튜디오를 시간 단위로 대여해 실습하거나 창업을 준비해보세요.</p>
      </div>
      <RouterLink to="/reservations/new?type=rental" class="btn-cta btn-cta-outline">
        공간 대여하기
      </RouterLink>
    </section>
  </main>
</template>

<script>
const services = [
  { icon: '✂️', name: '미용', desc: '전문 그루머가 정성껏 케어해드립니다.' },
  { icon: '🎓', name: '훈련', desc: '기초 훈련부터 행동 교정까지 맞춤 지도.' },
  { icon: '🏨', name: '호텔링', desc: '편안하고 안전한 숙박 서비스.' },
  { icon: '🏫', name: '유치원', desc: '사회성 발달과 즐거운 하루를 함께.' },
]
</script>

<style scoped>
.home {
  max-width: 860px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.hero p {
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.btn-cta {
  display: inline-block;
  background: #f59e0b;
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
}

.btn-cta:hover {
  background: #d97706;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
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

.services h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.service-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.service-icon {
  font-size: 1.8rem;
}

.service-card p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.rental-banner {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  background: #111;
  color: #fff;
  border-radius: 14px;
  padding: 1.75rem 2rem;
}

.rental-text h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.rental-text p {
  color: #d1d5db;
  font-size: 0.9rem;
  margin: 0;
}

.btn-cta-outline {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid #fff;
  padding: 0.7rem 1.5rem;
}

.btn-cta-outline:hover {
  background: #fff;
  color: #111;
}
</style>
