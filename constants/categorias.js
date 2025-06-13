// constants/categorias.js

/**
 * Categorias padrão para transações financeiras.
 * Estrutura compatível com componentes como DropDownPicker.
 *
 * Cada categoria possui:
 *  - label: Nome visível na interface
 *  - value: Identificador único usado internamente
 *  - cor: Cor para destaque visual (hexadecimal)
 */

export const CATEGORIAS_PADRAO = {
  entrada: [
    { label: "Salário", value: "salario", cor: "#2D6A4F" },
    { label: "Presente", value: "presente", cor: "#38A3A5" },
    { label: "Venda", value: "venda", cor: "#80ED99" },
    { label: "Outros", value: "outros_entrada", cor: "#A0C4FF" },
  ],
  saida: [
    { label: "Alimentação", value: "alimentacao", cor: "#E76F51" },
    { label: "Transporte", value: "transporte", cor: "#F4A261" },
    { label: "Lazer", value: "lazer", cor: "#E5989B" },
    { label: "Educação", value: "educacao", cor: "#B5838D" },
    { label: "Saúde", value: "saude", cor: "#FFB4A2" },
    { label: "Outros", value: "outros_saida", cor: "#CDB4DB" },
  ],
};
