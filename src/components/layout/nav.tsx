import type { ReactNode } from "react";
import { getRealTeamIds, getTeam, isAllFan } from "@/lib/teams";
import type { UserProfile } from "@/lib/types";

export type TabId =
  | "dashboard"
  | "board"
  | "chat"
  | "meme"
  | "pit-wall"
  | "f1-101"
  | "mypage";

export type NavItem = {
  id: TabId;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
  live?: boolean;
};

export type NavGroup = { label: string; items: NavItem[] };

/* ------------------------------------------------------------------ */
/* Icons — 20px stroke icons, currentColor. No emoji in the nav.      */
/* ------------------------------------------------------------------ */

function base(children: ReactNode, className?: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const IconDashboard = ({ className }: { className?: string }) =>
  base(
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>,
    className
  );

const IconBoard = ({ className }: { className?: string }) =>
  base(
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M8 9h8M8 13h5" />
    </>,
    className
  );

const IconChat = ({ className }: { className?: string }) =>
  base(
    <path d="M21 11.5a8 8 0 0 1-11.6 7.1L3 20.5l1.9-6.4A8 8 0 1 1 21 11.5Z" />,
    className
  );

const IconMeme = ({ className }: { className?: string }) =>
  base(
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.5 17 4.5-4 3.5 3 3-2.5 4.5 4" />
    </>,
    className
  );

const IconPitWall = ({ className }: { className?: string }) =>
  base(
    <>
      <path d="M4 20V4" />
      <path d="M4 5h11l-2 3 2 3H4" />
    </>,
    className
  );

const IconGuide = ({ className }: { className?: string }) =>
  base(
    <>
      <path d="M5 4.5h9a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H5Z" />
      <path d="M5 4.5V20" />
    </>,
    className
  );

const IconUser = ({ className }: { className?: string }) =>
  base(
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>,
    className
  );

/* ------------------------------------------------------------------ */
/* Nav model — grouped IA. Chat promoted to a first-class destination. */
/* ------------------------------------------------------------------ */

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "커뮤니티",
    items: [
      { id: "dashboard", label: "대시보드", icon: IconDashboard },
      { id: "board", label: "게시판", icon: IconBoard },
      { id: "chat", label: "실시간 채팅", icon: IconChat, live: true },
      { id: "meme", label: "밈", icon: IconMeme },
    ],
  },
  {
    label: "레이스",
    items: [
      { id: "pit-wall", label: "핏월", icon: IconPitWall },
      { id: "f1-101", label: "F1 101", icon: IconGuide },
    ],
  },
];

export const MYPAGE_ITEM: NavItem = {
  id: "mypage",
  label: "마이페이지",
  icon: IconUser,
};

/** Flat lookup of every nav item (incl. mypage) by id. */
export const ALL_NAV_ITEMS: NavItem[] = [
  ...NAV_GROUPS.flatMap((g) => g.items),
  MYPAGE_ITEM,
];

/* ------------------------------------------------------------------ */
/* Profile badge — team logos / all-fan / guest.                       */
/* ------------------------------------------------------------------ */

export function profileBadge(profile: UserProfile | null | undefined): {
  icon: string;
  label: string;
} {
  if (!profile) return { icon: "👤", label: "게스트" };
  const reals = getRealTeamIds(profile);
  if (reals.length > 0) {
    const logos = reals.map((id) => getTeam(id)?.logo ?? "").join("");
    return { icon: logos, label: profile.nickname };
  }
  return { icon: isAllFan(profile) ? "🌈" : "👤", label: profile.nickname };
}
