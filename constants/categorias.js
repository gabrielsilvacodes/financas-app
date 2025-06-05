import COLORS from "./colors";

/**
 * Lista de categorias disponíveis para transações.
 * Cada item contém:
 * - id: identificador único (string)
 * - nome: rótulo exibido ao usuário
 * - chave: versão normalizada usada para buscas internas
 * - cor: cor associada à categoria (para gráficos)
 */
export const CATEGORIAS = [
  {
    id: "1",
    nome: "Alimentação",
    chave: "alimentacao",
    cor: COLORS.alerta,
  },
  {
    id: "2",
    nome: "Transporte",
    chave: "transporte",
    cor: COLORS.transporte,
  },
  {
    id: "3",
    nome: "Lazer",
    chave: "lazer",
    cor: COLORS.lazer,
  },
  {
    id: "4",
    nome: "Outros",
    chave: "outros",
    cor: COLORS.outros,
  },
];
