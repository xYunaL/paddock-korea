"use client";

import { createContext, useContext, type ReactNode } from "react";

type AuthGate = {
  /** Whether the current user is a signed-in member (has a profile). */
  isMember: boolean;
  /** Open the login/signup modal — call this when a guest attempts a member-only action. */
  requireAuth: () => void;
};

const AuthGateContext = createContext<AuthGate>({
  isMember: false,
  requireAuth: () => {},
});

export function AuthGateProvider({
  value,
  children,
}: {
  value: AuthGate;
  children: ReactNode;
}) {
  return (
    <AuthGateContext.Provider value={value}>{children}</AuthGateContext.Provider>
  );
}

export function useAuthGate(): AuthGate {
  return useContext(AuthGateContext);
}
