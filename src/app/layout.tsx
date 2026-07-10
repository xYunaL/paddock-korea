import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "패독 코리아 — Paddock Korea",
  description:
    "한국 F1 팬을 위한 팀 기반 커뮤니티. 전체·팀 채팅, 밈, 입문 가이드, 순위·일정을 한 곳에서.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} light h-full antialiased`}
    >
      <head>
        {/* Apply saved theme before paint to avoid a flash (default: light). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('paddock-korea:theme');var dark=t==='dark';var c=document.documentElement.classList;c.toggle('dark',dark);c.toggle('light',!dark);}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--canvas)] text-[var(--text)] font-body">
        {children}
      </body>
    </html>
  );
}
