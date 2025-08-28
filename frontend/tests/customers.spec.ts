import { test, expect } from '@playwright/test'

test('create customer basic flow', async ({ page }) => {
  await page.goto('/customers-v2')
  await expect(page.getByRole('heading', { name: 'Gestão de Clientes' })).toBeVisible()
  await page.getByRole('button', { name: 'Novo Cliente' }).click()
  await expect(page.getByRole('dialog', { name: 'Novo Cliente' })).toBeVisible()
  await page.getByLabel('Nome').fill('Cliente Teste')
  await page.getByLabel('Email').fill('cliente@teste.com')
  await page.getByLabel('Telefone').fill('(65) 97777-0000')
  await page.getByRole('button', { name: 'Criar' }).click()
  await expect(page.getByRole('heading', { name: 'Clientes', exact: true })).toBeVisible()
})

