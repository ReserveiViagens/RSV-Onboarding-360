import { test, expect } from '@playwright/test'

test('notification can be marked as read', async ({ page }) => {
  await page.goto('/notifications-v2')
  await page.getByRole('button', { name: 'Simular notificação' }).click()
  const markBtn = page.getByRole('button', { name: 'Marcar como lida' }).first()
  await expect(markBtn).toBeVisible()
  await markBtn.click()
})

