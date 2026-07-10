"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { DriverTag } from "@/components/ui/DriverTag";
import { TeamPickerGrid } from "@/components/onboarding/TeamPickerGrid";
import { getTeam, toggleTeamSelection, TEAMS, primaryTeamId } from "@/lib/teams";
import { DRIVERS_BY_TEAM, FAN_TAG } from "@/lib/drivers";
import { formatKstDateTime, isValidUrl, cn } from "@/lib/utils";
import { useAuthGate } from "@/components/auth/AuthGate";
import type { UserProfile } from "@/lib/types";
import type { Post } from "@/features/board/types";

type Props = {
  profile: UserProfile | null;
  posts: Post[];
  onUpdateProfile: (next: UserProfile) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

const MAX_NICKNAME = 15;

/* 드라이버 태그 선택 버튼 — 연한 회색 배경. */
const tagBtn =
  "flex items-center rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors";
const tagBtnIdle =
  "bg-[var(--surface-2)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]";
const tagBtnActive =
  "bg-[var(--surface-2)] text-[var(--text)] ring-2 ring-[var(--primary)] ring-offset-1 ring-offset-[var(--surface)]";

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
export function MyPageView({
  profile,
  posts,
  onUpdateProfile,
  onLogout,
  onDeleteAccount,
}: Props) {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? "");
  const [selected, setSelected] = useState<string[]>(
    profile?.selectedTeamIds ?? []
  );
  const [driverTag, setDriverTag] = useState(profile?.driverTag ?? "");
  const [nickCheck, setNickCheck] = useState<
    null | { ok: boolean; empty?: boolean }
  >(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { requireAuth } = useAuthGate();

  if (!profile) {
    return (
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <EmptyState
          icon="👤"
          title="로그인이 필요해요"
          description="로그인하고 프로필을 설정하면 채팅·게시판·응원에 참여할 수 있어요."
          action={
            <button
              type="button"
              onClick={requireAuth}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)]"
            >
              로그인 / 회원가입
            </button>
          }
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

  // Nickname duplicate check. No user backend exists, so we check against the
  // known board authors (posts + comments) other than the current user.
  const takenNicknames = new Set<string>();
  for (const p of posts) {
    if (p.authorNickname !== profile.nickname)
      takenNicknames.add(p.authorNickname.trim().toLowerCase());
    for (const c of p.comments) {
      if (c.authorNickname !== profile.nickname)
        takenNicknames.add(c.authorNickname.trim().toLowerCase());
    }
  }
  function checkNickname() {
    const name = nickname.trim();
    if (!name) {
      setNickCheck({ ok: false, empty: true });
      return;
    }
    setNickCheck({ ok: !takenNicknames.has(name.toLowerCase()) });
  }

  // Author-preview color = the user's primary (currently selected) team color.
  const previewTeam = getTeam(primaryTeamId({ selectedTeamIds: selected }) ?? "");
  const previewNameColor = previewTeam?.baseColor ?? "var(--text)";

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
        <p className="mt-1 text-[13px] text-[var(--text-subtle)]">
          <span className="text-[var(--text-faint)]">이메일 · </span>
          {profile.email ?? "소셜 계정으로 가입"}
        </p>

        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0">
          {/* 입력 — 프로필 사진 URL + 닉네임 */}
          <div className="min-w-0 space-y-8 sm:w-3/5">
            <div>
              <span className="block text-[13px] font-medium text-[var(--text-muted)]">
                프로필 사진
              </span>
              <div className="mt-2 flex w-full items-center gap-2">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  aria-label="프로필 사진 URL"
                  aria-invalid={showAvatarError}
                  className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
                />
                <button
                  type="button"
                  disabled
                  title="파일 업로드는 추후 지원 예정입니다"
                  className="shrink-0 cursor-not-allowed rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-[13px] font-semibold text-[var(--text-subtle)]"
                >
                  업로드
                </button>
              </div>
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

            <div>
              <div className="flex w-full items-center justify-between">
                <span className="text-[13px] font-medium text-[var(--text-muted)]">
                  닉네임
                </span>
                <span className="text-[13px] tabular-nums text-[var(--text-faint)]">
                  {nickname.length}/{MAX_NICKNAME}
                </span>
              </div>
              <div className="mt-2.5 flex w-full items-center gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNickCheck(null);
                  }}
                  maxLength={MAX_NICKNAME}
                  aria-label="닉네임"
                  className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15"
                />
                <button
                  type="button"
                  onClick={checkNickname}
                  className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[13px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
                >
                  중복확인
                </button>
              </div>
              {nickCheck && (
                <span
                  className={cn(
                    "mt-1.5 block text-[13px] font-medium",
                    nickCheck.empty
                      ? "text-[var(--text-faint)]"
                      : nickCheck.ok
                        ? "text-[#15803d]"
                        : "text-[var(--primary)]"
                  )}
                >
                  {nickCheck.empty
                    ? "닉네임을 입력해주세요"
                    : nickCheck.ok
                      ? "✓ 사용 가능한 닉네임입니다"
                      : "이미 사용 중인 닉네임입니다"}
                </span>
              )}
            </div>
          </div>

          {/* 미리보기 — 입력 영역과 오른쪽 여백 사이 가운데 정렬 */}
          <div className="flex justify-center sm:flex-1">
            <div className="w-[240px] max-w-full sm:translate-x-[5px]">
              <Avatar
                src={avatarOk ? avatarUrl : undefined}
                name={nickname}
                size={240}
                className="border border-[var(--border)] shadow-[var(--shadow-card)]"
              />
              <div className="mt-6 flex w-full items-center justify-start gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2">
                <Avatar src={avatarOk ? avatarUrl : undefined} name={nickname} size={20} />
                <span
                  className="min-w-0 truncate text-sm font-semibold"
                  style={{ color: previewNameColor }}
                >
                  {nickname.trim() || "닉네임"}
                </span>
                {driverTag && <DriverTag driverId={driverTag} />}
              </div>
            </div>
          </div>
        </div>

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
          {/* 선택 안 함 / F1 FAN */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDriverTag("")}
              aria-pressed={driverTag === ""}
              className={cn(tagBtn, driverTag === "" ? tagBtnActive : tagBtnIdle)}
            >
              선택 안 함
            </button>
            <button
              type="button"
              onClick={() =>
                setDriverTag(driverTag === FAN_TAG ? "" : FAN_TAG)
              }
              aria-pressed={driverTag === FAN_TAG}
              className={cn(
                tagBtn,
                "gap-2",
                driverTag === FAN_TAG ? tagBtnActive : tagBtnIdle
              )}
            >
              <DriverTag driverId={FAN_TAG} />
              <span>올팬</span>
            </button>
          </div>

          {/* 팀 (2열) */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
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
                          tagBtn,
                          "gap-2",
                          active ? tagBtnActive : tagBtnIdle
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

      {/* 계정 — 로그아웃 / 회원탈퇴 */}
      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
          계정
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
          >
            로그아웃
          </button>
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg border border-[var(--primary)]/40 px-4 py-2.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/8"
            >
              회원탈퇴
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--primary)]/40 bg-[var(--primary)]/6 px-3 py-2">
              <span className="text-[13px] font-medium text-[var(--text)]">
                정말 탈퇴하시겠어요? 모든 데이터가 삭제되며 되돌릴 수 없습니다.
              </span>
              <button
                type="button"
                onClick={onDeleteAccount}
                className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)]"
              >
                탈퇴하기
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-md px-3 py-1.5 text-[13px] font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--text)]"
              >
                취소
              </button>
            </div>
          )}
        </div>
        <p className="mt-2 text-[13px] text-[var(--text-faint)]">
          로그아웃 시 온보딩 화면으로 돌아갑니다. 회원탈퇴 시 프로필·응원·동의 기록 등 모든 로컬 데이터가 삭제됩니다.
        </p>
      </section>
    </div>
  );
}
