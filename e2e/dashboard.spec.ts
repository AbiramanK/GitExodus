import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the analytics header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Analytics Dashboard');
  });

  test('should display statistics cards', async ({ page }) => {
    await expect(page.getByText('Total Repositories')).toBeVisible();
    await expect(page.getByText('Dirty Workspaces')).toBeVisible();
    await expect(page.getByText('Unpushed Changes')).toBeVisible();
    await expect(page.getByText('Clean Status')).toBeVisible();
  });

  test('should toggle sidebar', async ({ page }) => {
    const sidebar = page.getByTestId('app-sidebar');
    const toggleButton = page.locator('button').filter({ has: page.locator('svg.lucide-panel-left-close, svg.lucide-panel-left-open') }).first();
    
    // Initial width check (assuming w-64 is default)
    await expect(sidebar).toHaveClass(/w-64/);
    
    await toggleButton.click();
    await expect(sidebar).toHaveClass(/w-16/);
    
    await toggleButton.click();
    await expect(sidebar).toHaveClass(/w-64/);
  });
});
