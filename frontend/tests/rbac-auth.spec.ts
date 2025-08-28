import { test, expect } from '@playwright/test'

async function login(page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

test('admin user can access admin-test', async ({ page }) => {
  await login(page, 'admin@onion360.com', 'admin123')
  await page.goto('/admin-test')
  await expect(page.getByRole('heading', { name: 'Área Administrativa' })).toBeVisible()
})

test('demo user is redirected when accessing admin-test without admin permission', async ({ page }) => {
  await login(page, 'demo@onionrsv.com', 'demo123')
  await page.goto('/admin-test')
  await expect(page.getByText('Acesso Negado')).toBeVisible()
})