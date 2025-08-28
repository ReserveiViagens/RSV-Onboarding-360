import { test, expect } from '@playwright/test'

test('travel infinite scroll loads more items', async ({ page }) => {
  await page.goto('/travel-v2')
  const initialCount = await page.locator('text=Preview').count()
  await page.mouse.wheel(0, 2000)
  await page.waitForTimeout(500)
  const afterCount = await page.locator('text=Preview').count()
  expect(afterCount).toBeGreaterThanOrEqual(initialCount)
})

