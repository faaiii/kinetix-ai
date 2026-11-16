import { test, expect } from '@playwright/test';

test.describe('F01: Prompt Composition, Streaming, and Extended Thinking', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept console errors & 5xx responses
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Client Console Error: ${msg.text()}`);
      }
    });
    page.on('response', (res) => {
      if (res.status() >= 500) {
        throw new Error(`Server returned ${res.status()} on ${res.url()}`);
      }
    });
  });

  test('F01-H1: User can start new chat, send prompt, and see streaming response', async ({
    page,
  }) => {
    await page.goto('/');

    // Verify initial home greeting
    await expect(page.getByRole('heading', { name: /what will we engineer today/i })).toBeVisible();

    // Type prompt in ChatInput textarea
    const chatInput = page.getByPlaceholder(/describe a project|what will we engineer/i);
    await chatInput.fill('Explain the difference between synchronous and asynchronous code');

    // Submit prompt
    await page.getByRole('button', { name: /send message/i }).click();

    // Message bubble should render
    await expect(page.getByText(/explain the difference between synchronous and asynchronous code/i)).toBeVisible();

    // Assistant response should generate and render
    await expect(page.getByText(/kinetix/i).first()).toBeVisible();
  });

  test('F01-E1: Empty prompt cannot be submitted', async ({ page }) => {
    await page.goto('/');
    const sendButton = page.getByRole('button', { name: /send message/i });
    await expect(sendButton).toBeDisabled();
  });

  test('F01-E4: Extended Thinking mode can be toggled', async ({ page }) => {
    await page.goto('/');

    // Verify Thinking mode toggle button exists for Kinetix Reasoning engine
    const thinkingButton = page.getByRole('button', { name: /thinking/i });
    await expect(thinkingButton).toBeVisible();

    // Toggle thinking state
    await thinkingButton.click();
    await expect(page.getByRole('button', { name: /thinking off/i })).toBeVisible();

    await thinkingButton.click();
    await expect(page.getByRole('button', { name: /thinking on/i })).toBeVisible();
  });
});
