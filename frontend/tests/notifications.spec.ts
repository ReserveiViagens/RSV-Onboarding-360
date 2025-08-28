import { test, expect } from '@playwright/test'

test('notifications center and toast simulate', async ({ page }) => {
  await page.goto('/notifications-v2')
  await expect(page.getByRole('heading', { name: 'Notificações', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Simular notificação' }).click()
  await expect(page.getByRole('status')).toBeVisible()
})

