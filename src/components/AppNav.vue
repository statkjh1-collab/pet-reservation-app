<template>
  <nav class="nav">
    <RouterLink to="/" class="nav-brand">🐶 강아지 예약</RouterLink>
    <div class="nav-links">
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/reservations">예약 목록</RouterLink>
      <RouterLink to="/reservations/new" class="btn-primary">+ 새 예약</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-brand {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #6b7280;
  font-size: 0.95rem;
}

.nav-links a.router-link-active {
  color: #111;
  font-weight: 600;
}

.btn-primary {
  background: #f59e0b;
  color: #fff !important;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 600;
}

.btn-primary.router-link-active {
  background: #d97706;
}
</style>
