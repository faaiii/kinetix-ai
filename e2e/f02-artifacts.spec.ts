import { test, expect } from '@playwright/test';

test.describe('F02: Interactive Artifact Canvas, Code Switching, and Execution', () => {
  test('F02-H1 & F02-H2: View artifact, switch between Preview and Code tabs', async ({
    page,
  }) => {
    await page.goto('/');

    // Existing seed chat conv-1 has an active SaaS Sales Funnel artifact
    const artifactCard = page.getByText(/saas sales & conversion funnel dashboard/i).first();
    await expect(artifactCard).toBeVisible();

    // Verify split canvas is open
    await expect(page.getByRole('heading', { name: /saas sales & conversion funnel dashboard/i })).toBeVisible();

    // Preview tab is active by default with sandboxed iframe
    const previewTab = page.getByRole('button', { name: /preview canvas/i });
    await expect(previewTab).toBeVisible();

    // Switch to Code tab
    const codeTab = page.getByRole('button', { name: /code view/i });
    await codeTab.click();

    // Code block should be displayed with syntax
    await expect(page.locator('pre code')).toBeVisible();

    // Switch back to Preview tab
    await previewTab.click();
    const iframe = page.locator('iframe');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute('sandbox', 'allow-scripts');
  });

  test('F02-E2: Maximize and minimize artifact drawer', async ({ page }) => {
    await page.goto('/');

    const maximizeButton = page.getByTitle(/maximize/i);
    await maximizeButton.click();

    // In maximized mode, drawer has fixed inset-0 class
    const drawer = page.locator('.shadow-drawer');
    await expect(drawer).toHaveClass(/fixed inset-0/);

    const minimizeButton = page.getByTitle(/minimize/i);
    await minimizeButton.click();
    await expect(drawer).not.toHaveClass(/fixed inset-0/);
  });
});
