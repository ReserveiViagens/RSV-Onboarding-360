import { test, expect } from '@playwright/test'

test('basic booking creation flow', async ({ page }) => {
  await page.goto('/bookings-v2')
  await page.getByRole('button', { name: 'Nova Reserva' }).click()
  await expect(page.getByRole('dialog', { name: 'Nova Reserva' })).toBeVisible()
  await page.getByLabel('Pacote').fill('Caldas Novas Família 3 dias')
  await page.getByLabel('Cliente').fill('João Silva')
  // datas mínimas: usar hoje e +2 dias
  const today = new Date()
  const toISO = (d: Date) => d.toISOString().slice(0, 10)
  const in2 = new Date(today); in2.setDate(today.getDate() + 2)
  await page.getByLabel('Check-in').fill(toISO(today))
  await page.getByLabel('Check-out').fill(toISO(in2))
  await page.getByLabel('Valor (R$)').fill('1500')
  await page.getByRole('button', { name: 'Criar' }).click()

  await expect(page.getByText('Lista de Reservas')).toBeVisible()
})

