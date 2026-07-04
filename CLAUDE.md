# pet-reservation-app

반려동물 예약 관리 웹 앱

## 기술 스택
- Vue 3 + Vite
- Pinia (상태 관리)
- Vue Router
- Node.js

## 프로젝트 구조
```
src/
├── components/   # 재사용 컴포넌트
├── views/        # 페이지 뷰
├── stores/       # Pinia 스토어
└── router/       # 라우터 설정
```

## 현재 상태
- [ ] 예약 목록 페이지
- [ ] 예약 등록 폼
- [ ] 예약 상태 관리 (대기/확정/취소)
- [ ] DB 연동

## 주요 기능 (예정)
- 반려동물 예약 등록 / 조회 / 수정 / 취소
- 날짜별 예약 현황 보기
- 예약자 정보 관리

## 개발 시작
```bash
npm install
npm run dev
```

## 주의사항
- 새 기능 추가 전 이 파일을 먼저 읽고 현재 상태 파악할 것
- 컴포넌트는 최대한 재사용 가능하게 작성
