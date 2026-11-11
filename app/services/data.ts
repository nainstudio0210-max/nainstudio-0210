// One entry per /services/<slug> landing page. The pages exist for search:
// nobody searches "나인스튜디오", they search "건축조감도" and "현상설계 CG", so
// each entry leads with the words a buyer actually types.
//
// Deliberately no prices and no turnaround figures anywhere in here. The studio
// has not given numbers it can hold to, and a landing page that promises days
// it cannot keep is worse than one that stays quiet.
//
// Every image points at /public/services/*.webp, which are web-sized copies of
// the /public/work originals (heroes 2560w, samples 1600w, WebP q82 — ~54MB of
// sources down to ~3.5MB). The originals stay where they are; /work still uses
// them. Four of them are 6–12MB, and one is a 10MB PNG: too heavy for the LCP
// element on a page that exists to rank, and over the size Vercel's image
// optimizer will take. To add or swap an image, derive a copy the same way
// rather than pointing this file back at /work.

export type Service = {
  slug: string
  /** Latin kicker above the headline, matching the home page sections. */
  eyebrow: string
  /** Nav/card label on the home page. */
  label: string
  headline: string
  lead: string
  /** <title>; the layout template appends " | 나인스튜디오". */
  metaTitle: string
  metaDescription: string
  keywords: string[]
  /** Short name/description for the Service JSON-LD node. */
  schemaName: string
  schemaDescription: string
  hero: { src: string; alt: string }
  /** "이런 경우에 필요합니다" — the buying situation, not the feature. */
  situations: string[]
  deliverables: { title: string; desc: string }[]
  process: { step: string; title: string; desc: string }[]
  /** Pulled from projects already published on /work. */
  /** `youtubeId` / `video` turn the tile into a player: `src` is then the
   *  poster. `locked` marks work the client has not cleared — shown grey. */
  samples: {
    src: string
    alt: string
    caption: string
    youtubeId?: string
    video?: string
    locked?: boolean
  }[]
  faq: { q: string; a: string }[]
}

export const services: Service[] = [
  {
    slug: "architectural-rendering",
    eyebrow: "Still",
    label: "건축 투시도 · 조감도",
    headline: "한 장으로 설득되는\n건축 투시도와 조감도",
    lead:
      "도면과 재질 정보만 있으면 완공 후의 빛과 분위기를 미리 만들어 드립니다. 심의, 분양, 내부 보고 — 한 장이 결정을 바꾸는 자리에 쓰이는 이미지를 제작합니다.",
    metaTitle: "건축 투시도·조감도 CG 제작 — 건축 렌더링 전문",
    metaDescription:
      "건축 투시도, 조감도, 야경 CG 제작. 도면과 재질 정보만으로 완공 후의 빛과 재질, 주변 맥락까지 구현합니다. 주거·상업·호텔 프로젝트 실적을 보유한 건축 시각화 스튜디오.",
    keywords: [
      "건축투시도",
      "건축조감도",
      "건축CG",
      "건축렌더링",
      "투시도제작",
      "조감도제작",
      "아파트조감도",
      "3D투시도",
      "건축CG업체",
      "야경투시도",
    ],
    schemaName: "건축 투시도·조감도 CG 제작",
    schemaDescription:
      "설계 도면을 기반으로 건축 투시도, 조감도, 야경 CG를 제작하는 건축 시각화 서비스.",
    // This page sells exteriors and aerials, so every image on it has to be
    // one. An atrium shot here reads as "they only do interiors".
    hero: {
      src: "/services/rendering-hero.webp",
      alt: "노출 콘크리트 외관과 진입부를 담은 건축 투시도 CG",
    },
    situations: [
      "분양 또는 심의 자료에 들어갈 대표 이미지가 필요한 경우",
      "설계안의 재질과 입면 느낌을 내부에서 먼저 확인해야 하는 경우",
      "기존 조감도가 오래되어 변경된 설계와 맞지 않는 경우",
    ],
    deliverables: [
      {
        title: "외관 투시도 · 조감도",
        desc: "아이레벨 투시도부터 고층 조감도까지, 프로젝트 성격에 맞는 시점으로 구성합니다.",
      },
      {
        title: "주경 · 야경",
        desc: "같은 앵글의 주경과 야경을 함께 제작해 분양 자료의 분위기 폭을 넓힙니다.",
      },
      {
        title: "실내 투시도",
        desc: "로비, 세대 내부, 커뮤니티 공간 등 내부 마감과 조명 계획을 담은 이미지.",
      },
      {
        title: "배경 합성 · 주변 맥락",
        desc: "실제 대지 사진이나 주변 도시 맥락을 반영해 현장감을 맞춥니다.",
      },
    ],
    process: [
      {
        step: "01",
        title: "자료 검토",
        desc: "도면, 3D 모델, 재질 정보, 참고 이미지를 받아 작업 범위와 시점 개수를 정리합니다.",
      },
      {
        step: "02",
        title: "앵글 확정",
        desc: "클레이 상태의 저해상 시점 컷을 먼저 보여드리고 구도를 확정합니다. 여기서 틀어지면 뒤가 전부 틀어집니다.",
      },
      {
        step: "03",
        title: "1차 시안",
        desc: "재질, 조명, 식재, 인물까지 올린 1차 이미지를 전달하고 수정 의견을 받습니다.",
      },
      {
        step: "04",
        title: "최종 납품",
        desc: "인쇄용 고해상 원본과 웹용 파일을 함께 전달합니다.",
      },
    ],
    samples: [
      {
        src: "/services/rendering-01.webp",
        alt: "골드코스트 수변 복합 단지 건축 조감도 CG",
        caption: "Gold Coast 수변 단지 조감도",
      },
      {
        src: "/services/rendering-umbrella.webp",
        alt: "우산 설치물이 걸린 유리 아트리움 실내 투시도 CG",
        caption: "Umbrella Atrium",
      },
      {
        src: "/services/rendering-soyo.webp",
        alt: "소요 한남 레퍼런스 중정 조경 건축 투시도 CG",
        caption: "SOYO Hannam Reference",
      },
    ],
    faq: [
      {
        q: "어떤 자료를 드려야 작업이 시작되나요?",
        a: "평면·입면·단면 도면과 재질 정보가 있으면 시작할 수 있습니다. 3D 모델(SketchUp, Revit, Rhino 등)이 있으면 모델링 단계를 줄일 수 있고, 없으면 도면 기준으로 저희가 모델링합니다.",
      },
      {
        q: "수정은 어디까지 반영되나요?",
        a: "앵글 확정 단계에서 구도를 잡고, 1차 시안 이후 재질·조명 수준의 수정을 반영합니다. 확정된 앵글을 바꾸거나 설계 자체가 변경되는 경우는 작업 범위가 달라지므로 협의가 필요합니다.",
      },
      {
        q: "해상도는 어느 정도까지 나오나요?",
        a: "용도에 맞춰 정합니다. 대형 출력물이나 패널에 들어갈 이미지는 인쇄 해상도로, 웹·발표 자료용은 그에 맞는 크기로 함께 드립니다.",
      },
    ],
  },
  {
    slug: "animation",
    eyebrow: "Animation",
    label: "건축 애니메이션 · 홍보영상",
    headline: "공간의 동선과 분위기를\n시간 위에 펼치는 영상",
    lead:
      "스틸 한 장이 담을 수 없는 것 — 들어서는 순서, 시선이 머무는 지점, 하루 중 빛이 바뀌는 속도. 분양 홍보영상부터 시네마틱 쇼릴까지 제작합니다.",
    metaTitle: "건축 애니메이션·분양 홍보영상 제작 — 시네마틱 건축 영상",
    metaDescription:
      "건축 애니메이션과 분양 홍보영상 제작. 조감 플라이스루, 실내 워크스루, 시네마틱 연출까지 공간의 동선과 분위기를 영상으로 구현합니다. 건축 시각화 전문 스튜디오.",
    keywords: [
      "건축애니메이션",
      "건축홍보영상",
      "분양홍보영상",
      "건축영상제작",
      "시네마틱영상",
      "3D건축영상",
      "조감애니메이션",
      "건축CG영상",
      "모델하우스영상",
    ],
    schemaName: "건축 애니메이션·시네마틱 홍보영상 제작",
    schemaDescription:
      "건축 공간의 동선과 분위기를 담는 3D 애니메이션 및 분양 홍보영상 제작 서비스.",
    hero: {
      src: "/services/animation-hero.webp",
      alt: "포레스트 글라스 빌라 시네마틱 건축 애니메이션 장면",
    },
    situations: [
      "분양 홍보관이나 온라인 채널에 쓸 영상이 필요한 경우",
      "단지 전체의 동선과 규모를 한 번에 설명해야 하는 경우",
      "스틸 이미지만으로는 공간의 깊이가 전달되지 않는 경우",
    ],
    deliverables: [
      {
        title: "조감 플라이스루",
        desc: "단지 전체와 주변 맥락을 훑어 규모와 배치를 한 번에 보여주는 영상.",
      },
      {
        title: "실내 워크스루",
        desc: "현관에서 거실, 커뮤니티까지 실제 동선을 따라 이동하는 카메라 연출.",
      },
      {
        title: "시네마틱 연출",
        desc: "빛의 변화, 디테일 클로즈업, 사운드까지 포함한 브랜드 톤의 영상.",
      },
      {
        title: "소셜 리컷",
        desc: "본편에서 세로형·숏폼 버전을 파생해 인스타그램과 유튜브에 바로 올릴 수 있게 정리합니다.",
      },
    ],
    process: [
      {
        step: "01",
        title: "콘티 설계",
        desc: "영상이 쓰일 자리와 길이를 먼저 정하고, 장면 순서와 카메라 동선을 콘티로 확정합니다.",
      },
      {
        step: "02",
        title: "프리뷰 렌더",
        desc: "저해상 애니메이션으로 카메라 속도와 컷 길이를 먼저 확인합니다. 본 렌더 이후에는 되돌리는 비용이 큽니다.",
      },
      {
        step: "03",
        title: "본 렌더 · 편집",
        desc: "최종 품질로 렌더한 뒤 색보정, 사운드, 타이포그래피를 올립니다.",
      },
      {
        step: "04",
        title: "최종 납품",
        desc: "상영용 고화질 파일과 웹·소셜용 버전을 함께 전달합니다.",
      },
    ],
    samples: [
      {
        src: "/services/animation-showreel.webp",
        alt: "나인스튜디오 2026 쇼릴 영상",
        caption: "NAIN STUDIO Showreel 2026",
        youtubeId: "-ZPEkh02j3c",
      },
      {
        src: "/services/animation-visual.webp",
        alt: "타자기와 카메라를 담은 3D 비주얼 시네마틱 영상",
        caption: "3D Visual Exploration",
        youtubeId: "plaDbIY6Q3A",
      },
      {
        src: "/services/animation-twist.webp",
        alt: "더 트위스트 3D 렌더 애니메이션 영상",
        caption: "The Twist 3D Render Animation",
        video: "/work/The Twist_Shorts_Low.mp4",
      },
    ],
    faq: [
      {
        q: "영상 길이는 어떻게 정하나요?",
        a: "쓰일 자리에서 거꾸로 정합니다. 홍보관 상영용은 호흡을 길게, 온라인 광고용은 짧게 갑니다. 콘티 단계에서 함께 정합니다.",
      },
      {
        q: "음악과 내레이션도 포함되나요?",
        a: "라이선스 음원 선곡과 사운드 믹싱은 작업 범위에 넣을 수 있습니다. 내레이션 녹음이 필요하면 별도로 협의합니다.",
      },
      {
        q: "스틸 이미지와 같이 진행할 수 있나요?",
        a: "같은 모델과 재질을 쓰므로 함께 진행하는 편이 효율적입니다. 영상 작업 중 추출한 프레임을 스틸로 쓰는 것도 가능합니다.",
      },
    ],
  },
  {
    slug: "vr",
    eyebrow: "Realtime",
    label: "리얼타임 VR 워크스루",
    headline: "완공 전 공간을\n직접 걸어보는 경험",
    lead:
      "정해진 카메라 경로를 보는 영상이 아니라, 보는 사람이 직접 걸어 들어가 창을 보고 마감을 바꿔보는 리얼타임 경험. 언리얼 엔진으로 제작합니다.",
    metaTitle: "건축 VR 제작 — 리얼타임 워크스루·언리얼 건축 시각화",
    metaDescription:
      "언리얼 엔진 기반 건축 VR과 리얼타임 워크스루 제작. 완공 전 공간을 직접 걸어보고 마감재와 시간대를 바꿔볼 수 있는 인터랙티브 경험을 구현합니다.",
    keywords: [
      "건축VR",
      "VR모델하우스",
      "리얼타임 건축시각화",
      "언리얼 건축",
      "인터랙티브 VR",
      "건축 워크스루",
      "사이버 모델하우스",
      "VR 분양",
    ],
    schemaName: "리얼타임 VR 워크스루 제작",
    schemaDescription:
      "언리얼 엔진 기반 리얼타임 워크스루와 인터랙티브 건축 VR 콘텐츠 제작 서비스.",
    // The realtime build's own UI is visible in this frame (세대 타입 선택
    // 버튼), which says "interactive" faster than any still render can.
    hero: {
      src: "/services/vr-hero.webp",
      alt: "언리얼 엔진 리얼타임 VR 워크스루 실내 화면과 세대 타입 선택 인터페이스",
    },
    situations: [
      "모델하우스를 짓기 전에 세대 평면을 체험시켜야 하는 경우",
      "마감재 선택지를 고객이 직접 비교하게 하고 싶은 경우",
      "해외나 원격에 있는 발주처에 공간을 설명해야 하는 경우",
    ],
    deliverables: [
      {
        title: "리얼타임 워크스루",
        desc: "실내외를 자유롭게 이동하며 둘러보는 실행 파일. PC와 대형 터치스크린에서 구동됩니다.",
      },
      {
        title: "마감재 · 시간대 전환",
        desc: "같은 공간에서 마감 옵션과 주경·야경을 버튼으로 바꿔보는 인터랙션.",
      },
      {
        title: "VR 헤드셋 대응",
        desc: "헤드셋 체험용 빌드가 필요한 경우 별도로 구성합니다.",
      },
      {
        title: "영상 · 스틸 추출",
        desc: "같은 리얼타임 씬에서 홍보영상과 스틸 이미지를 함께 뽑아낼 수 있습니다.",
      },
    ],
    process: [
      {
        step: "01",
        title: "체험 설계",
        desc: "어디서 어떤 기기로 체험하는지부터 정합니다. 홍보관 터치스크린과 헤드셋은 설계가 전혀 다릅니다.",
      },
      {
        step: "02",
        title: "씬 구축",
        desc: "모델을 엔진에 올려 조명과 재질을 잡고, 이동 가능 범위와 충돌을 정리합니다.",
      },
      {
        step: "03",
        title: "인터랙션 구현",
        desc: "마감재 전환, 시간대 변경, 평면 이동 등 조작 요소를 붙이고 프레임을 맞춥니다.",
      },
      {
        step: "04",
        title: "현장 세팅",
        desc: "실제 구동 기기에서 성능을 확인하고 실행 파일을 전달합니다.",
      },
    ],
    samples: [
      {
        src: "/services/vr-leel.webp",
        alt: "르엘 어퍼하우스 360VR 웹페이지의 레인 가든 장면과 계절 전환 인터페이스",
        caption: "LE|EL UPPERHOUSE 360VR",
      },
      // The same unit seen two ways in one realtime build: the cut-away plan
      // you pick a room from, then the room itself at eye level.
      {
        src: "/services/vr-unreal-iso.webp",
        alt: "언리얼 엔진 리얼타임 세대 아이소메트릭 평면과 타입 선택 인터페이스",
        caption: "세대 아이소 뷰 — 타입 선택",
      },
      {
        src: "/services/vr-unreal-sofa.webp",
        alt: "언리얼 엔진 리얼타임 VR 투어 거실에서 소파 옵션을 고르는 화면",
        caption: "같은 세대 — 가구 옵션 선택",
      },
    ],
    faq: [
      {
        q: "체험하려면 어떤 장비가 필요한가요?",
        a: "기본은 PC에서 실행하는 빌드입니다. 홍보관 터치스크린, 노트북, VR 헤드셋 중 어디서 쓸지 정해주시면 그 환경에 맞춰 성능을 맞춥니다.",
      },
      {
        q: "웹 브라우저에서 바로 열 수 있나요?",
        a: "용량과 성능 때문에 기본은 실행 파일입니다. 웹 배포가 필요한 경우 품질과 조작 범위를 조정해 별도로 구성합니다.",
      },
      {
        q: "설계가 변경되면 다시 만들어야 하나요?",
        a: "전체를 다시 만들지는 않습니다. 변경된 부분만 씬에서 교체하고 다시 빌드합니다. 다만 평면 구조가 바뀌면 이동 경로와 충돌을 다시 잡아야 합니다.",
      },
    ],
  },
  {
    slug: "competition",
    eyebrow: "Competition",
    label: "현상설계 CG",
    headline: "마감이 정해진 일정 안에서\n끝내는 현상설계 CG",
    lead:
      "현상설계에서 가장 먼저 걸리는 관문은 품질이 아니라 마감입니다. 제출 일정을 기준으로 역산해 패널 이미지와 심사용 영상을 준비합니다.",
    metaTitle: "현상설계 CG 제작 — 설계공모 투시도·패널 이미지",
    metaDescription:
      "현상설계와 설계공모용 CG 제작. 제출 일정을 기준으로 역산해 패널 투시도, 조감도, 심사용 영상을 준비합니다. 촉박한 공모 일정에 맞춘 단기 대응이 가능합니다.",
    keywords: [
      "현상설계CG",
      "현상설계 투시도",
      "설계공모 CG",
      "건축공모전 CG",
      "현상설계 패널",
      "설계공모 렌더링",
      "현상설계 조감도",
      "공모전 투시도",
    ],
    schemaName: "현상설계·설계공모 CG 제작",
    schemaDescription:
      "현상설계 및 설계공모 제출 일정에 맞춘 패널 투시도, 조감도, 심사용 영상 제작 서비스.",
    hero: {
      src: "/services/competition-hero.webp",
      alt: "바인야드형 콘서트홀 현상설계 CG 투시도",
    },
    situations: [
      "공모 제출일이 정해져 있고 CG 일정이 뒤로 밀려 있는 경우",
      "패널에 들어갈 대표 투시도와 조감도를 한 번에 맞춰야 하는 경우",
      "설계안이 아직 바뀔 수 있어 수정 대응이 빠른 쪽이 필요한 경우",
    ],
    deliverables: [
      {
        title: "패널 대표 이미지",
        desc: "제출 패널의 중심이 되는 투시도와 조감도. 출력 해상도와 비율을 패널 규격에 맞춥니다.",
      },
      {
        title: "다이어그램 · 분석 이미지",
        desc: "배치, 동선, 일조, 단계별 계획 등 설명용 이미지를 설계 의도에 맞춰 제작합니다.",
      },
      {
        title: "심사용 영상",
        desc: "발표 시간에 맞춘 짧은 애니메이션. 설계안의 핵심 장면만 추려 구성합니다.",
      },
      {
        title: "단계별 중간 확인",
        desc: "클레이, 재질, 조명 단계마다 중간본을 올려 설계 변경을 늦지 않게 반영합니다.",
      },
    ],
    process: [
      {
        step: "01",
        title: "일정 역산",
        desc: "제출일에서 거꾸로 짚어 앵글 확정, 1차본, 최종본의 시점을 먼저 박아둡니다.",
      },
      {
        step: "02",
        title: "앵글 선정",
        desc: "패널 구성과 함께 봅니다. 패널 레이아웃이 가로로 길면 필요한 구도도 달라집니다.",
      },
      {
        step: "03",
        title: "병행 작업",
        desc: "설계가 확정되기 전이라도 확정된 부분부터 올립니다. 마지막에 몰아서 하면 일정이 깨집니다.",
      },
      {
        step: "04",
        title: "제출본 정리",
        desc: "패널 삽입용 원본과 발표 자료용 파일을 제출 규격에 맞춰 전달합니다.",
      },
    ],
    samples: [
      {
        src: "/services/competition-private.webp",
        alt: "비공개 주거 단지 현상설계 CG 조감 투시도",
        caption: "주거 단지 현상설계",
        locked: true,
      },
      {
        src: "/services/competition-myongwolgwan.webp",
        alt: "비스타 워커힐 서울 명월관 한옥 진입부 투시도 CG",
        caption: "VISTA WALKERHILL SEOUL 명월관",
      },
      {
        src: "/services/competition-josun.webp",
        alt: "그랜드 조선 제주 라운지 바 실내 투시도 CG",
        caption: "GRAND JOSUN 제주",
      },
    ],
    faq: [
      {
        q: "일정이 아주 촉박한데 가능한가요?",
        a: "남은 일정과 필요한 컷 수를 먼저 알려주시면 그 안에서 가능한 범위를 솔직하게 말씀드립니다. 무리해서 받고 품질이 떨어지는 쪽보다, 컷 수를 조정해 확실히 맞추는 쪽을 권합니다.",
      },
      {
        q: "설계가 계속 바뀌는 중인데 시작할 수 있나요?",
        a: "오히려 그 상황을 전제로 진행합니다. 확정된 매스와 대지부터 올리고, 변경되는 입면과 재질은 뒤쪽 단계에서 반영합니다.",
      },
      {
        q: "패널 레이아웃 작업도 해주시나요?",
        a: "CG 이미지 제작이 기본 범위입니다. 패널 편집이 필요하면 범위에 포함할 수 있으니 문의 시 함께 말씀해 주세요.",
      },
    ],
  },
]

export function getService(slug: string) {
  return services.find((s) => s.slug === slug)
}
