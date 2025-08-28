import { test, expect } from '@playwright/test'

test('admin-test protected page requires login', async ({ page }) => {
  await page.goto('/admin-test')
  await expect(page).toHaveURL(/login/)
})

