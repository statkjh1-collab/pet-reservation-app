import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const SPACES = ['1번 스튜디오', '2번 스튜디오', '장비룸 A']

// 영업시간 (분 단위, 09:00~21:00)
export const BUSINESS_START = 9 * 60
export const BUSINESS_END = 21 * 60

export const useReservationStore = defineStore('reservations', () => {
  const reservations = ref([
    {
      id: 1,
      type: 'grooming',
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
      type: 'grooming',
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
    {
      id: 3,
      type: 'rental',
      renterName: '박민수',
      renterPhone: '010-2222-3333',
      space: '1번 스튜디오',
      date: '2026-07-04',
      startTime: '10:00',
      endTime: '12:00',
      purpose: '실습',
      status: '확정',
      notes: '',
    },
    {
      id: 4,
      type: 'rental',
      renterName: '오세훈',
      renterPhone: '010-4444-5555',
      space: '1번 스튜디오',
      date: '2026-07-04',
      startTime: '15:00',
      endTime: '16:30',
      purpose: '창업 준비 연습',
      status: '대기중',
      notes: '',
    },
    {
      id: 5,
      type: 'rental',
      renterName: '윤아름',
      renterPhone: '010-6666-7777',
      space: '2번 스튜디오',
      date: '2026-07-04',
      startTime: '13:00',
      endTime: '14:00',
      purpose: '개인 연습',
      status: '확정',
      notes: '',
    },
  ])

  const nextId = ref(6)

  const total = computed(() => reservations.value.length)
  const pending = computed(() => reservations.value.filter((r) => r.status === '대기중').length)
  const confirmed = computed(() => reservations.value.filter((r) => r.status === '확정').length)

  const groomingReservations = computed(() =>
    reservations.value.filter((r) => r.type === 'grooming'),
  )
  const rentalReservations = computed(() => reservations.value.filter((r) => r.type === 'rental'))

  function rangesOverlap(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd
  }

  // 같은 공간·날짜에 시간이 겹치는 대여 예약(취소 제외)이 있는지 확인
  function isRentalSlotAvailable(space, date, startTime, endTime, excludeId = null) {
    return !reservations.value.some(
      (r) =>
        r.type === 'rental' &&
        r.id !== excludeId &&
        r.status !== '취소' &&
        r.space === space &&
        r.date === date &&
        rangesOverlap(r.startTime, r.endTime, startTime, endTime),
    )
  }

  function addReservation(data) {
    reservations.value.push({ id: nextId.value++, status: '대기중', ...data })
  }

  // 공간 대여는 시간 겹침 검사를 통과해야 등록됨. 성공 시 true, 실패 시 false 반환
  function addRentalReservation(data) {
    if (!isRentalSlotAvailable(data.space, data.date, data.startTime, data.endTime)) {
      return false
    }
    addReservation({ ...data, type: 'rental' })
    return true
  }

  function updateStatus(id, status) {
    const r = reservations.value.find((r) => r.id === id)
    if (r) r.status = status
  }

  function deleteReservation(id) {
    reservations.value = reservations.value.filter((r) => r.id !== id)
  }

  return {
    reservations,
    total,
    pending,
    confirmed,
    groomingReservations,
    rentalReservations,
    isRentalSlotAvailable,
    addReservation,
    addRentalReservation,
    updateStatus,
    deleteReservation,
  }
})
