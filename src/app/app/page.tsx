"use client";

import { useEffect, useState } from "react";
import { AppHeader, type TabId } from "@/components/layout/AppHeader";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { HomeView } from "@/features/home/HomeView";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { BoardView } from "@/features/board/BoardView";
import { useBoard } from "@/features/board/hooks/useBoard";
import { MemeFeed } from "@/features/memes/MemeFeed";
import { F1101Guide } from "@/features/f1guide/F1101Guide";
import { PitWallPage } from "@/features/pitwall/PitWallPage";
import { MyPageView } from "@/features/mypage/MyPageView";
import { getUserProfile, saveUserProfile } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabId>("main-straight");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Global chat + board state lifted to page level so they survive tab switches.
  const globalChat = useChatMessages("global", {
    active: activeTab === "main-straight",
  });
  const board = useBoard();

  // Load saved profile on first mount; open onboarding if none exists.
  // localStorage is client-only, so this must run in an effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = getUserProfile();
    if (saved) {
      setProfile(saved);
    } else {
      setOnboardingOpen(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleComplete(next: UserProfile) {
    saveUserProfile(next);
    setProfile(next);
    setOnboardingOpen(false);
    setActiveTab("main-straight");
  }

  function handleUpdateProfile(next: UserProfile) {
    saveUserProfile(next);
    setProfile(next);
  }

  return (
    <div className="carbon-grid flex flex-1 flex-col">
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profile={profile}
        onProfileClick={() => setActiveTab("mypage")}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {activeTab === "main-straight" && (
          <HomeView
            profile={profile}
            messages={globalChat.messages}
            onSend={(text) => profile && globalChat.sendMessage(text, profile)}
          />
        )}
        {activeTab === "board" && <BoardView profile={profile} board={board} />}
        {activeTab === "meme" && <MemeFeed profile={profile} />}
        {activeTab === "f1-101" && <F1101Guide />}
        {activeTab === "pit-wall" && <PitWallPage />}
        {activeTab === "mypage" && (
          <MyPageView
            profile={profile}
            posts={board.posts}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {onboardingOpen && (
        <OnboardingModal
          onClose={() => setOnboardingOpen(false)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
