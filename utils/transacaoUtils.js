import uuid from "react-native-uuid";

/**
 * Verifica se todos os campos obrigatórios foram preenchidos.
 */
export function validarCampos({ valor, descricao, data }) {
  return valor && descricao && data;
}

/**
 * Converte o valor em string (ex: "R$ 12,50", "12,50", " 12.5 ") para número.
 */
export function parseValor(valorString) {
  if (!valorString) return 0;

  const limpo = valorString
    .replace(/\s/g, "") // remove espaços
    .replace("R$", "") // remove símbolo de real
    .replace(",", "."); // troca vírgula por ponto

  const valor = parseFloat(limpo);
  return isNaN(valor) ? 0 : valor;
}

/**
 * Verifica se a data está no formato DD/MM/AAAA.
 */
export function dataEhValida(dataString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dataString.trim());
}

/**
 * Converte a data de DD/MM/AAAA para AAAA-MM-DD.
 */
export function formatarDataParaISO(dataString) {
  return dataString.split("/").reverse().join("-");
}

/**
 * Converte data de AAAA-MM-DD para DD/MM/AAAA para exibição.
 */
export function formatarDataParaExibicao(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata o valor como string de moeda BR (ex: R$ 12,50).
 */
export function formatarValor(valor) {
  const numero = Number(valor);
  return isNaN(numero)
    ? "R$ 0,00"
    : `R$ ${numero.toFixed(2).replace(".", ",")}`;
}

/**
 * Cria uma transação normalizada e pronta para ser salva.
 */
export function criarTransacao({
  valor,
  descricao,
  data,
  tipo,
  categoria,
  idExistente = null,
}) {
  return {
    id: idExistente || uuid.v4(),
    titulo: descricao.trim(),
    valor: parseValor(valor),
    tipo,
    categoria,
    data: formatarDataParaISO(data),
  };
}
