import { test, expect } from '@playwright/test'

async function login(page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

test('dashboard v2 renders key sections', async ({ page }) => {
  await login(page, 'admin@onion360.com', 'admin123')
  await page.goto('/dashboard-v2')
  await expect(page.getByText('Reservas Totais')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Receita Mensal' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Ações Rápidas' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Reservas Recentes' })).toBeVisible()
})

