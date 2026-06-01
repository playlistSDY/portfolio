const cursorLight = document.querySelector(".cursor-light");

if (cursorLight && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursorLight.style.opacity = "1";
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const canvas = document.getElementById("networkCanvas");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas) {
  const context = canvas.getContext("2d");
  const nodes = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let pointer = { x: 0, y: 0, active: false };

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    nodes.length = 0;
    const total = width < 520 ? 22 : 36;
    for (let index = 0; index < total; index += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.36,
        vy: (Math.random() - 0.5) * 0.36,
        r: Math.random() * 1.8 + 1.4,
      });
    }
  }

  function drawNode(node) {
    context.beginPath();
    context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    context.fillStyle = "rgba(124, 140, 255, 0.72)";
    context.fill();
  }

  function drawConnection(a, b, distance) {
    const alpha = Math.max(0, 1 - distance / 170) * 0.26;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.strokeStyle = `rgba(180, 190, 214, ${alpha})`;
    context.lineWidth = 1;
    context.stroke();
  }

  function tick() {
    context.clearRect(0, 0, width, height);

    nodes.forEach((node) => {
      if (!reducedMotion) {
        node.x += node.vx;
        node.y += node.vy;
      }

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      if (pointer.active && !reducedMotion) {
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 160) {
          node.x -= dx * 0.002;
          node.y -= dy * 0.002;
        }
      }
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (distance < 170) {
          drawConnection(nodes[i], nodes[j], distance);
        }
      }
    }

    nodes.forEach(drawNode);

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(tick);
    }
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    };
  });

  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();
    tick();
  });

  resizeCanvas();
  tick();
}

const projectData = {
  zoj: {
    year: "2026",
    status: "실전 운영",
    type: "Online Judge / Contest Ops",
    title: "ZOJ — ZeroOne Online Judge",
    summary:
      "프로그래밍 대회 운영을 위해 구축한 온라인 저지 플랫폼입니다. HEPC에서 첫 실전 운영을 진행했고, 이후 다른 대학과 기관의 코딩 테스트 대회 운영까지 확장하는 것을 목표로 합니다.",
    problem:
      "대회 운영자가 문제와 테스트케이스를 직접 등록하고, 참가자는 제한된 실행 환경에서 제출하며, 운영자는 대회 중 채점 상태를 확인할 수 있는 서비스가 필요했습니다.",
    system:
      "Python, Java 8, C++17, C99 제출을 지원하고 isolate 기반 샌드박스에서 실행합니다. 채점기는 internal claim FIFO 방식으로 작업을 가져가며, 관리자 페이지에서 문제와 테스트케이스를 업로드할 수 있게 구성했습니다.",
    quality:
      "HEPC 2시간 운영 중 350건 이상의 채점이 진행됐고, 대회 중 채점 서버가 안정적으로 동작했습니다. 제출 격리, 실행 제한, 채점 큐, 관리자 운영 흐름을 실전 기준으로 확인했습니다.",
    role: "팀 프로젝트 · 기획 · 백엔드 · 인프라 · 배포 · 채점 서버 전체",
    scale: "HEPC 첫 실전 운영 · 2시간 350+ 채점",
    tags: ["FastAPI", "isolate", "FIFO Judge", "Linux", "Nginx", "Proxmox"],
    links: [
      { label: "Service", url: "https://judge.zerone01.kr" },
      { label: "GitHub", url: "https://github.com/ZERONE-Online-Judge" },
    ],
    shots: [
      {
        src: "/static/assets/projects/zoj-dashboard.jpg",
        label: "ZOJ",
        title: "Service Home",
        caption: "ZOJ 운영 서비스 화면",
        position: "center 40%",
      },
      {
        src: "/static/assets/projects/zoj-sandbox.jpg",
        label: "Admin",
        title: "Problem Manager",
        caption: "문제와 테스트케이스 관리",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/zoj-monitoring.jpg",
        label: "Scoreboard",
        title: "Presentation Board",
        caption: "HEPC 프리젠테이션 스코어보드",
        fit: "contain",
      },
    ],
  },
  zerone: {
    year: "2025-",
    status: "운영 중",
    type: "Club Management",
    title: "ZERONE — 영과일 통합 관리 웹사이트",
    summary:
      "한양대학교 ERICA 소프트웨어융합대학 컴퓨터학부 소속 알고리즘 학회 ZERONE(영과일)의 홍보, 가입, 활동, 이벤트, 스터디 운영을 통합한 서비스입니다.",
    problem:
      "기존에는 회원 기록과 활동 데이터가 엑셀 중심으로 흩어져 있어 이전 기록 조회, 통계, 학기별 운영 예측이 번거로웠습니다.",
    system:
      "FastAPI, MySQL, Docker, docker-compose 기반으로 학회 소개, 회원 가입, 회원 관리, 이벤트, 백준 빙고, 스터디 가입 흐름을 하나의 웹사이트로 묶었습니다.",
    quality:
      "학교 이메일 기반 가입, 이름과 전화번호 입력, 입금 확인, 관리자 승인 흐름을 사이트 안에서 처리합니다. 누적 약 900명 기록과 학기당 100-150명 활동 회원 규모를 기준으로 운영 데이터를 관리합니다.",
    role: "팀 프로젝트 · 운영 흐름 설계 · 백엔드 · 인프라 · 운영 관리",
    scale: "누적 회원 약 900명 · 학기당 활동 회원 100-150명",
    tags: ["FastAPI", "MySQL", "Docker", "docker-compose", "Admin"],
    links: [
      { label: "Service", url: "https://zerone01.kr" },
      { label: "GitHub", url: "https://github.com/ZERONE-HOMEPAGE" },
    ],
    shots: [
      {
        src: "/static/assets/projects/zerone-home.jpg",
        label: "ZERONE",
        title: "Club Website",
        caption: "학회 홍보와 가입 흐름",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/zerone-members.jpg",
        label: "Members",
        title: "Member Admin",
        caption: "회원 기록 통합 관리",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/zerone-events.jpg",
        label: "Events",
        title: "Study & Event Ops",
        caption: "스터디와 이벤트 처리",
        fit: "contain",
      },
    ],
  },
  "sdy-coder": {
    year: "2026",
    status: "운영 중",
    type: "Code Runtime",
    title: "SDY.CODER",
    summary:
      "별도 설치 없이 브라우저에서 코드를 작성하고 실행 결과를 확인하는 웹 기반 코드 에디터와 컴파일러입니다.",
    problem:
      "간단한 문법 테스트나 알고리즘 풀이를 위해 매번 로컬 실행 환경을 맞추지 않아도 되는 다중 언어 실행 환경이 필요했습니다.",
    system:
      "React/Vite 프론트엔드, Monaco Editor, Express/WebSocket LSP bridge, Docker 기반 실행 샌드박스를 연결했습니다. Python, C, C++, Java, C#, Node.js, Go, Kotlin, Dart를 지원합니다.",
    quality:
      "stdin, stdout/stderr, 실행 시간과 메모리 표시, 파일 탐색기, 프리셋, 에디터 설정, Java/Kotlin 실행 보정, Python matplotlib inline 이미지 출력을 구현했습니다.",
    role: "전체 기획 · 프론트엔드 · 백엔드 · 실행 샌드박스",
    scale: "9개 언어 실행 · Python 패키지/그래프 출력 지원",
    tags: ["React", "Monaco Editor", "Express", "WebSocket", "Docker"],
    links: [
      { label: "Service", url: "https://coder.sdy.world" },
      { label: "GitHub", url: "https://github.com/playlistSDY/SDY.CODER" },
    ],
    shots: [
      {
        src: "/static/assets/projects/sdy-coder-editor.jpg",
        label: "Editor",
        title: "Monaco Workspace",
        caption: "웹 기반 코드 편집",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/sdy-coder-settings.jpg",
        label: "Settings",
        title: "Editor Settings",
        caption: "테마와 에디터 설정",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/sdy-coder-language.jpg",
        label: "Languages",
        title: "Multi-language Runtime",
        caption: "언어별 실행 환경 선택",
        fit: "contain",
      },
    ],
  },
  nmixx: {
    year: "2023-2024",
    status: "운영 중",
    type: "Fan Platform",
    title: "NMIXX 팬 플랫폼",
    summary:
      "NMIXX 관련 링크, 사진, 라이브 아카이브, 이벤트, 문자투표 보조 기능을 모아 운영하는 팬 페이지입니다.",
    problem:
      "팬 콘텐츠와 투표 링크가 여러 플랫폼에 흩어져 있어 사진을 다시 찾거나 이벤트에 참여하는 흐름이 번거로웠습니다.",
    system:
      "Instagram 사진 크롤링과 다운로드, 검색, 벡터 유사도 기반 사진 검색, 원본 Instagram 링크 연결, 페이지네이션, V LIVE 시절 방송 HLS 재생, 운세용 뽑기 이벤트, 문자투표 원클릭 흐름을 포함했습니다.",
    quality:
      "평균 일 방문자 약 100명, 이벤트 시 하루 약 1,500명 방문을 경험했습니다. 문자투표는 전화번호와 메시지를 문자 앱에 채워 사용자가 보내기만 하면 되도록 만들었습니다.",
    role: "서비스 기획 · 백엔드 · 미디어 처리 · 운영",
    scale: "평균 일 방문자 약 100명 · 이벤트 시 하루 약 1,500명",
    tags: ["Crawling", "HLS", "Vector Search", "Pagination", "SMS Flow"],
    links: [{ label: "Service", url: "https://nmixx.net" }],
    shots: [
      {
        src: "/static/assets/projects/nmixx-feed.jpg",
        label: "Home",
        title: "Fan Portal",
        caption: "홈과 공식 링크 진입",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/nmixx-streaming.jpg",
        label: "HLS",
        title: "Live Replay",
        caption: "스트리밍 제공",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/nmixx-search.jpg",
        label: "Search",
        title: "Image Similarity",
        caption: "이미지 유사도 검색",
        fit: "contain",
      },
    ],
  },
  hepc: {
    year: "2026",
    status: "대회 운영",
    type: "Leadership / Contest Ops",
    title: "HEPC — Hanyang ERICA Programming Contest",
    summary:
      "ZERONE 학회장으로 주관한 교내 프로그래밍 대회입니다. ZOJ를 첫 실전 운영에 적용해 실제 참가자 제출과 채점을 처리했습니다.",
    problem:
      "상금이 지급되는 학교·사업단 연계 대회였기 때문에 문제 준비, 참가자 안내, 대회장 운영, 채점 안정성이 함께 필요했습니다.",
    system:
      "대회 운영 흐름과 ZOJ 채점 서비스를 연결하고, 운영자가 문제와 테스트케이스를 관리할 수 있는 구조로 준비했습니다.",
    quality:
      "2시간 동안 350건 이상의 채점이 진행됐고, 대회 중 채점 서비스가 안정적으로 동작했습니다. 운영 현장에서 필요한 안내와 장애 대응 흐름을 함께 확인했습니다.",
    role: "학회장 · 팀 운영 · 대회 주관 · 운영 기획 · 채점 인프라",
    scale: "실전 대회 운영 · 상금 지급 대회",
    tags: ["Contest Ops", "Leadership", "ZOJ", "Judge Infra", "HEPC"],
    links: [],
    shots: [
      {
        src: "/static/assets/projects/hepc-venue.jpg",
        label: "HEPC",
        title: "Contest Venue",
        caption: "실제 대회장 운영",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/hepc-ops.jpg",
        label: "Ops",
        title: "Contest Operation",
        caption: "대회 운영과 안내",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/hepc-judge.jpg",
        label: "Judge",
        title: "Live Judging",
        caption: "실시간 제출 채점",
        position: "center 45%",
      },
    ],
  },
  efoo: {
    year: "2025",
    status: "운영 중",
    type: "Mobile App",
    title: "EFOO — 에리카푸드",
    summary:
      "처음에는 재미용 사이드 프로젝트로 시작했고, 이후 공모전에 출품해 실제 운영 중인 React Native 기반 학교 주변 식당 정보 앱입니다.",
    problem:
      "학식과 학교 근처 1km 이내 식당의 운영시간, 메뉴, 후기 정보를 한 번에 보기 어려웠습니다.",
    system:
      "React Native 앱에서 학식과 주변 식당 정보를 보여주고, 식당별 리뷰와 댓글을 남길 수 있는 커뮤니티 흐름을 구성했습니다.",
    quality:
      "운영시간, 메뉴, 거리, 리뷰, 댓글처럼 사용자가 실제 식당을 고를 때 필요한 정보를 한 화면에서 비교할 수 있게 정리했습니다.",
    role: "팀 프로젝트 · 앱 기획 · 모바일 개발 · 서비스 구조 설계",
    scale: "실제 운영 중 · 공모전 출품 · 학교 생활 서비스",
    tags: ["React Native", "Mobile", "Review", "Community", "Campus"],
    links: [
      { label: "Service", url: "https://에리카밥.com" },
      { label: "GitHub", url: "https://github.com/Erica-bab" },
    ],
    shots: [
      {
        src: "/static/assets/projects/efoo-list.jpg",
        label: "EFOO",
        title: "Restaurant Feed",
        caption: "주변 식당 목록과 추천",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/efoo-detail.jpg",
        label: "Search",
        title: "Search Results",
        caption: "식당과 메뉴 통합 검색",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/efoo-review.jpg",
        label: "Meal",
        title: "Cafeteria Menu",
        caption: "학식 메뉴와 위치 정보",
        fit: "contain",
      },
    ],
  },
  homelab: {
    year: "2021-",
    status: "자가 호스팅",
    type: "Infrastructure",
    title: "Homelab Infrastructure",
    summary:
      "직접 조립한 서버와 네트워크 장비를 기반으로 구성한 Proxmox 중심의 개인 인프라 환경입니다. 포트폴리오의 서비스들은 클라우드 없이 자체 서버에서 운영합니다.",
    problem:
      "개발한 서비스가 실제로 올라가는 하드웨어, 네트워크, 프록시, 저장소 환경을 직접 다뤄보고 싶었습니다.",
    system:
      "Xeon 서버 클러스터, Proxmox 가상화, OPNsense, Reverse Proxy, Tailscale, NAS, Docker 기반 서비스를 하나의 운영 환경으로 구성했습니다.",
    quality:
      "네트워크 분리, 프록시 라우팅, 원격 접근, 스토리지 운영, 장애 복구 가능성을 확인하고 있습니다.",
    role: "서버 조립 · 네트워크 설계 · 가상화 · 운영",
    scale: "Xeon 기반 클러스터 · 다중 self-hosted 서비스",
    tags: ["Proxmox", "OPNsense", "Nginx", "Tailscale", "NAS", "Docker"],
    links: [],
    shots: [
      {
        src: "/static/assets/projects/homelab-rack.jpg",
        label: "Rack",
        title: "Server Cluster",
        caption: "직접 조립한 서버 환경",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/homelab-network.jpg",
        label: "Hardware",
        title: "Parts Replacement",
        caption: "서버 부품 교체와 부팅 테스트",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/homelab-proxmox.jpg",
        label: "Virtualization",
        title: "VM Console Ops",
        caption: "Proxmox 기반 VM 운영",
        fit: "contain",
      },
    ],
  },
  environment: {
    year: "2023",
    status: "학생 사용",
    type: "IoT Weather",
    title: "지금 기상 상황은?",
    summary:
      "Raspberry Pi 기반으로 미세먼지와 온습도를 측정하고 웹에서 실시간 기상 상태와 시간별 추이를 보여주는 IoT 기상 시스템입니다.",
    problem:
      "학교 주변의 미세먼지와 온습도를 직접 측정해, 단순 API가 아니라 실제 센서 기반 데이터로 현재 상태를 보여주고 싶었습니다.",
    system:
      "Raspbian Lite에서 Python 코드로 PMS7003 정밀 미세먼지 센서와 DHT11 온습도 센서를 읽고 MQTT로 데이터를 전송했습니다. Raspberry Pi에 연결할 수 있는 만능기판 기반 쉴드와 3D 프린팅 케이스도 직접 설계했습니다.",
    quality:
      "PMS7003의 PM1.0/PM2.5/PM10 값과 DHT11 온습도를 직관적으로 보여주고, NeoPixel LED로 상태를 바로 확인할 수 있게 구성했습니다.",
    role: "하드웨어 설계 · Python 센서 코드 · MQTT · 웹 대시보드",
    scale: "센서 실측 데이터 · 자체 서버 웹 제공",
    tags: ["Raspberry Pi", "Raspbian Lite", "MQTT", "PMS7003", "DHT11", "NeoPixel"],
    links: [],
    shots: [
      {
        src: "/static/assets/projects/weather-device.jpg",
        label: "Device",
        title: "Printed Case",
        caption: "직접 설계한 3D 프린팅 케이스",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/weather-live.jpg",
        label: "Dashboard",
        title: "Live Weather",
        caption: "실시간 기상 상태 화면",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/weather-chart.jpg",
        label: "Shield",
        title: "Custom Shield",
        caption: "만능기판 쉴드와 NeoPixel 배선",
        position: "center 45%",
      },
    ],
  },
  plant: {
    year: "2023",
    status: "자동화",
    type: "IoT System",
    title: "자동 식물 관리 시스템",
    summary:
      "교실 식물의 토양 수분을 측정하고 자동 급수, MQTT 전송, 웹 기반 조회와 관리를 연결한 IoT 자동화 시스템입니다.",
    problem:
      "식물 관리는 사람이 잊으면 상태가 금방 달라져 센서 측정과 급수 제어가 함께 필요했습니다.",
    system:
      "Arduino 기반 토양 수분 센서, 릴레이, 워터 펌프, LCD, MQTT 전송, 웹 모니터링/관리 화면을 묶어 물리 장치와 소프트웨어를 연결했습니다.",
    quality:
      "센서 오차, 펌프 과동작, 물 부족 상태, MQTT 연결 상태, 장시간 동작을 확인했습니다.",
    role: "하드웨어 제작 · 센서 제어 · MQTT · 웹 모니터링",
    scale: "교실 환경 자동화",
    tags: ["Arduino", "MQTT", "Sensor", "Water Pump", "Monitoring"],
    links: [],
    shots: [
      {
        src: "/static/assets/projects/plant-device.jpg",
        label: "Device",
        title: "Soil Sensor",
        caption: "토양 수분 측정",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/plant-pump.jpg",
        label: "Pump",
        title: "Auto Watering",
        caption: "자동 급수 제어",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/plant-monitoring.jpg",
        label: "MQTT",
        title: "MQTT Status",
        caption: "센서 데이터 전송 확인",
        fit: "contain",
      },
    ],
  },
  chatbot: {
    year: "2022-2024",
    status: "학생 서비스",
    type: "Chatbot",
    title: "광주고 알리미 + 지금 우리의 학교는?",
    summary:
      "광주고 학생들이 급식, 시간표, 학급 일정, 학급 정보를 카카오톡에서 조회하고 관리할 수 있도록 만든 챗봇 서비스입니다.",
    problem:
      "학생들이 매일 확인하는 정보를 카카오톡 대화창에서 바로 조회할 수 있게 만들고 싶었습니다.",
    system:
      "교육청 API, 학교 일정 데이터, 학급 정보 저장 흐름, 카카오톡 챗봇 응답 시나리오를 연결했습니다.",
    quality:
      "API 응답 실패, 날짜 처리, 빈 데이터 응답, 학급 정보 변경, 사용자가 잘못 입력하는 흐름을 따로 처리했습니다.",
    role: "API 연동 · 챗봇 플로우 · 예외 처리",
    scale: "광주고 학생 대상 · 카카오톡 기반 실사용",
    tags: ["KakaoTalk Bot", "Education API", "Backend", "Error Handling"],
    links: [],
    shots: [
      {
        src: "/static/assets/projects/chatbot-flow.jpg",
        label: "Flow",
        title: "Kakao Admin",
        caption: "카카오 챗봇 시나리오",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/chatbot-meal.jpg",
        label: "Meal",
        title: "Class Schedule",
        caption: "학급 일정 조회",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/chatbot-schedule.jpg",
        label: "Schedule",
        title: "Class Admin Flow",
        caption: "학급 일정 관리",
        fit: "contain",
      },
    ],
  },
  damul: {
    year: "2019",
    status: "최우수상",
    type: "Invention / Hardware Prototype",
    title: "다물이 — 제41회 경기도학생과학발명품경진대회",
    summary:
      "중학교 1학년 때 진행한 발명품 프로젝트입니다. 제41회 경기도학생과학발명품경진대회에 출품해 최우수상을 받은 하드웨어 기반 아이디어 구현 작업입니다.",
    problem:
      "생활 속에서 반복적으로 생기는 불편을 관찰하고, 실제 물리 장치로 해결할 수 있는 형태를 고민했습니다.",
    system:
      "아이디어 구체화, 구조 설계, 부품 선정, 프로토타입 제작 과정을 직접 진행하며 센서와 장치 제어를 다뤘습니다.",
    quality:
      "완성품이 단순 모형에 그치지 않도록 실제 동작 가능성과 사용 흐름을 확인했고, 도 대회에서 최우수상을 받았습니다. 이후 하드웨어와 서비스 개발을 이어가게 된 초기 프로젝트입니다.",
    role: "아이디어 기획 · 하드웨어 제작 · 프로토타입 검증",
    scale: "중학교 1학년 · 제41회 경기도학생과학발명품경진대회 최우수상",
    tags: ["최우수상", "Invention", "Prototype", "Hardware", "2019"],
    links: [],
    shots: [
      {
        src: "/static/assets/projects/damul-overview.jpg",
        label: "2019",
        title: "Invention Prototype",
        caption: "제41회 경기도학생과학발명품경진대회 출품 프로젝트",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/damul-build.jpg",
        label: "Hardware",
        title: "Build Process",
        caption: "아이디어 설계와 프로토타입 제작",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/damul-controller.jpg",
        label: "Validation",
        title: "Operation Check",
        caption: "실제 동작 흐름 확인",
        fit: "contain",
      },
    ],
  },
  "middle-dust": {
    year: "2019",
    status: "하드웨어 제작",
    type: "Sensor Device",
    title: "미세먼지 온습도 측정기",
    summary:
      "중학교 1학년 때 만든 미세먼지와 온습도 측정 장치입니다. 센서 값을 읽고 사람이 바로 확인할 수 있는 형태로 보여주는 하드웨어 프로젝트였습니다.",
    problem:
      "실내외 공기 상태를 직접 측정하고, 미세먼지와 온습도를 눈으로 확인할 수 있는 장치가 필요했습니다.",
    system:
      "미세먼지 센서와 온습도 센서를 연결하고, 측정값을 읽어 화면이나 표시 장치로 보여주는 구조를 만들었습니다.",
    quality:
      "센서 값이 안정적으로 읽히는지, 표시가 직관적인지, 장시간 켜두었을 때 동작이 유지되는지를 확인했습니다.",
    role: "센서 연결 · 하드웨어 제작 · 측정 로직 구현",
    scale: "중학교 1학년 · 센서 기반 환경 측정 장치",
    tags: ["Dust Sensor", "Temperature", "Humidity", "Hardware", "2019"],
    links: [],
    shots: [
      {
        src: "/static/assets/projects/middle-dust-device.jpg",
        label: "Sensor",
        title: "Air Quality Device",
        caption: "미세먼지와 온습도 측정 장치",
        fit: "contain",
      },
      {
        src: "/static/assets/projects/middle-dust-inside.jpg",
        label: "Display",
        title: "Readable Output",
        caption: "측정값 표시 흐름",
        position: "center 45%",
      },
      {
        src: "/static/assets/projects/middle-dust-display.jpg",
        label: "Hardware",
        title: "Device Build",
        caption: "센서 연결과 동작 확인",
        fit: "contain",
      },
    ],
  },
};

const projectBrowser = document.getElementById("projectBrowser");

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function createLinkIcon(type) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  if (type === "github") {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02 0 2.05.14 3.01.41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.57A12 12 0 0 0 12 .5Z"
    );
    svg.append(path);
    return svg;
  }

  const paths = [
    "M15 3h6v6",
    "M10 14 21 3",
    "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  ];
  paths.forEach((value) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", value);
    svg.append(path);
  });
  return svg;
}

function renderProjectLinks(links) {
  const container = document.getElementById("detailLinks");
  if (!container) return;

  container.replaceChildren();
  links
    .filter((link) => link.url)
    .forEach((link) => {
      const anchor = document.createElement("a");
      const isGitHub = link.label.toLowerCase() === "github";
      const linkType = isGitHub ? "github" : "service";
      anchor.className = `detail-link ${linkType}`;
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      anchor.setAttribute("aria-label", `${link.label} 열기`);

      const label = document.createElement("span");
      label.textContent = isGitHub ? "GitHub" : "사이트 바로가기";

      anchor.append(createLinkIcon(linkType), label);
      container.append(anchor);
    });

  container.hidden = container.children.length === 0;
}

function renderProjectTags(tags) {
  const tagList = document.getElementById("detailTags");
  if (!tagList) return;

  tagList.replaceChildren(
    ...tags.map((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      return item;
    })
  );
}

function renderProjectShots(shots) {
  document.querySelectorAll(".project-shot").forEach((shotElement, index) => {
    const shot = shots[index] || shots[0];
    const fallback = shotElement.querySelector(".shot-fallback");
    const label = fallback?.querySelector("span");
    const title = fallback?.querySelector("strong");
    const caption = shotElement.querySelector("figcaption");
    let imageElement = shotElement.querySelector(".project-shot-image");

    if (!imageElement) {
      imageElement = document.createElement("img");
      imageElement.className = "project-shot-image";
      imageElement.alt = "";
      imageElement.loading = "lazy";
      imageElement.decoding = "async";
      shotElement.prepend(imageElement);
    }

    shotElement.classList.remove("has-image");
    shotElement.classList.remove("image-contain");
    imageElement.removeAttribute("src");
    imageElement.style.objectFit = "";
    imageElement.style.objectPosition = "";
    if (label) label.textContent = shot.label;
    if (title) title.textContent = shot.title;
    if (caption) caption.textContent = shot.caption;

    if (!shot.src) return;

    imageElement.onload = () => {
      shotElement.classList.add("has-image");
      shotElement.classList.toggle("image-contain", shot.fit === "contain");
    };
    imageElement.onerror = () => {
      shotElement.classList.remove("has-image");
      shotElement.classList.remove("image-contain");
    };
    imageElement.style.objectFit = shot.fit === "contain" ? "contain" : "cover";
    imageElement.style.objectPosition = shot.position || "center";
    imageElement.alt = `${shot.title} - ${shot.caption}`;
    imageElement.src = shot.src;
  });
}

function renderProject(projectKey, shouldScroll = false) {
  const project = projectData[projectKey];
  if (!project) return;

  document.querySelectorAll(".project-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.project === projectKey);
  });

  setText("detailStatus", project.status);
  setText("detailYear", project.year);
  setText("detailType", project.type);
  setText("detailTitle", project.title);
  setText("detailSummary", project.summary);
  setText("detailProblem", project.problem);
  setText("detailSystem", project.system);
  setText("detailQuality", project.quality);
  setText("detailRole", project.role);
  setText("detailScale", project.scale);
  renderProjectLinks(project.links);
  renderProjectTags(project.tags);
  renderProjectShots(project.shots);

  if (shouldScroll && projectBrowser) {
    projectBrowser.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

if (projectBrowser) {
  document.querySelectorAll(".project-tab, .project-jump").forEach((control) => {
    control.addEventListener("click", () => {
      renderProject(control.dataset.project, true);
    });
  });

  renderProject("zoj");
}
