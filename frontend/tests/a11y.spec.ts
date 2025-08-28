import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('ui-demo is accessible', async ({ page }) => {
  await page.goto('/ui-demo')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

