import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="carbon-grid flex flex-1 flex-col">
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
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-6 w-1.5 rounded-sm bg-[var(--color-f1-red)]"
            aria-hidden
          />
          <span className="font-display text-[20px] font-black tracking-tight">
            PADDOCK<span className="text-[var(--color-f1-red)]">.</span>KOREA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/app"
            className="rounded-full border border-[var(--border)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            Enter
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-f1-red)]">
        For Korean F1 Fans
      </p>
      <h1 className="mt-4 font-display text-4xl font-black leading-tight tracking-tight sm:text-6xl">
        내 팀을 향한 진심어린 응원,
        <br />
        <span className="text-[var(--color-f1-red)]">이제 하나의 공간에서.</span>
      </h1>
      <p className="mt-6 max-w-xl text-base text-[var(--text-muted)] leading-relaxed sm:text-lg">
        팀을 고르고, 라이브로 떠들고, 밈을 던지세요. F1이 처음이어도 입문 가이드와
        한국 시간 일정·순위까지 한 화면에서 따라갈 수 있습니다.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-f1-red)] px-6 py-3 font-mono text-[12px] font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:bg-[var(--color-f1-red-pressed)]"
        >
          패독 입장하기 →
        </Link>
        <a
          href="#features"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          기능 둘러보기
        </a>
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
    <section className="border-t border-[var(--border)] bg-[var(--color-charcoal-800)]/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-subtle)]">
          The Problem
        </p>
        <h2 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">
          한국 F1 팬은 왜 흩어져 있을까?
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {problems.map((p) => (
            <article
              key={p.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-700)] p-6"
            >
              <h3 className="font-display text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
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
      tag: "Chat",
      title: "The Main Straight",
      body: "전체 팬과 실시간으로 응원·반응을 주고받는 라이브 채팅.",
    },
    {
      tag: "Team",
      title: "The Garage",
      body: "같은 팀을 응원하는 팬끼리 모이는 팀 전용 방.",
    },
    {
      tag: "Meme",
      title: "Meme Box",
      body: "이미지 URL로 밈을 던지고 좋아요로 띄워주세요.",
    },
    {
      tag: "Guide",
      title: "F1 101 & Pit Wall",
      body: "용어·전략 입문 가이드와 KST 일정·순위표를 한곳에서.",
    },
  ];
  return (
    <section id="features" className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-subtle)]">
          Core Features
        </p>
        <h2 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">
          하나의 패독, 네 개의 트랙.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.title}
              className="racing-border rounded-2xl border border-[var(--border)] bg-[var(--color-charcoal-800)] p-6 pl-8"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-f1-red)]">
                {f.tag}
              </span>
              <h3 className="mt-2 font-display text-xl font-black tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
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
        <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          준비됐다면, 패독으로.
        </h2>
        <p className="mt-3 text-base text-[var(--text-muted)]">
          닉네임 한 줄과 응원할 팀 하나만 있으면 1분 만에 합류할 수 있어요.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-f1-red)] px-7 py-3 font-mono text-[12px] font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:bg-[var(--color-f1-red-pressed)]"
        >
          패독 입장하기 →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
          © 2026 Paddock Korea — Vibe Coding Workshop
        </span>
        <Link
          href="/app"
          className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)] hover:text-[var(--text)]"
        >
          Enter the paddock →
        </Link>
      </div>
    </footer>
  );
}
