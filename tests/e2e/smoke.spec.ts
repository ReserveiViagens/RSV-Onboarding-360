import { test, expect } from '@playwright/test';

/**
 * Teste de Fumaça - Validação básica da aplicação
 * Verifica se os componentes essenciais estão funcionando
 */
test.describe('Smoke Tests - Reservei Viagens Dashboard', () => {
  
  test('deve carregar a página inicial', async ({ page }) => {
    // Navegar para a página inicial
    await page.goto('/');
    
    // Verificar se a página carregou
    await expect(page).toHaveTitle(/Reservei Viagens/);
    
    // Verificar se o conteúdo principal está presente
    await expect(page.locator('body')).toBeVisible();
    
    // Verificar se não há erros de console
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Aguardar carregamento completo
    await page.waitForLoadState('networkidle');
    
    // Verificar se não há erros críticos
    expect(consoleErrors.length).toBeLessThan(5);
  });

  test('deve ter navegação responsiva', async ({ page }) => {
    await page.goto('/');
    
    // Testar viewport desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Testar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
  });

  test('deve carregar sem erros de JavaScript', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verificar se não há erros JavaScript fatais
    expect(errors.length).toBe(0);
  });
});
