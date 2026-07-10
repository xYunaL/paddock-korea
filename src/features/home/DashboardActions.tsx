"use client";

import { useEffect, useState } from "react";
import { cn, formatKstDateTime } from "@/lib/utils";
import { getTheme, toggleTheme, type Theme } from "@/lib/theme";
import { getNotifSeen, setNotifSeen } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";
import type { Post } from "@/features/board/types";
import type { TabId } from "@/components/layout/nav";

type Props = {
  profile: UserProfile | null;
  posts: Post[];
  onNavigate: (tab: TabId) => void;
  onLogout: () => void;
};

type Note = {
  postId: string;
  postTitle: string;
  author: string;
  text: string;
  createdAt: string;
};

/* Image (SVG) icons — not emoji. */
function BellIcon({ className }: { className?: string }) {
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
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

const iconBtn =
  "relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text)]";
const menuItem =
  "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm text-[var(--text)] transition-colors hover:bg-[var(--hover)]";

/**
 * 대시보드 우상단 액션 — 알림(내 글에 달린 댓글) + 계정 메뉴(프로필/로그아웃/테마).
 */
export function DashboardActions({ profile, posts, onNavigate, onLogout }: Props) {
  const [open, setOpen] = useState<null | "notif" | "menu">(null);
  const [theme, setThemeState] = useState<Theme>("light");
  const [seenAt, setSeenAt] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setThemeState(getTheme());
    setSeenAt(getNotifSeen());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const notes: Note[] = profile
    ? posts
        .filter((p) => p.authorNickname === profile.nickname)
        .flatMap((p) =>
          p.comments
            .filter((c) => c.authorNickname !== profile.nickname)
            .map((c) => ({
              postId: p.id,
              postTitle: p.title,
              author: c.authorNickname,
              text: c.text,
              createdAt: c.createdAt,
            }))
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    : [];

  const unread = notes.filter((n) => n.createdAt > seenAt).length;

  function openNotif() {
    if (open === "notif") {
      setOpen(null);
      return;
    }
    setOpen("notif");
    const now = new Date().toISOString();
    setNotifSeen(now);
    setSeenAt(now);
  }

  return (
    <div className="relative flex items-center gap-1.5">
      {open && (
        <button
          type="button"
          aria-label="닫기"
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-10 cursor-default"
        />
      )}

      {/* 알림 */}
      <button
        type="button"
        onClick={openNotif}
        aria-label="알림"
        className={iconBtn}
      >
        <BellIcon className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open === "notif" && (
        <div className="absolute right-0 top-11 z-20 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-pop)]">
          <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--text)]">
            알림
          </div>
          {notes.length === 0 ? (
            <p className="px-4 py-6 text-center text-[13px] text-[var(--text-subtle)]">
              내 글에 달린 새 댓글이 없어요.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {notes.slice(0, 20).map((n, i) => (
                <li key={`${n.postId}-${n.createdAt}-${i}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(null);
                      onNavigate("board");
                    }}
                    className="block w-full px-4 py-2.5 text-left transition-colors hover:bg-[var(--hover)]"
                  >
                    <p className="text-[13px] text-[var(--text)]">
                      <span className="font-semibold">{n.author}</span>님이{" "}
                      <span className="font-medium">{n.postTitle}</span>에 댓글을
                      남겼어요
                    </p>
                    {n.text && (
                      <p className="mt-0.5 truncate text-[13px] text-[var(--text-muted)]">
                        {n.text}
                      </p>
                    )}
                    <p className="mt-0.5 text-[12px] text-[var(--text-faint)]">
                      {formatKstDateTime(n.createdAt)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 계정 메뉴 */}
      <button
        type="button"
        onClick={() => setOpen(open === "menu" ? null : "menu")}
        aria-label="계정 메뉴"
        aria-haspopup="menu"
        className={iconBtn}
      >
        <UserIcon className="h-5 w-5" />
      </button>

      {open === "menu" && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] py-1 shadow-[var(--shadow-pop)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(null);
              onNavigate("mypage");
            }}
            className={menuItem}
          >
            프로필 설정
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setThemeState(toggleTheme())}
            className={menuItem}
          >
            <span>{theme === "dark" ? "라이트 모드" : "다크 모드"}</span>
            <span className="text-[12px] text-[var(--text-subtle)]">
              {theme === "dark" ? "켜짐" : "꺼짐"}
            </span>
          </button>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(null);
              onLogout();
            }}
            className={cn(menuItem, "text-[var(--primary)]")}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
