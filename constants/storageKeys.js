// constants/storageKeys.js

/**
 * Chaves únicas para armazenamento no AsyncStorage.
 * O prefixo @financasApp_ garante que não haja conflito com outros apps.
 */
const STORAGE_KEYS = {
  TRANSACOES: "@financasApp_transacoes", // Lista de transações do usuário
  CATEGORIAS: "@financasApp_categorias", // Categorias personalizadas/criadas
  // Adicione futuras chaves aqui mantendo o mesmo padrão!
};

export const { TRANSACOES, CATEGORIAS } = STORAGE_KEYS; // Exporta também individualmente (opcional)
export default STORAGE_KEYS;
