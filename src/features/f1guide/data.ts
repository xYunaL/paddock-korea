import type { F1GuideEntry, GuideCategory } from "./types";

export const GUIDE_CATEGORIES: GuideCategory[] = ["기초", "전략", "기술", "용어"];

export const F1_GUIDE: F1GuideEntry[] = [
  {
    id: "guide-grid",
    category: "기초",
    term: "그리드 (Grid)",
    shortDesc: "결승 출발 위치. 예선 순위로 결정된다.",
    fullDesc:
      "F1 결승의 출발 순위. 예선(Qualifying) 결과에 따라 1번 그리드(폴 포지션)부터 정렬된다. 폴 포지션은 추월이 어려운 서킷에서 특히 큰 이점이다.",
  },
  {
    id: "guide-drs",
    category: "기초",
    term: "DRS (Drag Reduction System)",
    shortDesc: "직선 구간 추월 보조 장치.",
    fullDesc:
      "리어 윙의 플랩을 열어 공기 저항을 줄이는 장치. 지정된 DRS 존에서 앞 차와 1초 이내일 때만 사용 가능하다. 추월을 늘리기 위한 규정이다.",
  },
  {
    id: "guide-undercut",
    category: "전략",
    term: "언더컷 (Undercut)",
    shortDesc: "앞 차보다 먼저 피트인해 새 타이어로 앞지른다.",
    fullDesc:
      "앞 차보다 한 두 랩 먼저 피트인하여 새 타이어의 그립을 활용해 페이스를 끌어올린 뒤, 앞 차가 피트인 했을 때 트랙 포지션을 빼앗는 전략.",
  },
  {
    id: "guide-overcut",
    category: "전략",
    term: "오버컷 (Overcut)",
    shortDesc: "앞 차보다 늦게 피트인해 클린 에어로 추월한다.",
    fullDesc:
      "타이어 마모가 낮은 서킷에서 효과적. 앞 차가 피트인한 뒤 트랙에 남아 클린 에어로 빠른 랩을 친 후 늦게 피트인해 앞으로 나간다.",
  },
  {
    id: "guide-mgu-k",
    category: "기술",
    term: "MGU-K",
    shortDesc: "제동 에너지를 회수해 가속에 쓰는 모터.",
    fullDesc:
      "Motor Generator Unit - Kinetic. 제동 시 운동 에너지를 회수해 배터리에 저장하고, 가속 시 약 160마력을 더해주는 회생 시스템.",
  },
  {
    id: "guide-mgu-h",
    category: "기술",
    term: "MGU-H",
    shortDesc: "배기 열에너지를 회수해 전기로 바꾼다.",
    fullDesc:
      "Motor Generator Unit - Heat. 터보 차저의 회전 에너지를 활용해 전기 발전 및 터보 랙 제거에 쓰인다. 2026년 규정 변경 예정.",
  },
  {
    id: "guide-pole",
    category: "용어",
    term: "폴 포지션 (Pole Position)",
    shortDesc: "예선 1위가 받는 결승 1번 그리드.",
    fullDesc:
      "예선 Q3에서 1위를 차지한 드라이버에게 주어지는 결승 1번 출발 위치. 단어는 19세기 경마에서 유래했다.",
  },
  {
    id: "guide-podium",
    category: "용어",
    term: "포디엄 (Podium)",
    shortDesc: "결승 1·2·3위 시상대.",
    fullDesc:
      "결승 1·2·3위 드라이버가 올라가는 시상대. 우승자가 가운데, 2위는 왼쪽, 3위는 오른쪽이다.",
  },
];
