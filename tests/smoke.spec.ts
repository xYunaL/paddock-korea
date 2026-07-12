import { test, expect } from '@playwright/test';

/**
 * Smoke tests for Paddock Korea.
 * Boots the app (see webServer in playwright.config.ts) and checks that the
 * two routes render — no external-site dependency.
 */

test('landing page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Paddock Korea/);
  // "패독 입장하기" CTA link exists (hero + CTA both use it).
  await expect(
    page.getByRole('link', { name: /패독 입장하기/ }).first()
  ).toBeVisible();
});

test('app page shows the guest dashboard for a fresh visitor', async ({ page }) => {
  await page.goto('/app');
  // With no saved profile, the visitor browses in guest mode — the dashboard
  // greets them as "게스트" (no forced onboarding; member-only actions open auth).
  await expect(
    page.getByRole('heading', { name: '안녕하세요, 게스트님' })
  ).toBeVisible();
  // The onboarding dialog is not forced on a fresh guest.
  await expect(
    page.getByRole('heading', { name: '패독에 오신 것을 환영합니다' })
  ).toHaveCount(0);
});
