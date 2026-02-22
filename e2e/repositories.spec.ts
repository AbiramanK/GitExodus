import { test, expect } from '@playwright/test';

test.describe('Repositories E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Click on the Repositories link in the sidebar
    // It's a div with text "Repositories"
    await page.getByText('Repositories').first().click();
    // Wait for the header to appear to ensure we navigated
    await expect(page.locator('h1')).toContainText('Repositories');
  });

  test('should display the repositories header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Repositories');
  });

  test('should have a search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search repositories...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('test-repo');
    await expect(searchInput).toHaveValue('test-repo');
  });

  test('should verify the filter buttons', async ({ page }) => {
    const dirtyButton = page.getByRole('button', { name: 'Dirty' });
    const unpushedButton = page.getByRole('button', { name: 'Unpushed' });
    
    await expect(dirtyButton).toBeVisible();
    await expect(unpushedButton).toBeVisible();
    
    await dirtyButton.click();
    await expect(dirtyButton).toHaveClass(/bg-primary|bg-secondary/); // Check actual class
    
    await dirtyButton.click();
    await expect(dirtyButton).not.toHaveClass(/bg-primary|bg-secondary/);
  });
});
