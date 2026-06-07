import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useReservationStore = defineStore('reservations', () => {
  const reservations = ref([
    {
      id: 1,
      dogName: '뭉치',
      breed: '말티즈',
      ownerName: '김지원',
      phone: '010-1234-5678',
      date: '2026-06-10',
      time: '10:00',
      service: '미용',
      status: '확정',
      notes: '귀 쪽 털 짧게 잘라주세요',
    },
    {
      id: 2,
      dogName: '초코',
      breed: '포메라니안',
      ownerName: '이수진',
      phone: '010-9876-5432',
      date: '2026-06-11',
      time: '14:00',
      service: '호텔링',
      status: '대기중',
      notes: '',
    },
  ])

  const nextId = ref(3)

  const total = computed(() => reservations.value.length)
  const pending = computed(() => reservations.value.filter((r) => r.status === '대기중').length)
  const confirmed = computed(() => reservations.value.filter((r) => r.status === '확정').length)

  function addReservation(data) {
    reservations.value.push({ id: nextId.value++, status: '대기중', ...data })
  }

  function updateStatus(id, status) {
    const r = reservations.value.find((r) => r.id === id)
    if (r) r.status = status
  }

  function deleteReservation(id) {
    reservations.value = reservations.value.filter((r) => r.id !== id)
  }

  return { reservations, total, pending, confirmed, addReservation, updateStatus, deleteReservation }
})
