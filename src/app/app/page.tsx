"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import type { TabId } from "@/components/layout/nav";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { AuthGateProvider } from "@/components/auth/AuthGate";
import { AuthModal } from "@/components/auth/AuthModal";
import { HomeView } from "@/features/home/HomeView";
import { GlobalChatRoom } from "@/features/chat/GlobalChatRoom";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { BoardView } from "@/features/board/BoardView";
import { PostDetailView } from "@/features/board/PostDetailView";
import { useBoard } from "@/features/board/hooks/useBoard";
import type { BoardNav } from "@/features/board/types";
import { MemeFeed } from "@/features/memes/MemeFeed";
import { F1101Guide } from "@/features/f1guide/F1101Guide";
import { PitWallPage } from "@/features/pitwall/PitWallPage";
import { useNextRace } from "@/features/pitwall/useNextRace";
import { MyPageView } from "@/features/mypage/MyPageView";
import {
  getUserProfile,
  saveUserProfile,
  clearUserProfile,
  clearAllUserData,
} from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | undefined>(undefined);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [boardView, setBoardView] = useState<BoardNav>("global");

  function handleTabChange(tab: TabId) {
    setActiveTab(tab);
    if (tab !== "board") setSelectedPostId(null);
  }

  // Sidebar board sub-menu → open the board list at a specific view.
  function goBoard(view: BoardNav) {
    setBoardView(view);
    setSelectedPostId(null);
    setActiveTab("board");
  }

  // Global chat + board state lifted to page level so they survive tab switches.
  // Chat simulation runs while the chat surface is visible (dashboard preview
  // or the full chat destination).
  const globalChat = useChatMessages("global", {
    active: activeTab === "chat" || activeTab === "dashboard",
  });
  const board = useBoard();
  const race = useNextRace();

  // Load saved profile on first mount. No profile → stay in guest mode
  // (browse freely; member-only actions trigger the auth modal).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = getUserProfile();
    if (saved) setProfile(saved);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Guest attempted a member-only action → open login/signup.
  function requireAuth() {
    setAuthOpen(true);
  }

  // Mock auth success → proceed to onboarding (creates the member profile).
  // Carries the signup email (email path) into the new profile.
  function handleAuthenticated(email?: string) {
    setPendingEmail(email);
    setAuthOpen(false);
    setOnboardingOpen(true);
  }

  function handleComplete(next: UserProfile) {
    const withEmail: UserProfile = {
      ...next,
      email: pendingEmail ?? next.email,
    };
    saveUserProfile(withEmail);
    setProfile(withEmail);
    setOnboardingOpen(false);
    setActiveTab("dashboard");
    setPendingEmail(undefined);
  }

  function handleUpdateProfile(next: UserProfile) {
    saveUserProfile(next);
    setProfile(next);
  }

  function handleLogout() {
    clearUserProfile();
    setProfile(null);
    setSelectedPostId(null);
    setActiveTab("dashboard");
    setOnboardingOpen(true);
  }

  function handleDeleteAccount() {
    clearAllUserData();
    setProfile(null);
    setSelectedPostId(null);
    setActiveTab("dashboard");
    setOnboardingOpen(true);
  }

  return (
    <AuthGateProvider value={{ isMember: Boolean(profile), requireAuth }}>
      <div className="flex min-h-screen bg-[var(--canvas)]">
      <AppSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        profile={profile}
        nextRace={race.nextRace}
        live={race.live}
        dday={race.dday}
        boardView={activeTab === "board" ? boardView : null}
        onBoardView={goBoard}
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
              onLogout={handleLogout}
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
                view={boardView}
                onViewChange={setBoardView}
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
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
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

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}
      </div>
    </AuthGateProvider>
  );
}
