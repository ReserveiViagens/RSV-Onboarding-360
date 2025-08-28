import { test, expect } from '@playwright/test'

test('travel page filters and preview works', async ({ page }) => {
  await page.goto('/travel-v2')
  await expect(page.getByRole('heading', { name: 'Catálogo de Viagens' })).toBeVisible()
  await page.getByPlaceholder('Caldas Novas').fill('Caldas')
  // Deve renderizar algum card e permitir preview
  const firstPreview = page.getByRole('button', { name: 'Preview' }).first()
  await firstPreview.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Fechar' }).click()
})

