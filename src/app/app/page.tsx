"use client";

import { useState } from "react";
import { AppHeader, type TabId } from "@/components/layout/AppHeader";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { ChatRoom } from "@/features/chat/ChatRoom";
import { MemeFeed } from "@/features/memes/MemeFeed";
import { F1101Guide } from "@/features/f1guide/F1101Guide";
import { PitWallPage } from "@/features/pitwall/PitWallPage";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabId>("main-straight");
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  return (
    <div className="carbon-grid flex flex-1 flex-col">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
            Session 2 — Shell preview
          </p>
          <button
            type="button"
            onClick={() => setOnboardingOpen(true)}
            className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/65 hover:text-white"
          >
            온보딩 미리보기
          </button>
        </div>

        {activeTab === "main-straight" && <ChatRoom roomType="global" />}
        {activeTab === "garage" && <ChatRoom roomType="team" teamName="팀 미선택" />}
        {activeTab === "meme" && <MemeFeed />}
        {activeTab === "f1-101" && <F1101Guide />}
        {activeTab === "pit-wall" && <PitWallPage />}
      </main>

      <OnboardingModal
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
}
