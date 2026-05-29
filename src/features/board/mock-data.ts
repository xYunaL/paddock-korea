import type { Post } from "./types";

/** Seed posts for the global + team boards. */
export const SEED_POSTS: Post[] = [
  {
    id: "seed-post-g1",
    scope: "global",
    title: "2026 시즌 중간 정리: 안토넬리 돌풍 어떻게 보세요?",
    body: "메르세데스가 시즌 초반을 지배하고 있는데, 안토넬리의 페이스가 진짜인지 차가 좋은 건지 의견 나눠봐요. 개인적으로는 예선 한 바퀴 속도가 인상적이었습니다.",
    authorNickname: "패독지기",
    authorTeamId: "mercedes",
    likes: 42,
    createdAt: "2026-05-27T10:00:00+09:00",
    comments: [
      {
        id: "seed-c1",
        authorNickname: "티포시지망생",
        authorTeamId: "ferrari",
        text: "차도 좋고 본인도 잘하는 듯. 페라리는 전략만 좀…",
        createdAt: "2026-05-27T10:12:00+09:00",
      },
    ],
  },
  {
    id: "seed-post-g2",
    scope: "global",
    title: "캐나다 GP 스프린트 명승부 다시 봅시다",
    body: "마지막 5랩 추월쇼 미쳤네요. 타이어 관리 싸움이 볼만했습니다.",
    authorNickname: "그리드워커",
    authorTeamId: "mclaren",
    likes: 28,
    createdAt: "2026-05-26T21:30:00+09:00",
    comments: [],
  },
  {
    id: "seed-post-ferrari1",
    scope: "team",
    teamId: "ferrari",
    title: "르클레르 폴 가즈아 🔴",
    body: "이번 주말 예선 셋업 느낌 좋다는데 기대해봅니다. 티포시 모여라!",
    authorNickname: "포디엄가자",
    authorTeamId: "ferrari",
    likes: 15,
    createdAt: "2026-05-27T09:00:00+09:00",
    comments: [],
  },
  {
    id: "seed-post-mclaren1",
    scope: "team",
    teamId: "mclaren",
    title: "파파야 더블 포디엄 가능?",
    body: "노리스 피아스트리 둘 다 폼이 좋아서 이번엔 1-2 노려봅니다.",
    authorNickname: "파파야사랑",
    authorTeamId: "mclaren",
    likes: 11,
    createdAt: "2026-05-27T08:30:00+09:00",
    comments: [],
  },
];
