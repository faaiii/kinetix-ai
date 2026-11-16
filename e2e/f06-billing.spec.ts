import { test, expect } from '@playwright/test';

test.describe('F06: Settings, Appearance, and 5-Hour Usage Meter', () => {
  test('F06-H1: Settings page displays rolling usage meter and theme toggles', async ({
    page,
  }) => {
    await page.goto('/settings');

    // Heading
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    // Theme buttons
    await expect(page.getByRole('button', { name: /light/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /dark/i })).toBeVisible();

    // Plan & Usage section
    await expect(page.getByText('Pro Plan')).toBeVisible();
    await expect(page.getByText(/rolling message capacity/i)).toBeVisible();
    await expect(page.getByText('18 / 45 messages')).toBeVisible();

    // Stripe billing portal trigger
    await expect(page.getByRole('button', { name: /manage stripe billing portal/i })).toBeVisible();
  });
});
