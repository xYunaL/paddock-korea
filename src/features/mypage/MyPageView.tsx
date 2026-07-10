"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { DriverTag } from "@/components/ui/DriverTag";
import { TeamPickerGrid } from "@/components/onboarding/TeamPickerGrid";
import { getTeam, toggleTeamSelection, TEAMS } from "@/lib/teams";
import { DRIVERS_BY_TEAM } from "@/lib/drivers";
import { formatKstDateTime, isValidUrl, cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import type { Post } from "@/features/board/types";

type Props = {
  profile: UserProfile | null;
  posts: Post[];
  onUpdateProfile: (next: UserProfile) => void;
};

const MAX_NICKNAME = 15;

function SaveButton({
  dirty,
  disabled,
  onClick,
}: {
  dirty: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {dirty ? "변경 저장" : "저장됨"}
    </button>
  );
}

/**
 * My Page — 기본 프로필(사진·닉네임) / 응원 팀 / 드라이버 태그를 각 섹션별로
 * 따로 저장한다. + 내가 작성한 게시글.
 */
export function MyPageView({ profile, posts, onUpdateProfile }: Props) {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? "");
  const [selected, setSelected] = useState<string[]>(
    profile?.selectedTeamIds ?? []
  );
  const [driverTag, setDriverTag] = useState(profile?.driverTag ?? "");

  if (!profile) {
    return (
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <EmptyState
          icon="👤"
          title="프로필이 없어요"
          description="먼저 온보딩에서 닉네임과 팀을 설정해주세요."
        />
      </section>
    );
  }

  const myPosts = posts
    .filter((p) => p.authorNickname === profile.nickname)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const avatarOk = isValidUrl(avatarUrl);
  const showAvatarError = avatarUrl.length > 0 && !avatarOk;

  // Per-section dirty flags + saves (each merges into the saved profile).
  const basicDirty =
    nickname.trim() !== profile.nickname ||
    avatarUrl.trim() !== (profile.avatarUrl ?? "");
  const basicCanSave =
    nickname.trim().length > 0 && basicDirty && !showAvatarError;
  const teamsDirty =
    JSON.stringify(selected) !== JSON.stringify(profile.selectedTeamIds);
  const tagDirty = driverTag !== (profile.driverTag ?? "");

  function saveBasic() {
    if (!basicCanSave) return;
    onUpdateProfile({
      ...profile!,
      nickname: nickname.trim(),
      avatarUrl: avatarOk ? avatarUrl.trim() : undefined,
    });
  }
  function saveTeams() {
    if (!teamsDirty) return;
    onUpdateProfile({ ...profile!, selectedTeamIds: selected });
  }
  function saveTag() {
    if (!tagDirty) return;
    onUpdateProfile({ ...profile!, driverTag: driverTag || undefined });
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--text)]">
          마이페이지
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          프로필과 응원 팀, 드라이버 태그를 관리하세요.
        </p>
      </div>

      {/* 1) 기본 프로필 — 사진 + 닉네임 */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
          기본 프로필
        </h2>

        <div className="mt-5">
          <span className="text-[13px] font-medium text-[var(--text-muted)]">
            프로필 사진
          </span>
          <div className="mt-2 flex items-center gap-3">
            <Avatar src={avatarOk ? avatarUrl : undefined} name={nickname} size={56} />
            <div className="min-w-0 flex-1">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                aria-label="프로필 사진 URL"
                aria-invalid={showAvatarError}
                className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
              />
              {showAvatarError ? (
                <span className="mt-1 block text-[13px] text-[var(--primary)]">
                  유효한 http(s) 이미지 URL을 입력해주세요
                </span>
              ) : (
                <span className="mt-1 block text-[13px] text-[var(--text-faint)]">
                  이미지 URL을 붙여넣으세요 (파일 업로드는 추후 지원)
                </span>
              )}
            </div>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-[13px] font-medium text-[var(--text-muted)]">
            닉네임
          </span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={MAX_NICKNAME}
            aria-label="닉네임"
            className="mt-2 w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
          />
          <span className="mt-1 block text-[13px] text-[var(--text-faint)]">
            {nickname.length}/{MAX_NICKNAME}
          </span>
        </label>

        <div className="mt-6">
          <SaveButton dirty={basicDirty} disabled={!basicCanSave} onClick={saveBasic} />
        </div>
      </section>

      {/* 2) 응원 팀 */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
          응원 팀 (최대 2)
        </h2>
        <div className="mt-3">
          <TeamPickerGrid selected={selected} onSelect={(id) => setSelected((prev) => toggleTeamSelection(prev, id))} />
        </div>
        <div className="mt-6">
          <SaveButton dirty={teamsDirty} disabled={!teamsDirty} onClick={saveTeams} />
        </div>
      </section>

      {/* 3) 드라이버 태그 */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
            드라이버 태그 (1명)
          </h2>
          {driverTag && <DriverTag driverId={driverTag} size="md" />}
        </div>

        <div className="mt-3 space-y-3">
          <button
            type="button"
            onClick={() => setDriverTag("")}
            aria-pressed={driverTag === ""}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors",
              driverTag === ""
                ? "border-[var(--primary)] bg-[var(--primary)]/8 text-[var(--text)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
            )}
          >
            선택 안 함
          </button>
          {TEAMS.map((team) => (
            <div key={team.id}>
              <p className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-subtle)]">
                <span
                  className="inline-block h-3 w-1 rounded-full"
                  style={{ background: team.baseColor }}
                  aria-hidden
                />
                {team.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {(DRIVERS_BY_TEAM[team.id] ?? []).map((d) => {
                  const active = driverTag === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDriverTag(active ? "" : d.id)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px] transition-colors",
                        active
                          ? "border-[var(--primary)] bg-[var(--primary)]/8 text-[var(--text)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      <DriverTag driverId={d.id} />
                      <span className="truncate">{d.nameKo}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <SaveButton dirty={tagDirty} disabled={!tagDirty} onClick={saveTag} />
        </div>
      </section>

      {/* 내가 작성한 게시글 */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold tracking-tight text-[var(--text)]">
            내가 작성한 게시글
          </h3>
          <span className="text-[13px] text-[var(--text-subtle)]">
            {myPosts.length}개
          </span>
        </div>

        {myPosts.length === 0 ? (
          <EmptyState
            icon="📝"
            title="작성한 글이 없어요"
            description="게시판에서 첫 글을 남겨보세요."
          />
        ) : (
          <ul className="mt-4 grid gap-2">
            {myPosts.map((post) => {
              const team =
                post.scope === "team" && post.teamId
                  ? getTeam(post.teamId)
                  : undefined;
              return (
                <li
                  key={post.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--hover)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold text-[var(--text)]">
                      {post.title}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                        post.scope === "global"
                          ? "bg-[var(--surface-2)] text-[var(--text-subtle)]"
                          : "bg-[var(--primary)]/10 text-[var(--primary)]"
                      )}
                    >
                      {post.scope === "global" ? "전체" : team?.name ?? "팀"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-[var(--text-muted)]">
                    {post.body}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[13px] text-[var(--text-faint)]">
                    <span>♥ {post.likes}</span>
                    <span>💬 {post.comments.length}</span>
                    <span>{formatKstDateTime(post.createdAt)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
