/**
 * Formata um valor numérico ou string como moeda brasileira (BRL).
 * - "1234.5"      → "R$ 1.234,50"
 * - 99.99         → "R$ 99,99"
 * - "R$ 20"       → "R$ 20,00"
 * - "abc"         → "R$ 0,00"
 *
 * @param {number|string} valor - Valor a ser formatado.
 * @returns {string} - Valor no formato "R$ X.XXX,XX"
 */
export function formataValor(valor) {
  // Remove qualquer símbolo não numérico, exceto vírgula e ponto
  let numero =
    typeof valor === "string"
      ? Number(valor.replace(/[^0-9,.-]/g, "").replace(",", "."))
      : Number(valor);

  // Se for inválido, retorna zero formatado
  if (isNaN(numero) || !isFinite(numero)) {
    return "R$ 0,00";
  }

  // Formata para moeda brasileira
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
