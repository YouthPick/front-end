import { Policy } from "./types";

export const REGIONS = [
  "전체",
  "서울특별시",
  "부산광역시",
  "경기도",
  "인천광역시",
  "대구광역시",
  "대전광역시",
  "광주광역시",
  "세종특별자치시",
  "강원특별자치도",
  "제주특별자치도"
];

export const STATUSES = [
  "전체",
  "취업준비",
  "대학생",
  "대학원생",
  "직장인",
  "창업자",
  "미취업"
];

export const CATEGORIES = [
  "전체",
  "일자리",
  "주거",
  "교육",
  "복지·문화",
  "참여·권리"
];

export const AGES = [
  "전체",
  "만 19~34세",
  "만 18세 이하",
  "만 35세 이상"
];

export const MOCK_POLICIES: Policy[] = [
  {
    id: "p1",
    title: "청년 디지털 일자리 지원 사업",
    category: "일자리",
    region: "서울특별시",
    tag: "HIGH",
    description: "IT 분야 실무 경험과 교육을 제공하고 취업 연계를 지원하는 고용노동부 주관 사업입니다.",
    target: "만 19~34세",
    deadline: "2025.06.30",
    logoType: "job",
    details: [
      "지원내용: 청년 채용 기업에 인건비 월 최대 190만원 지원 및 실무 교육 제공",
      "자격조건: 만 19세 이상 34세 이하의 미취업 청년",
      "근무조건: 주 30시간 이상 근로, 3개월 이상 채용 계약"
    ],
    link: "https://www.work.go.kr"
  },
  {
    id: "p2",
    title: "청년 월세 한시 특별지원",
    category: "주거",
    region: "서울특별시",
    tag: "추천",
    description: "서울 및 전국 무주택 청년의 주거비 부담 경감을 위해 실제 납부하는 월세를 지원합니다.",
    target: "만 19~34세",
    deadline: "2025.06.30",
    logoType: "home",
    details: [
      "지원내용: 실제 납부하는 월세 범위 내에서 월 최대 20만원까지 최장 12개월 분할 지원",
      "자격조건: 부모와 별도 거주하는 무주택 청년 중 소득 기준 충족자",
      "임차기준: 임차보증금 5천만원 이하 및 월세 60만원 이하"
    ],
    link: "https://www.bokjiro.go.kr"
  },
  {
    id: "p3",
    title: "K-디지털 트레이닝 (국비지원)",
    category: "교육",
    region: "서울특별시",
    tag: "HIGH",
    description: "디지털, AI, 신기술 핵심 실무 중심 교육을 통해 고소득 기술 취업 역량을 극대화하는 과정입니다.",
    target: "만 19~34세",
    deadline: "2025.07.15",
    logoType: "education",
    details: [
      "지원내용: 수강료 전액 지원(국비무료) 및 월 최대 31만 6천원의 훈련장려금 지급",
      "자격조건: 만 19세~34세 대학 졸업(예정)자 및 미취업 청년",
      "교육기간: 평균 6개월 (평일 주간 8시간 밀착 교육)"
    ],
    link: "https://www.hrd.go.kr"
  },
  {
    id: "p4",
    title: "청년내일채움공제",
    category: "일자리",
    region: "경기도",
    tag: "NEW",
    description: "중소기업 취업 청년의 자산 형성을 지원하여 장기 근속을 유도하고 대기업과의 격차를 완화합니다.",
    target: "만 15~34세",
    deadline: "2025.08.31",
    logoType: "job",
    details: [
      "지원내용: 청년이 2년간 300만원을 적립하면 정부와 기업이 적립해 총 1,200만원 자산 마련",
      "자격조건: 5인 이상 중소기업에 신규 취업한 청년 및 해당 기업",
      "가입기간: 정규직 입사일로부터 6개월 이내 신청 필수"
    ],
    link: "https://www.sbcof.or.kr"
  },
  {
    id: "p5",
    title: "청년 주거급여 분리지급",
    category: "주거",
    region: "서울특별시",
    tag: "추천",
    description: "주거급여 수급 가구 중 학업이나 취업으로 부모와 타 지역에 거주하는 청년에게 별도로 급여를 지급합니다.",
    target: "만 19~30세",
    deadline: "2025.12.31",
    logoType: "home",
    details: [
      "지원내용: 부모와 떨어진 별도 가구원에 대해 서울 및 해당 지역 기준 임차료 지급",
      "자격조건: 주거급여 수급 가구원 중 만 19세 이상 30세 미만 미혼 자녀",
      "신청방법: 주민등록상 부모 거주지 읍면동 행정복지센터 방문 혹은 복지로 온라인 신청"
    ],
    link: "https://www.bokjiro.go.kr"
  },
  {
    id: "p6",
    title: "국민내일배움카드",
    category: "교육",
    region: "전국",
    tag: "NEW",
    description: "취업준비생 및 이직 희망 청년이 스스로 직업 능력을 개발하도록 평생교육 배움 비용을 보조합니다.",
    target: "전체",
    deadline: "2025.12.31",
    logoType: "education",
    details: [
      "지원내용: 5년간 300만원에서 최대 500만원까지의 훈련 직무 수강 비용 45~85% 지원",
      "자격조건: 일반 직장인, 미취업 청년, 졸업 예정 대학생 등 누구나 발급 가능",
      "제외대상: 공무원, 사립학교 교직원, 연 매출 1억 5천만원 이상 자영업자 등"
    ],
    link: "https://www.hrd.go.kr"
  },
  {
    id: "p7",
    title: "서울시 청년수당",
    category: "복지·문화",
    region: "서울특별시",
    tag: "HIGH",
    description: "서울 거주 미취업 청년들의 안정적인 구직활동과 진로 개척을 돕기 위해 생계 보조 청년 수당을 지급합니다.",
    target: "만 19~34세",
    deadline: "2025.09.30",
    logoType: "heart",
    details: [
      "지원내용: 월 50만원씩 최대 6개월간 매월 체크카드 바우처 포인트 형태로 지원금 지급",
      "자격조건: 서울 거주 만 19세~34세 졸업 후 미취업자 중 중위소득 150% 이하",
      "필수활동: 주간 구직 활동 보고서 제출 및 진로 프로그램 참여"
    ],
    link: "https://youth.seoul.go.kr"
  },
  {
    id: "p8",
    title: "청년내일저축계좌",
    category: "복지·문화",
    region: "부산광역시",
    tag: "추천",
    description: "일하는 청년들이 주거, 취업 등으로 인한 자립 기반을 갖출 수 있도록 정부가 목돈을 함께 마련해 줍니다.",
    target: "만 19~34세",
    deadline: "2025.10.15",
    logoType: "heart",
    details: [
      "지원내용: 본인 저축 월 10만원당 정부 지원금 10만~30만원을 3년간 1:1 매칭 적립",
      "자격조건: 일하고 있는 만 19세~34세 이하 청년 중 소득기준 충족자",
      "만기적립금: 3년 만기 시 최대 1,440만원 및 근로소득공제금 추가 적립"
    ],
    link: "https://www.bokjiro.go.kr"
  },
  {
    id: "p9",
    title: "청년문화예술패스",
    category: "복지·문화",
    region: "전국",
    tag: "NEW",
    description: "사회에 첫 발을 내딛는 청년들에게 다채로운 문화생활과 연극, 전시, 음악 관람 비용을 전폭적으로 제공합니다.",
    target: "만 19세",
    deadline: "2025.11.30",
    logoType: "heart",
    details: [
      "지원내용: 공연 및 전시 관람료로 사용할 수 있는 포인트 최대 15만원 즉시 지급",
      "자격조건: 만 19세가 되는 국내 거주 모든 청년 (선착순 신청)",
      "사용처: 인터파크, 예스24 등 지정 티켓 판매처에서 포인트로 구매 가능"
    ],
    link: "https://www.kopis.or.kr"
  },
  {
    id: "p10",
    title: "정부부처 청년인턴",
    category: "참여·권리",
    region: "전국",
    tag: "추천",
    description: "중앙 행정 기관의 입법, 사업 진행 등의 부처 행정 실무를 인턴십으로 체험하고 참관할 기회를 제공합니다.",
    target: "만 19~34세",
    deadline: "2025.06.15",
    logoType: "hand",
    details: [
      "지원내용: 국가 공공 기관 인턴 근무 경력 증명서 발급 및 월 고정 기본급 및 수당 지급",
      "자격조건: 만 19세 이상 34세 이하의 미취업자 (학력 제한 없음)",
      "근무기간: 부처별 6개월 이내 단기 채용"
    ],
    link: "https://www.jobis.or.kr"
  },
  {
    id: "p_missing",
    title: "청년 취업지원 프로그램",
    category: "일자리",
    region: "전국",
    tag: "NEW",
    description: "현재 공식 원본을 확인할 수 없습니다. 저장한 기록과 메모는 유지됩니다.",
    target: "전체",
    deadline: "원본확인불가",
    logoType: "job",
    details: ["현재 이 정책의 원본 공고가 만료되었거나 삭제되었습니다. 개인 메모 및 이력은 유지됩니다."],
    link: "#",
    isSourceMissing: true
  }
];

export const RECENTLY_VIEWED_POLICIES = [
  { id: "p2", category: "주거", title: "청년 월세 한시 특별지원", date: "2025.05.28" },
  { id: "p4", category: "일자리", title: "청년내일채움공제", date: "2025.05.27" },
  { id: "p6", category: "교육", title: "국민내일배움카드", date: "2025.05.26" }
];
