# Today's Backlog - 최종 구현 문서

## 1. 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: Today's Backlog
- **타입**: 웹 기반 투두리스트 관리 애플리케이션
- **기술 스택**: React 19, TypeScript, Tailwind CSS v3.4, Vite 7.1
- **데이터 저장**: LocalStorage (백엔드 없음)
- **목표**: 심플하면서도 효율적인 일일 작업 관리 도구
- **개발 상태**: ✅ **완료** (2025-08-22)

### 1.2 핵심 가치
- **단순함**: 복잡한 기능보다 핵심 기능에 집중
- **직관성**: 학습 곡선 없는 즉시 사용 가능한 UI
- **효율성**: 빠른 작업 입력과 관리
- **지속성**: 브라우저 로컬 스토리지를 통한 데이터 유지
- **반응성**: 데스크톱, 태블릿, 모바일 완전 대응

## 2. ✅ 구현된 기능 현황

### 2.1 핵심 기능 (MVP) - ✅ 100% 완료
1. **작업 관리** ✅
   - ✅ 작업 추가 (제목, 설명, 우선순위, 태그, 마감일, 예상 시간)
   - ✅ 작업 수정 (모든 필드 편집 가능)
   - ✅ 작업 삭제 (확인 다이얼로그 포함)
   - ✅ 작업 완료/미완료 토글 (자동 완료 시간 기록)
   - ✅ 작업 상태 변경 (Today ↔ Backlog ↔ Completed)

2. **작업 분류** ✅
   - ✅ 오늘 할 일 (Today) - 실시간 카운트 표시
   - ✅ 백로그 (Backlog) - 우선순위별 자동 정렬
   - ✅ 완료된 작업 (Completed) - 완료 시간 추적

3. **데이터 관리** ✅
   - ✅ LocalStorage 자동 저장 (실시간)
   - ✅ JSON 데이터 내보내기 (날짜별 파일명)
   - ✅ JSON 데이터 가져오기 (유효성 검증 포함)
   - ✅ 전체 데이터 삭제 (안전 확인 포함)
   - ✅ 자동 백업 시스템 (매일)

### 2.2 고급 기능 - ✅ 100% 완료
1. **필터링 & 검색** ✅
   - ✅ 상태별 필터링 (Today/Backlog/Completed)
   - ✅ 우선순위별 필터링 (긴급/높음/보통/낮음)
   - ✅ 태그별 필터링 (다중 선택 가능)
   - ✅ 실시간 키워드 검색 (제목, 설명, 태그 검색)
   - ✅ 복합 필터링 (여러 조건 동시 적용)
   - ✅ 필터 초기화 기능

2. **통계 & 분석** ✅
   - ✅ 실시간 작업 통계 (오늘/백로그/완료 카운트)
   - ✅ 우선순위별 작업 분포
   - ✅ 태그별 작업 분류
   - ✅ 사이드바 통계 대시보드

3. **사용자 경험** ✅
   - ✅ 라이트/다크/자동 테마 지원
   - ✅ 키보드 단축키 (Ctrl+N, Ctrl+B, ESC)
   - ✅ 완전 반응형 디자인 (모바일/태블릿/데스크톱)
   - ✅ 접근성 고려 (ARIA 레이블, 키보드 네비게이션)
   - ✅ 로딩 상태 및 에러 처리
   - ✅ 빈 상태 UI (Empty State)

### 2.3 설정 기능 - ✅ 신규 구현
1. **외관 설정** ✅
   - ✅ 테마 변경 (라이트/다크/자동)
   - ✅ 컴팩트 모드 설정
   - ✅ 완료된 작업 표시 설정

2. **키보드 단축키** ✅
   - ✅ 모든 단축키 가이드 표시
   - ✅ 실시간 단축키 동작

3. **데이터 관리** ✅
   - ✅ 설정 화면에서 바로 내보내기/가져오기
   - ✅ 자동 백업 설정
   - ✅ 전체 데이터 삭제 (이중 확인)

4. **알림 설정** ✅
   - ✅ 데스크톱 알림 설정
   - ✅ 효과음 설정
   - ✅ 마감일 알림 설정 (5분~1시간 전)

### 2.4 캘린더 뷰 - ✅ 신규 구현
1. **월별 캘린더** ✅
   - ✅ 표준 7일×6주 캘린더 그리드
   - ✅ 이전/다음 달 네비게이션
   - ✅ 오늘 날짜 하이라이트
   - ✅ 월/연도 표시

2. **작업 표시** ✅
   - ✅ 생성일, 마감일, 완료일 기준 작업 표시
   - ✅ 우선순위별 색상 구분
   - ✅ 상태별 스타일링 (완료/오늘/백로그)
   - ✅ 날짜별 작업 수 표시

3. **뷰 전환** ✅
   - ✅ 헤더의 목록/캘린더 뷰 토글 버튼
   - ✅ 매끄러운 뷰 전환
   - ✅ 선택된 뷰 시각적 표시

4. **인터랙션** ✅
   - ✅ 작업 클릭으로 편집 모달 열기
   - ✅ 날짜 클릭으로 새 작업 추가
   - ✅ 반응형 디자인 (모바일/데스크톱)

### 2.5 드래그 앤 드롭 - ✅ 신규 구현
1. **작업 리스트 드래그 앤 드롭** ✅
   - ✅ @dnd-kit 라이브러리 기반 구현
   - ✅ 상태별 섹션 간 드래그 이동
   - ✅ 동일 상태 내 순서 변경
   - ✅ 드래그 핸들 (GripVertical 아이콘)

2. **캘린더 뷰 드래그 앤 드롭** ✅
   - ✅ 작업을 날짜 셀로 드래그하여 마감일 변경
   - ✅ 캘린더 날짜 간 작업 이동
   - ✅ 드래그 오버레이 시각적 피드백

3. **사이드바 드롭존** ✅
   - ✅ 사이드바 상태 카테고리로 드래그
   - ✅ 오늘 할 일/백로그/완료 간 빠른 이동
   - ✅ 드롭존 하이라이트 표시

4. **시각적 피드백** ✅
   - ✅ 드래그 중 투명도 및 회전 효과
   - ✅ 드롭 가능 영역 테두리 하이라이트
   - ✅ "여기에 놓기" 텍스트 표시
   - ✅ DragOverlay로 드래그 중인 요소 표시

## 3. 데이터 모델 (최종 구현)

### 3.1 Task 인터페이스
```typescript
interface Task {
  id: string;                    // UUID v4
  title: string;                 // 작업 제목 (필수, 1-200자)
  description?: string;          // 상세 설명 (선택, 최대 1000자)
  status: 'backlog' | 'today' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];              // 태그 배열 (자동 정렬, 중복 방지)
  createdAt: Date;              // 생성 시간 (자동)
  updatedAt: Date;              // 수정 시간 (자동)
  completedAt?: Date;           // 완료 시간 (상태 변경 시 자동)
  estimatedTime?: number;       // 예상 소요 시간 (1-480분)
  actualTime?: number;          // 실제 소요 시간 (미래 기능)
  dueDate?: Date;              // 마감일 (선택)
  recurring?: RecurringPattern; // 반복 패턴 (미래 기능)
}
```

### 3.2 AppState 인터페이스 (최종)
```typescript
interface AppState {
  view: ViewMode;                // 'list' | 'calendar' 구현 완료
  theme: Theme;                  // 'light' | 'dark' | 'auto'
  settings: UserSettings;        // 사용자 설정
  sidebarOpen: boolean;         // 사이드바 표시 상태
  selectedTask: Task | null;    // 현재 선택된 작업
  modalOpen: boolean;           // 작업 모달 상태
  settingsModalOpen: boolean;   // 설정 모달 상태 (신규)
}

interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;         // 미래 기능
  showCompleted: boolean;       // 완료 작업 표시 여부
  autoBackup: boolean;          // 자동 백업 설정
  notifications: {
    desktop: boolean;           // 데스크톱 알림
    sound: boolean;            // 효과음
    dueDateReminders: boolean; // 마감일 알림
    reminderMinutes: number;   // 알림 시점 (분)
  };
}
```

## 4. 컴포넌트 구조 (최종 구현)

### 4.1 실제 구현된 컴포넌트 계층
```
App
├── AppProvider (Context)
└── AppContent
    ├── Header
    │   ├── 햄버거 메뉴 (모바일)
    │   ├── 로고 및 제목
    │   ├── 검색바 (실시간 검색)
    │   └── 액션 버튼들
    │       ├── 뷰 전환 토글 (목록/캘린더)
    │       ├── 데이터 가져오기
    │       ├── 데이터 내보내기
    │       ├── 테마 토글
    │       └── 설정 버튼 (신규)
    ├── Sidebar
    │   ├── 상태별 네비게이션
    │   │   ├── 오늘 할 일 (카운트)
    │   │   ├── 백로그 (카운트)
    │   │   └── 완료됨 (카운트)
    │   ├── 우선순위 필터
    │   ├── 태그 필터 (동적 생성)
    │   ├── 필터 초기화
    │   └── 통계 대시보드
    ├── MainContent
    │   ├── ListView (기본 뷰)
    │   │   ├── QuickAddBar
    │   │   ├── TaskList (상태별 그룹화)
    │   │   │   └── TaskItem (각 작업)
    │   │   │       ├── 드래그 핸들
    │   │   │       ├── 완료 체크박스
    │   │   │       ├── 작업 내용
    │   │   │       ├── 메타 정보 (우선순위, 마감일, 태그 등)
    │   │   │       └── 액션 버튼 (수정, 삭제, 상태 변경)
    │   │   └── EmptyState (작업 없을 때)
    │   └── CalendarView (캘린더 뷰)
    │       ├── 캘린더 헤더 (월 네비게이션)
    │       ├── 요일 헤더
    │       ├── 캘린더 그리드 (42일)
    │       │   └── CalendarDateCell
    │       │       ├── 날짜 번호
    │       │       ├── 작업 리스트
    │       │       │   └── DraggableCalendarTask
    │       │       └── 새 작업 추가 버튼
    │       └── DragOverlay
    ├── TaskModal (작업 생성/수정)
    │   ├── 제목 입력
    │   ├── 설명 입력
    │   ├── 우선순위 선택
    │   ├── 상태 선택
    │   ├── 예상 시간 입력
    │   ├── 마감일 선택
    │   ├── 태그 관리 (추가/제거)
    │   └── 저장/취소 버튼
    └── SettingsModal (설정) - 신규 구현
        ├── 외관 설정
        ├── 키보드 단축키 가이드
        ├── 데이터 관리
        └── 알림 설정
```

## 5. 사용자 인터페이스 (최종 구현)

### 5.1 실제 구현된 화면 구성

#### 메인 화면 - 목록 뷰 (데스크톱)
```
┌─────────────────────────────────────────────────────────────────┐
│ [≡] Today's Backlog  [🔍 Search...] [📋][📅] [📥][📤] [🌙] [⚙️] │
├─────────────────┬───────────────────────────────────────────────┤
│                 │  ┌─────────────────────────────────────────┐  │
│ 📌 오늘 할 일(2)│  │ [+ 새 작업 추가하기] or press Ctrl+N   │  │
│ 📋 백로그 (5)   │  └─────────────────────────────────────────┘  │
│ ✅ 완료됨 (3)   │                                                │
│                 │  오늘 할 일 ─────────────────────────────────  │
│ ─────────────   │  ┌─────────────────────────────────────────┐  │
│ 긴급 ●● (1)     │  │ ⋮⋮ □ [긴급] 프로덕션 핫픽스 배포        │  │
│ 높음 ●● (3)     │  │   Due: 2시간 후 | 60분 | #urgent #backend│  │
│ 보통 ●● (2)     │  ├─────────────────────────────────────────┤  │
│ 낮음 ●● (1)     │  │ ⋮⋮ □ [높음] PR #245 리뷰              │  │
│                 │  │   45분 | #review #frontend | ➡️ 상태변경  │  │
│ ─────────────   │  └─────────────────────────────────────────┘  │
│ #backend (3)    │                                                │
│ #frontend (2)   │  백로그 ──────────────────────────────────── │
│ #review (2)     │  ┌─────────────────────────────────────────┐  │
│                 │  │ ⋮⋮ □ [높음] 인증 모듈 리팩토링          │  │
│ [필터 초기화]   │  │ ⋮⋮ □ [보통] API 테스트 케이스 작성      │  │
│                 │  │ ⋮⋮ □ [낮음] 새로운 프레임워크 리서치     │  │
│ 📊 통계         │  └─────────────────────────────────────────┘  │
│ 오늘: 2개       │                                                │
│ 백로그: 5개     │  완료된 작업 ─────────────────────────────── │
│ 완료: 3개       │  ┌─────────────────────────────────────────┐  │
│                 │  │ ✓ [보통] 문서 업데이트 (1시간 전 완료)   │  │
│                 │  │ ✓ [높음] 데이터베이스 최적화 (2일 전)     │  │
│                 │  └─────────────────────────────────────────┘  │
└─────────────────┴───────────────────────────────────────────────┘
```

#### 메인 화면 - 캘린더 뷰 (데스크톱)
```
┌─────────────────────────────────────────────────────────────────┐
│ [≡] Today's Backlog  [🔍 Search...] [📋][📅] [📥][📤] [🌙] [⚙️] │
├─────────────────┬───────────────────────────────────────────────┤
│                 │                                                │
│ 📌 오늘 할 일(2)│     2025년 8월           [<] [오늘] [>]       │
│ 📋 백로그 (5)   │  ┌─────────────────────────────────────────┐  │
│ ✅ 완료됨 (3)   │  │  일   월   화   수   목   금   토        │  │
│                 │  ├─────────────────────────────────────────┤  │
│ ─────────────   │  │ 27  28  29  30  31   1   2             │  │
│ 긴급 ●● (1)     │  │                    ●●   ●               │  │
│ 높음 ●● (3)     │  │  3   4   5   6   7   8   9             │  │
│ 보통 ●● (2)     │  │      ●               ●●  ●●             │  │
│ 낮음 ●● (1)     │  │ 10  11  12  13  14  15  16             │  │
│                 │  │  ●               ●   ●                  │  │
│ ─────────────   │  │ 17  18  19  20  21  22  23             │  │
│ #backend (3)    │  │              ●   📅                    │  │
│ #frontend (2)   │  │ 24  25  26  27  28  29  30             │  │
│ #review (2)     │  │  ●                                      │  │
│                 │  │ 31   1   2   3   4   5   6             │  │
│ [필터 초기화]   │  └─────────────────────────────────────────┘  │
│                 │                                                │
│ 📊 통계         │  • 드래그하여 날짜 간 작업 이동               │
│ 오늘: 2개       │  • 날짜 클릭으로 새 작업 추가                │
│ 백로그: 5개     │  • 작업 클릭으로 수정                       │
│ 완료: 3개       │                                                │
└─────────────────┴───────────────────────────────────────────────┘
```

#### 설정 모달 (신규 구현)
```
┌────────────────────────────────────────────┐
│ 설정                                  [X]  │
├────────────────────────────────────────────┤
│                                            │
│ 🎨 외관                                    │
│ ┌──────────────────────────────────────┐  │
│ │ 테마: [●라이트 ○다크 ○자동]         │  │
│ │ 컴팩트 모드: [□]                     │  │
│ │ 완료된 작업 표시: [✓]               │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ ⌨️ 키보드 단축키                           │
│ ┌──────────────────────────────────────┐  │
│ │ 새 작업:         Ctrl + N            │  │
│ │ 사이드바 토글:   Ctrl + B            │  │
│ │ 모달 닫기:       ESC                │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ 💾 데이터 관리                             │
│ ┌──────────────────────────────────────┐  │
│ │ [📥 데이터 가져오기] [📤 데이터 내보내기] │  │
│ │ [🗑️ 모든 데이터 삭제]                │  │
│ │ 자동 백업: [✓] 매일                  │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ 🔔 알림                                    │
│ ┌──────────────────────────────────────┐  │
│ │ 데스크톱 알림: [□]                   │  │
│ │ 효과음: [□]                          │  │
│ │ 마감일 알림: [✓] 15분 전             │  │
│ └──────────────────────────────────────┘  │
│                                            │
│                      [취소]     [저장]     │
└────────────────────────────────────────────┘
```

### 5.2 반응형 디자인 (완전 구현)

#### 모바일 화면 (< 768px)
- 사이드바 자동 숨김 (햄버거 메뉴로 토글)
- 검색바 축소 표시
- 작업 항목 세로 레이아웃
- 터치 친화적 버튼 크기

#### 태블릿 화면 (768px - 1024px)
- 접을 수 있는 사이드바
- 적절한 여백과 패딩
- 터치와 마우스 동시 지원

## 6. 기술 구현 (최종)

### 6.1 실제 폴더 구조
```
src/
├── components/
│   ├── common/
│   │   └── EmptyState.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainContent.tsx
│   └── features/
│       ├── TaskList.tsx (드래그 앤 드롭 지원)
│       ├── TaskItem.tsx (드래그 핸들 추가)
│       ├── TaskModal.tsx
│       ├── CalendarView.tsx (신규)
│       └── SettingsModal.tsx (신규)
├── hooks/
│   ├── useLocalStorage.ts
│   └── useTask.ts
├── contexts/
│   ├── AppContext.tsx
│   └── index.ts
├── utils/
│   ├── storage.ts
│   ├── date.ts
│   ├── validators.ts
│   └── seedData.ts (개발용)
├── types/
│   └── index.ts
└── App.tsx
```

### 6.2 사용된 라이브러리
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "lucide-react": "^0.540.0",
    "uuid": "^11.1.0",
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.0.0"
  },
  "devDependencies": {
    "vite": "^7.1.2",
    "typescript": "~5.8.3",
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "@types/node": "^24.3.0",
    "@types/uuid": "^10.0.0"
  }
}
```

### 6.3 상태 관리
- **Context API + useReducer**: 전역 상태 관리
- **Custom Hooks**: 작업 관리, 로컬스토리지 로직 캡슐화
- **실시간 동기화**: 모든 변경사항 즉시 LocalStorage 저장

### 6.4 데이터 저장 (실제 구현)
```typescript
// LocalStorage 키 구조
{
  "todays-backlog-tasks": Task[],        // 모든 작업 데이터
  "todays-backlog-settings": UserSettings, // 사용자 설정
  "todays-backlog-backup": {               // 자동 백업
    timestamp: string,
    data: Task[]
  }
}
```

## 7. ✅ 구현 완료 현황

### 7.1 핵심 기능 완료도
- ✅ 작업 CRUD (100%)
- ✅ 상태 관리 (100%)
- ✅ 필터링 및 검색 (100%)
- ✅ 데이터 관리 (100%)
- ✅ 설정 시스템 (100%)
- ✅ 캘린더 뷰 (100%)
- ✅ 드래그 앤 드롭 (100%)
- ✅ 반응형 UI (100%)
- ✅ 키보드 단축키 (100%)
- ✅ 테마 시스템 (100%)

### 7.2 품질 보증
- ✅ TypeScript 컴파일 (에러 0개)
- ✅ ESLint 검사 통과
- ✅ 프로덕션 빌드 성공
- ✅ 크로스 브라우저 호환성
- ✅ 접근성 고려 (ARIA, 키보드 네비게이션)
- ✅ 에러 처리 및 검증

### 7.3 성능 최적화
- ✅ Vite 번들링 (고속 개발 서버)
- ✅ React 19 최신 기능 활용
- ✅ 메모이제이션 (React.memo, useCallback)
- ✅ 효율적인 리렌더링
- ✅ 최소한의 의존성

## 8. 사용 가이드

### 8.1 개발 환경 실행
```bash
# 개발 서버 시작
npm run dev           # http://localhost:5173

# 프로덕션 빌드
npm run build        # dist/ 폴더에 빌드됨

# 타입 검사
npx tsc --noEmit    # 타입 에러 확인

# 린트 검사
npm run lint        # ESLint 검사
```

### 8.2 주요 기능 사용법
1. **새 작업 추가**: `+ 새 작업 추가하기` 버튼 또는 `Ctrl+N`
2. **작업 검색**: 상단 검색바에 키워드 입력
3. **필터링**: 사이드바에서 상태/우선순위/태그 선택
4. **뷰 전환**: 헤더의 목록/캘린더 버튼으로 뷰 전환
5. **드래그 앤 드롭**: 작업을 다른 상태나 날짜로 드래그하여 이동
6. **설정**: 우상단 톱니바퀴 버튼 클릭
7. **데이터 백업**: 설정에서 내보내기/가져오기
8. **테마 변경**: 헤더의 달/해 아이콘 또는 설정에서 변경

### 8.3 키보드 단축키
- `Ctrl + N`: 새 작업 추가
- `Ctrl + B`: 사이드바 토글
- `ESC`: 열린 모달 닫기

## 9. 향후 개선 사항

### 9.1 현재 미구현 기능
- 📊 상세 통계 차트 (기본 통계는 구현됨)
- 🔁 반복 작업 (데이터 모델만 준비됨)
- ⏱️ 실제 소요 시간 추적 (데이터 모델만 준비됨)
- 📋 보드 뷰 (칸반 스타일)
- 🔔 실시간 데스크톱 알림

### 9.2 확장 계획
- PWA 변환 (오프라인 지원)
- 클라우드 동기화
- 팀 협업 기능
- 모바일 앱 (React Native)
- 브라우저 확장 프로그램

## 10. 프로젝트 성과

### 10.1 기술적 성과
- ✅ **최신 기술 스택**: React 19 + TypeScript + Vite
- ✅ **완전한 반응형 디자인**: 모든 디바이스 지원
- ✅ **타입 안전성**: 100% TypeScript 커버리지
- ✅ **성능 최적화**: 빠른 로딩과 반응성
- ✅ **코드 품질**: ESLint + Prettier 적용

### 10.2 사용성 성과
- ✅ **직관적 UI**: 학습 곡선 없는 인터페이스
- ✅ **키보드 친화적**: 모든 기능 키보드로 접근 가능
- ✅ **데이터 안전성**: 로컬 저장 + 백업/복원
- ✅ **접근성**: 스크린 리더 및 키보드 네비게이션 지원
- ✅ **다국어 준비**: 한국어 UI (영어 확장 가능)

## 11. 외부 데이터 연동 설계 (v2.0 계획)

### 11.1 개요
현재 LocalStorage 기반 시스템을 확장하여 다양한 외부 데이터 소스와 연동할 수 있는 유연한 아키텍처를 설계합니다.

### 11.2 지원할 데이터 소스

#### 11.2.1 클라우드 스토리지 서비스
```typescript
interface CloudStorageProvider {
  name: string;
  apiEndpoint: string;
  authenticate(): Promise<AuthResult>;
  sync(data: Task[]): Promise<SyncResult>;
  fetch(): Promise<Task[]>;
}

// 지원 예정 서비스
const cloudProviders = {
  'google-drive': GoogleDriveProvider,
  'dropbox': DropboxProvider,
  'onedrive': OneDriveProvider,
  'icloud': iCloudProvider,
};
```

#### 11.2.2 백엔드 데이터베이스
```typescript
interface DatabaseProvider {
  name: string;
  connectionConfig: DatabaseConfig;
  connect(): Promise<Connection>;
  query(sql: string, params?: any[]): Promise<QueryResult>;
}

// 지원 예정 데이터베이스
const databaseProviders = {
  'firebase': FirebaseProvider,
  'supabase': SupabaseProvider,
  'mongodb': MongoDBProvider,
  'postgresql': PostgreSQLProvider,
  'mysql': MySQLProvider,
};
```

#### 11.2.3 외부 서비스 API
```typescript
interface ExternalServiceProvider {
  name: string;
  baseUrl: string;
  apiKey?: string;
  authenticate(): Promise<void>;
  importTasks(): Promise<Task[]>;
  exportTasks(tasks: Task[]): Promise<void>;
}

// 지원 예정 외부 서비스
const externalServices = {
  'notion': NotionProvider,
  'trello': TrelloProvider,
  'asana': AsanaProvider,
  'jira': JiraProvider,
  'github-issues': GitHubProvider,
  'todoist': TodoistProvider,
  'google-calendar': GoogleCalendarProvider,
};
```

### 11.3 통합 데이터 관리자 (DataManager) 아키텍처

#### 11.3.1 DataManager 인터페이스
```typescript
interface DataManager {
  // 현재 데이터 소스
  currentProvider: DataProvider;
  
  // 연결된 모든 프로바이더
  connectedProviders: Map<string, DataProvider>;
  
  // 데이터 작업
  getTasks(): Promise<Task[]>;
  saveTasks(tasks: Task[]): Promise<void>;
  syncAllProviders(): Promise<SyncResult[]>;
  
  // 프로바이더 관리
  addProvider(name: string, provider: DataProvider): void;
  removeProvider(name: string): void;
  switchProvider(name: string): void;
  
  // 동기화 설정
  enableAutoSync(interval: number): void;
  disableAutoSync(): void;
}

interface DataProvider {
  name: string;
  type: 'local' | 'cloud' | 'database' | 'api';
  isConnected: boolean;
  lastSync?: Date;
  
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  fetch(): Promise<Task[]>;
  save(tasks: Task[]): Promise<void>;
  sync(): Promise<SyncResult>;
}

interface SyncResult {
  success: boolean;
  message: string;
  conflictCount: number;
  resolvedConflicts: ConflictResolution[];
  lastSyncTime: Date;
}
```

#### 11.3.2 충돌 해결 전략
```typescript
enum ConflictResolutionStrategy {
  LOCAL_WINS = 'local_wins',      // 로컬 데이터 우선
  REMOTE_WINS = 'remote_wins',    // 원격 데이터 우선
  NEWEST_WINS = 'newest_wins',    // 최신 수정 시간 우선
  MANUAL_RESOLVE = 'manual',      // 사용자가 직접 선택
  MERGE = 'merge'                 // 자동 병합
}

interface ConflictResolution {
  taskId: string;
  localVersion: Task;
  remoteVersion: Task;
  strategy: ConflictResolutionStrategy;
  resolvedVersion: Task;
  resolvedAt: Date;
}
```

### 11.4 구체적인 연동 방법 설계

#### 11.4.1 Google Drive 연동
```typescript
class GoogleDriveProvider implements DataProvider {
  name = 'google-drive';
  type = 'cloud' as const;
  
  private gapi: any;
  private appDataFolder = 'todays-backlog';
  private fileName = 'tasks.json';
  
  async connect(): Promise<void> {
    // Google Drive API 인증
    await this.gapi.load('auth2', this.initAuth);
    await this.signIn();
  }
  
  async fetch(): Promise<Task[]> {
    const fileId = await this.findOrCreateFile();
    const response = await this.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    return JSON.parse(response.body);
  }
  
  async save(tasks: Task[]): Promise<void> {
    const fileId = await this.findOrCreateFile();
    const metadata = {
      name: this.fileName,
      parents: [this.appDataFolder]
    };
    
    await this.gapi.client.request({
      path: `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks)
    });
  }
}
```

#### 11.4.2 Firebase Firestore 연동
```typescript
class FirebaseProvider implements DataProvider {
  name = 'firebase';
  type = 'database' as const;
  
  private db: Firestore;
  private collection = 'tasks';
  
  async connect(): Promise<void> {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    
    // 인증 처리
    const auth = getAuth();
    await signInAnonymously(auth); // 또는 사용자 인증
  }
  
  async fetch(): Promise<Task[]> {
    const querySnapshot = await getDocs(
      collection(this.db, this.collection)
    );
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Task[];
  }
  
  async save(tasks: Task[]): Promise<void> {
    const batch = writeBatch(this.db);
    
    tasks.forEach(task => {
      const docRef = doc(this.db, this.collection, task.id);
      batch.set(docRef, {
        ...task,
        createdAt: Timestamp.fromDate(task.createdAt),
        updatedAt: Timestamp.fromDate(task.updatedAt),
      });
    });
    
    await batch.commit();
  }
  
  async sync(): Promise<SyncResult> {
    // 실시간 동기화를 위한 리스너 설정
    onSnapshot(collection(this.db, this.collection), (snapshot) => {
      const tasks = snapshot.docs.map(doc => this.docToTask(doc));
      this.onDataChange(tasks);
    });
    
    return { success: true, message: 'Real-time sync enabled' };
  }
}
```

#### 11.4.3 Notion 연동
```typescript
class NotionProvider implements DataProvider {
  name = 'notion';
  type = 'api' as const;
  
  private client: Client;
  private databaseId: string;
  
  async connect(): Promise<void> {
    this.client = new Client({
      auth: this.apiKey,
    });
    
    // 데이터베이스 생성 또는 찾기
    this.databaseId = await this.findOrCreateDatabase();
  }
  
  async fetch(): Promise<Task[]> {
    const response = await this.client.databases.query({
      database_id: this.databaseId,
    });
    
    return response.results.map(this.notionPageToTask);
  }
  
  async save(tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      if (task.notionPageId) {
        // 기존 페이지 업데이트
        await this.client.pages.update({
          page_id: task.notionPageId,
          properties: this.taskToNotionProperties(task),
        });
      } else {
        // 새 페이지 생성
        await this.client.pages.create({
          parent: { database_id: this.databaseId },
          properties: this.taskToNotionProperties(task),
        });
      }
    }
  }
  
  private notionPageToTask(page: any): Task {
    return {
      id: page.id,
      title: page.properties.Title.title[0]?.text?.content || '',
      description: page.properties.Description?.rich_text[0]?.text?.content,
      status: page.properties.Status.select?.name?.toLowerCase() as TaskStatus,
      priority: page.properties.Priority.select?.name?.toLowerCase() as TaskPriority,
      tags: page.properties.Tags.multi_select?.map((tag: any) => tag.name),
      createdAt: new Date(page.created_time),
      updatedAt: new Date(page.last_edited_time),
      dueDate: page.properties.DueDate.date ? new Date(page.properties.DueDate.date.start) : undefined,
      notionPageId: page.id, // Notion 전용 필드
    };
  }
}
```

### 11.5 UI/UX 변경 사항

#### 11.5.1 데이터 소스 관리 화면
```typescript
interface DataSourceConfig {
  id: string;
  name: string;
  type: DataProviderType;
  isConnected: boolean;
  lastSync?: Date;
  autoSync: boolean;
  syncInterval: number; // 분 단위
}

// 설정 모달에 새 탭 추가
const SettingsModal = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  
  return (
    <div className="settings-modal">
      <TabNavigation>
        <Tab id="appearance">외관</Tab>
        <Tab id="data">데이터 관리</Tab>
        <Tab id="datasources">데이터 소스</Tab> {/* 새 탭 */}
        <Tab id="notifications">알림</Tab>
      </TabNavigation>
      
      {activeTab === 'datasources' && (
        <DataSourceManager />
      )}
    </div>
  );
};
```

#### 11.5.2 동기화 상태 표시
```typescript
const SyncStatusIndicator = () => {
  const { syncStatus, lastSyncTime } = useDataManager();
  
  return (
    <div className="sync-status">
      <Icon 
        name={syncStatus === 'syncing' ? 'loader' : 'cloud'} 
        className={syncStatus === 'syncing' ? 'animate-spin' : ''}
      />
      <span>{getSyncStatusText(syncStatus, lastSyncTime)}</span>
    </div>
  );
};
```

### 11.6 보안 및 프라이버시 고려사항

#### 11.6.1 데이터 암호화
```typescript
class EncryptionManager {
  private encryptionKey: string;
  
  async encryptData(data: Task[]): Promise<string> {
    const jsonData = JSON.stringify(data);
    return await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: this.generateIV() },
      await this.getKey(),
      new TextEncoder().encode(jsonData)
    );
  }
  
  async decryptData(encryptedData: string): Promise<Task[]> {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: this.extractIV(encryptedData) },
      await this.getKey(),
      this.base64ToArrayBuffer(encryptedData)
    );
    
    return JSON.parse(new TextDecoder().decode(decrypted));
  }
}
```

#### 11.6.2 OAuth 인증 관리
```typescript
class AuthManager {
  private tokens: Map<string, OAuthToken> = new Map();
  
  async authenticateProvider(providerName: string): Promise<void> {
    switch (providerName) {
      case 'google-drive':
        await this.authenticateGoogle();
        break;
      case 'notion':
        await this.authenticateNotion();
        break;
      // 기타 프로바이더들...
    }
  }
  
  async refreshToken(providerName: string): Promise<void> {
    const token = this.tokens.get(providerName);
    if (token && this.isTokenExpired(token)) {
      await this.refreshOAuthToken(providerName, token);
    }
  }
}
```

### 11.7 구현 우선순위 및 로드맵

#### 11.7.1 Phase 1: 기본 클라우드 연동 (3개월)
- ✅ LocalStorage (현재 구현됨)
- 🔄 Google Drive API 연동
- 🔄 Dropbox API 연동
- 🔄 기본 동기화 UI

#### 11.7.2 Phase 2: 데이터베이스 연동 (2개월)
- 🔄 Firebase Firestore 연동
- 🔄 Supabase 연동  
- 🔄 실시간 동기화 지원
- 🔄 충돌 해결 UI

#### 11.7.3 Phase 3: 외부 서비스 연동 (4개월)
- 🔄 Notion 데이터베이스 연동
- 🔄 Trello 보드 연동
- 🔄 GitHub Issues 연동
- 🔄 Google Calendar 연동

#### 11.7.4 Phase 4: 고급 기능 (2개월)
- 🔄 멀티 프로바이더 동시 동기화
- 🔄 데이터 암호화
- 🔄 백업 및 복원 자동화
- 🔄 협업 기능

### 11.8 기술적 고려사항

#### 11.8.1 성능 최적화
- **캐싱 전략**: 자주 접근하는 데이터를 메모리에 캐시
- **지연 로딩**: 필요한 데이터만 필요할 때 로드
- **배치 처리**: 대량 데이터 처리 시 배치로 나누어 처리
- **압축**: 네트워크 전송 시 데이터 압축

#### 11.8.2 에러 처리
- **재시도 메커니즘**: 네트워크 오류 시 자동 재시도
- **오프라인 지원**: 네트워크 연결이 끊어져도 로컬에서 작업 가능
- **에러 리포팅**: 동기화 실패 시 상세한 에러 정보 제공

#### 11.8.3 데이터 일관성
- **버전 관리**: 각 작업에 버전 번호 추가
- **타임스탬프 기반 병합**: 수정 시간을 기준으로 충돌 해결
- **체크섬 검증**: 데이터 무결성 검증

### 11.9 사용자 경험 개선

#### 11.9.1 설정 마법사
```typescript
const DataSourceSetupWizard = () => {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string>();
  
  return (
    <WizardContainer>
      <Step1_SelectProvider onNext={setSelectedProvider} />
      <Step2_Authentication provider={selectedProvider} />
      <Step3_Configuration />
      <Step4_InitialSync />
      <Step5_Complete />
    </WizardContainer>
  );
};
```

#### 11.9.2 동기화 진행률 표시
```typescript
const SyncProgress = () => {
  const { syncProgress } = useDataManager();
  
  return (
    <ProgressBar 
      value={syncProgress.percentage}
      label={`${syncProgress.current}/${syncProgress.total} 작업 동기화 중...`}
    />
  );
};
```

### 11.10 배포 및 운영

#### 11.10.1 환경별 설정
```typescript
// config/datasources.ts
export const dataSourceConfig = {
  development: {
    enabledProviders: ['localStorage', 'firebase'],
    autoSync: false,
  },
  production: {
    enabledProviders: ['localStorage', 'googleDrive', 'firebase', 'notion'],
    autoSync: true,
    syncInterval: 5, // 5분마다
  }
};
```

#### 11.10.2 모니터링 및 로깅
```typescript
class DataSyncMonitor {
  logSyncAttempt(provider: string, taskCount: number): void {
    console.log(`[SYNC] ${provider}: ${taskCount} tasks`);
    // 실제 운영에서는 외부 로깅 서비스로 전송
  }
  
  trackSyncPerformance(provider: string, duration: number): void {
    // 성능 메트릭 수집
    analytics.track('data_sync_performance', {
      provider,
      duration,
      timestamp: new Date(),
    });
  }
}
```

---

**🎉 Today's Backlog v1.0 구현 완료!**
**📅 캘린더 뷰 추가 완료!**
**🎯 드래그 앤 드롭 기능 추가 완료!**
**🚀 v2.0 외부 데이터 연동 설계 완료!**

---
*최종 업데이트: 2025년 8월 22일*  
*개발자: Claude Code Assistant*  
*라이선스: MIT*