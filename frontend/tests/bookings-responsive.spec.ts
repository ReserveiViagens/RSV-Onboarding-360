import { test, expect } from '@playwright/test'

test('bookings page responsive', async ({ page }) => {
  await page.goto('/bookings-v2')
  await page.setViewportSize({ width: 360, height: 800 })
  await expect(page.getByRole('button', { name: 'Nova Reserva' })).toBeVisible()
  await page.setViewportSize({ width: 1024, height: 800 })
  await expect(page.getByText('Calendário (14 dias)')).toBeVisible()
})

