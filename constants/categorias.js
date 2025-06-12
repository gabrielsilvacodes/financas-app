// constants/categorias.js

/**
 * Estrutura padrão de categorias para transações.
 * Cada categoria possui:
 *  - chave: identificador único
 *  - nome: label exibido na UI
 *  - cor: cor hexadecimal para exibição
 */
export const CATEGORIAS_PADRAO = {
  entrada: [
    { chave: "salario", nome: "Salário", cor: "#2D6A4F" },
    { chave: "presente", nome: "Presente", cor: "#38A3A5" },
    { chave: "venda", nome: "Venda", cor: "#80ED99" },
    { chave: "outros_entrada", nome: "Outros", cor: "#A0C4FF" }, // padrão singular para chave
  ],
  saida: [
    { chave: "alimentacao", nome: "Alimentação", cor: "#E76F51" },
    { chave: "transporte", nome: "Transporte", cor: "#F4A261" },
    { chave: "lazer", nome: "Lazer", cor: "#E5989B" },
    { chave: "educacao", nome: "Educação", cor: "#B5838D" },
    { chave: "saude", nome: "Saúde", cor: "#FFB4A2" },
    { chave: "outros_saida", nome: "Outros", cor: "#CDB4DB" }, // padrão singular para chave
  ],
};
