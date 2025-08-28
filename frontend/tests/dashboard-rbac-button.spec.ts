import { test, expect } from '@playwright/test'

async function login(page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Senha').fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

test('admin sees protected button on dashboard', async ({ page }) => {
  await login(page, 'admin@onion360.com', 'admin123')
  await page.goto('/dashboard-v2')
  await expect(page.getByLabel('Botão admin')).toBeVisible()
})

test('demo does not see protected button on dashboard', async ({ page }) => {
  await login(page, 'demo@onionrsv.com', 'demo123')
  await page.goto('/dashboard-v2')
  await expect(page.getByLabel('Botão admin')).toHaveCount(0)
})

