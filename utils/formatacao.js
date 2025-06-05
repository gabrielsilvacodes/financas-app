export function formataValor(valor) {
  return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
}
