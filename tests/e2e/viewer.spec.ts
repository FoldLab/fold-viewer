import { expect, test } from '@playwright/test';

test('loads the crane, exposes controls, and switches to synchronized text', async ({
  page,
}) => {
  await page.goto('/');
  const viewer = page.locator('.fold-viewer');
  await expect(viewer).toBeVisible();
  await expect(
    page.getByText('Loaded from a validated Fold Spec document.'),
  ).toBeVisible({ timeout: 15_000 });
  await expect(viewer.getByText('Step 43', { exact: true })).toBeVisible();
  await expect(
    viewer.getByRole('button', { name: /play animation/i }),
  ).toBeEnabled();
  await viewer.getByRole('button', { name: 'Text', exact: true }).click();
  await expect(
    viewer.getByRole('region', { name: 'Text instruction' }),
  ).toBeVisible();
  await viewer.getByRole('button', { name: 'Next step' }).click();
  await expect(
    viewer.getByRole('heading', { name: 'Check the completed crane' }),
  ).toBeVisible();
});

test('adapts the control bar to a narrow container', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const viewer = page.locator('.fold-viewer');
  await expect(viewer).toBeVisible();
  await expect(
    viewer.getByRole('slider', { name: 'Step progress' }),
  ).toBeVisible();
  await expect(viewer.locator('.fold-settings summary')).toBeVisible();
});
