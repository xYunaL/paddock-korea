"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import type { TabId } from "@/components/layout/nav";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { HomeView } from "@/features/home/HomeView";
import { GlobalChatRoom } from "@/features/chat/GlobalChatRoom";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { BoardView } from "@/features/board/BoardView";
import { PostDetailView } from "@/features/board/PostDetailView";
import { useBoard } from "@/features/board/hooks/useBoard";
import { MemeFeed } from "@/features/memes/MemeFeed";
import { F1101Guide } from "@/features/f1guide/F1101Guide";
import { PitWallPage } from "@/features/pitwall/PitWallPage";
import { useNextRace } from "@/features/pitwall/useNextRace";
import { MyPageView } from "@/features/mypage/MyPageView";
import { getUserProfile, saveUserProfile } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    if (tab !== "board") setSelectedPostId(null);
  }

  // Global chat + board state lifted to page level so they survive tab switches.
  // Chat simulation runs while the chat surface is visible (dashboard preview
  // or the full chat destination).
  const globalChat = useChatMessages("global", {
    active: activeTab === "chat" || activeTab === "dashboard",
  });
  const board = useBoard();
  const race = useNextRace();

  // Load saved profile on first mount; open onboarding if none exists.
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
    setActiveTab("dashboard");
  }

  function handleUpdateProfile(next: UserProfile) {
    saveUserProfile(next);
    setProfile(next);
  }

  return (
    <div className="flex min-h-screen bg-[var(--canvas)]">
      <AppSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        profile={profile}
        nextRace={race.nextRace}
        live={race.live}
        dday={race.dday}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          profile={profile}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {activeTab === "dashboard" && (
            <HomeView
              profile={profile}
              messages={globalChat.messages}
              onSend={(text) => profile && globalChat.sendMessage(text, profile)}
              posts={board.posts}
              race={race}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === "chat" && (
            <div className="h-[calc(100vh-9rem)] lg:h-[calc(100vh-6rem)]">
              <GlobalChatRoom
                profile={profile}
                messages={globalChat.messages}
                onSend={(text) =>
                  profile && globalChat.sendMessage(text, profile)
                }
                minHeight={320}
                maxHeight={4000}
                fill
              />
            </div>
          )}

          {activeTab === "board" &&
            (selectedPostId === null ? (
              <BoardView
                profile={profile}
                board={board}
                onOpenPost={setSelectedPostId}
              />
            ) : (
              <PostDetailView
                profile={profile}
                board={board}
                postId={selectedPostId}
                onBack={() => setSelectedPostId(null)}
              />
            ))}

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
      </div>

      {onboardingOpen && (
        <OnboardingModal
          onClose={() => setOnboardingOpen(false)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
