import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup para testes E2E
 * Configura dados de teste e autenticação
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // Iniciar browser para setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navegar para a aplicação
    await page.goto(baseURL!);
    
    // Aguardar carregamento inicial
    await page.waitForLoadState('networkidle');
    
    // Verificar se a aplicação está funcionando
    await page.waitForSelector('body', { timeout: 10000 });
    
    console.log('✅ Aplicação carregada com sucesso para testes E2E');
    
  } catch (error) {
    console.error('❌ Erro no setup global:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
