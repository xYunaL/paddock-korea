"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

type Props = {
  onClose: () => void;
  /** Mock auth success → parent proceeds to onboarding (member creation). */
  onAuthenticated: (email?: string) => void;
};

type Mode = "signup" | "login";

const input =
  "min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/15";

/**
 * 로그인 / 회원가입 화면 (프론트 전용).
 * 구글·네이버 간편 인증 + 이메일 인증 코드. 실제 인증은 백엔드 연동 후 동작하며,
 * 지금은 어떤 방식이든 onAuthenticated()로 온보딩(회원 생성)으로 진행한다.
 */
export function AuthModal({ onClose, onAuthenticated }: Props) {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const verb = mode === "signup" ? "가입" : "로그인";

  return (
    <Modal
      labelledBy="auth-title"
      className="max-h-[90vh] w-full max-w-md overflow-y-auto p-7"
    >
      {/* 브랜드 */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-5 w-1.5 rounded-sm bg-[var(--primary)]"
            aria-hidden
          />
          <span className="font-display text-base font-extrabold tracking-tight text-[var(--text)]">
            PADDOCK<span className="text-[var(--primary)]">.</span>KOREA
          </span>
        </div>

        <h2
          id="auth-title"
          className="mt-4 font-display text-xl font-bold tracking-tight text-[var(--text)]"
        >
          {mode === "signup" ? "패독 코리아 회원가입" : "로그인"}
        </h2>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">
          {mode === "signup"
            ? "간편하게 가입하고 채팅·게시판·응원에 참여하세요."
            : "다시 오신 것을 환영합니다."}
        </p>

        {/* 소셜 간편 인증 */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => onAuthenticated()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[#3c4043] transition-colors hover:bg-[#f5f6f7]"
          >
            <span
              className="grid h-4 w-4 place-items-center rounded-full border border-[#dadce0] text-[11px] font-bold text-[#4285f4]"
              aria-hidden
            >
              G
            </span>
            Google로 {verb}
          </button>
          <button
            type="button"
            onClick={() => onAuthenticated()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#03c75a] px-4 py-2.5 text-sm font-semibold text-white transition-[filter] hover:brightness-95"
          >
            <span
              className="grid h-4 w-4 place-items-center rounded-sm bg-white/20 text-[11px] font-bold"
              aria-hidden
            >
              N
            </span>
            네이버로 {verb}
          </button>
        </div>

        {/* 구분선 */}
        <div className="my-4 flex items-center gap-3 text-[12px] text-[var(--text-faint)]">
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
          또는 이메일로 {verb}
          <span className="h-px flex-1 bg-[var(--border)]" aria-hidden />
        </div>

        {/* 이메일 인증 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setCodeSent(false);
                setCode("");
              }}
              placeholder="이메일 주소"
              aria-label="이메일 주소"
              className={input}
            />
            <button
              type="button"
              disabled={!emailValid}
              onClick={() => setCodeSent(true)}
              className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[13px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              인증코드 받기
            </button>
          </div>

          {codeSent && (
            <div className="space-y-2">
              <p className="text-[12px] text-[var(--text-subtle)]">
                입력하신 이메일로 인증코드를 보냈습니다. (데모: 아무 코드나 입력하면
                진행됩니다)
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="인증코드"
                  aria-label="인증코드"
                  className={input}
                />
                <button
                  type="button"
                  disabled={code.trim().length === 0}
                  onClick={() => onAuthenticated(email.trim())}
                  className="shrink-0 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  인증하고 {verb}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 모드 전환 */}
        <p className="mt-5 text-center text-[13px] text-[var(--text-muted)]">
          {mode === "signup" ? "이미 회원이신가요? " : "계정이 없으신가요? "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            {mode === "signup" ? "로그인" : "회원가입"}
          </button>
        </p>

        {/* 안내 + 게스트 유지 */}
        <p className="mt-4 rounded-lg bg-[var(--surface-2)] px-3 py-2 text-[12px] leading-relaxed text-[var(--text-subtle)]">
          현재는 화면만 구현된 상태로, 실제 인증(구글·네이버·이메일)은 백엔드 연동
          후 동작합니다. 데모에서는 어떤 방식이든 온보딩(회원 생성) 단계로
          진행됩니다.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--text)]"
          >
            게스트로 둘러보기
          </button>
        </div>
    </Modal>
  );
}
