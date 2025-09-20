import { FullConfig } from '@playwright/test';

/**
 * Global teardown para testes E2E
 * Limpa dados de teste e recursos
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Limpeza global dos testes E2E concluída');
  
  // Aqui podemos adicionar limpeza de:
  // - Dados de teste no banco
  // - Arquivos temporários
  // - Cache do browser
  // - Logs de teste
}

export default globalTeardown;
