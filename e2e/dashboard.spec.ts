import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('GitExodus');
  });

  test('should have a search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search repositories...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('test-repo');
    await expect(searchInput).toHaveValue('test-repo');
  });

  test('should toggle sidebar', async ({ page }) => {
    const sidebar = page.getByTestId('app-sidebar');
    const toggleButton = page.locator('button').filter({ has: page.locator('svg.lucide-panel-left-close, svg.lucide-panel-left-open') }).first();
    
    // Initial width check (assuming w-64 is default)
    // We can check by class or bounding box
    await expect(sidebar).toHaveClass(/w-64/);
    
    await toggleButton.click();
    await expect(sidebar).toHaveClass(/w-16/);
    
    await toggleButton.click();
    await expect(sidebar).toHaveClass(/w-64/);
  });
});
