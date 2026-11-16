import { test, expect } from '@playwright/test';

test.describe('F03: Projects Workspace & Context Budget Metering', () => {
  test('F03-H1: Navigate to projects, inspect knowledge budget and instructions', async ({
    page,
  }) => {
    await page.goto('/projects');

    // Verify projects page title
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();

    // Verify seed project
    await expect(page.getByText('Product Growth 2026').first()).toBeVisible();

    // Context budget meter visible
    await expect(page.getByText(/project context window budget/i)).toBeVisible();
    await expect(page.getByText(/48.5k \/ 200k tokens/i)).toBeVisible();

    // Custom instructions textarea visible
    const instructions = page.locator('textarea');
    await expect(instructions).toBeVisible();
    await expect(instructions).toHaveValue(/act as a principal product manager/i);
  });

  test('F03-H2: Create a new project workspace', async ({ page }) => {
    await page.goto('/projects');

    // Click "New" project button
    await page.getByRole('button', { name: /new/i }).click();

    // Fill form
    await page.getByPlaceholder(/q1 marketing campaign/i).fill('Autonomous Agent Engine');
    await page.getByPlaceholder(/short summary/i).fill('Multi-agent reasoning orchestration specs');

    // Submit
    await page.getByRole('button', { name: /create project/i }).click();

    // New project should be active
    await expect(page.getByRole('heading', { name: 'Autonomous Agent Engine' })).toBeVisible();
  });
});
