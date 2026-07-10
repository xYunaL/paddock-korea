export type BoardScope = "global" | "team";

/** Board navigation view — the sidebar sub-menu + in-page toggle. */
export type BoardNav = "global" | "team" | "mine";

export type Comment = {
  id: string;
  authorNickname: string;
  authorTeamId: string;
  /** Author snapshot — profile picture + driver tag (a Driver id). */
  authorAvatarUrl?: string;
  authorDriverTag?: string;
  text: string;
  /** Optional attached image URL (http/https). */
  imageUrl?: string;
  createdAt: string;
};

export type Post = {
  id: string;
  scope: BoardScope;
  /** Present when scope === "team". */
  teamId?: string;
  title: string;
  body: string;
  /** Optional attached image URL (http/https). */
  imageUrl?: string;
  authorNickname: string;
  authorTeamId: string;
  /** Author snapshot — profile picture + driver tag (a Driver id). */
  authorAvatarUrl?: string;
  authorDriverTag?: string;
  likes: number;
  /** 조회수 — incremented when the post detail is opened. */
  views: number;
  createdAt: string;
  comments: Comment[];
};
