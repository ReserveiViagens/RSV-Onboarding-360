import { test, expect } from '@playwright/test'

test('dashboard v2 renders key sections', async ({ page }) => {
  await page.goto('/dashboard-v2')
  await expect(page.getByText('Reservas Totais')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Receita Mensal' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Ações Rápidas' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reservas Recentes' })).toBeVisible()
})

