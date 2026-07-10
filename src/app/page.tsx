import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--canvas)]">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-block h-6 w-1.5 rounded-sm bg-[var(--primary)]"
            aria-hidden
          />
          <span className="font-display text-lg font-extrabold tracking-tight text-[var(--text)]">
            PADDOCK<span className="text-[var(--primary)]">.</span>KOREA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/app"
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)]"
          >
            패독 입장하기
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[13px] font-medium text-[var(--text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            한국 2030 F1 팬을 위한 커뮤니티
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--text)] sm:text-5xl">
            내 팀을 향한 진심어린 응원,
            <br />
            <span className="text-[var(--primary)]">이제 하나의 공간에서.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            팀을 고르고, 라이브로 떠들고, 밈을 던지세요. F1이 처음이어도 입문
            가이드와 한국 시간 일정·순위까지 한 화면에서 따라갈 수 있습니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)]"
            >
              패독 입장하기 →
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
            >
              기능 둘러보기
            </a>
          </div>
        </div>

        {/* Product preview mock — token-only, no assets */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-pop)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
              <span className="text-sm font-semibold text-[var(--text)]">
                The Main Straight
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
              LIVE
            </span>
          </div>
          <div className="space-y-2.5 py-4">
            {[
              { c: "#ff8000", n: "규현", t: "노리스 오늘 페이스 미쳤다 🔥" },
              { c: "#e10600", n: "지수", t: "르클레르 예선 기대해도 될까?" },
              { c: "#27f4d2", n: "민재", t: "메르세데스 전략 이해 안 감 ㅋㅋ" },
            ].map((m) => (
              <div key={m.n} className="flex items-start gap-2.5">
                <span
                  className="mt-1 h-6 w-1 shrink-0 rounded-full"
                  style={{ background: m.c }}
                  aria-hidden
                />
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: m.c }}>
                    {m.n}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">{m.t}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-[var(--border)] pt-3">
            <div className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-faint)]">
              메시지를 입력하세요…
            </div>
            <div className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
              보내기
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      title: "정보가 흩어져 있다",
      body: "F1 일정·순위·뉴스가 사이트마다 흩어져 있어 한국 팬이 따라가기 어렵습니다.",
    },
    {
      title: "팀 소속감이 약하다",
      body: "응원하는 팀이 같은 팬들과 실시간으로 떠들 곳이 마땅치 않습니다.",
    },
    {
      title: "입문 장벽이 높다",
      body: "DRS·언더컷·MGU-K… 첫 시즌엔 용어부터가 외계어처럼 느껴집니다.",
    },
  ];
  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface-2)]/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[13px] font-semibold text-[var(--text-subtle)]">
          문제
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
          한국 F1 팬은 왜 흩어져 있을까?
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {problems.map((p) => (
            <article
              key={p.title}
              className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-lg font-bold tracking-tight text-[var(--text)]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      tag: "실시간 채팅",
      title: "The Main Straight",
      body: "전체 팬과 실시간으로 응원·반응을 주고받는 라이브 채팅.",
    },
    {
      tag: "게시판",
      title: "전체·팀별 커뮤니티",
      body: "글을 쓰고, 좋아요를 누르고, 이미지 댓글로 함께 떠들어요.",
    },
    {
      tag: "밈",
      title: "Meme Box",
      body: "이미지로 밈을 던지고 좋아요로 띄워주세요.",
    },
    {
      tag: "가이드 · 순위",
      title: "F1 용어 사전 & Pit Wall",
      body: "용어·전략 입문 가이드와 KST 일정·순위표를 한곳에서.",
    },
  ];
  return (
    <section id="features" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[13px] font-semibold text-[var(--text-subtle)]">
          핵심 기능
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
          하나의 패독, 모든 트랙.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]"
            >
              <span className="text-[13px] font-semibold text-[var(--primary)]">
                {f.tag}
              </span>
              <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-[var(--text)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
          준비됐다면, 패독으로.
        </h2>
        <p className="mt-3 text-base text-[var(--text-muted)]">
          닉네임 한 줄과 응원할 팀 하나만 있으면 1분 만에 합류할 수 있어요.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-f1-red-pressed)]"
        >
          패독 입장하기 →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
        <span className="text-[13px] text-[var(--text-faint)]">
          © 2026 Paddock Korea — Vibe Coding Workshop
        </span>
        <Link
          href="/app"
          className="text-[13px] font-medium text-[var(--text-subtle)] transition-colors hover:text-[var(--text)]"
        >
          패독 입장하기 →
        </Link>
      </div>
    </footer>
  );
}
