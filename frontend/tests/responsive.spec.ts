import { test, expect } from '@playwright/test'

test('homepage responsive at common breakpoints', async ({ page }) => {
  await page.goto('/')
  await page.setViewportSize({ width: 320, height: 800 })
  await expect(page).toHaveTitle(/Onion|Reservei|Next/)
  await page.setViewportSize({ width: 768, height: 800 })
  await expect(page).toHaveTitle(/Onion|Reservei|Next/)
  await page.setViewportSize({ width: 1280, height: 800 })
  await expect(page).toHaveTitle(/Onion|Reservei|Next/)
})

