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

test('app page shows onboarding for a fresh visitor', async ({ page }) => {
  await page.goto('/app');
  // With no saved profile, the onboarding dialog opens automatically.
  await expect(
    page.getByRole('heading', { name: '패독에 오신 것을 환영합니다' })
  ).toBeVisible();
});
