import uuid from "react-native-uuid";

/**
 * Verifica se os campos obrigatórios estão preenchidos corretamente.
 * Aceita valor como número ou string, data como string ou objeto Date.
 * @param {Object} campos
 * @param {string|number} campos.valor
 * @param {string} campos.descricao
 * @param {string|Date} campos.data
 * @returns {boolean}
 */
export function validarCampos({ valor, descricao, data }) {
  const valorValido = valor?.toString().trim() !== "";
  const descricaoValida = descricao?.trim() !== "";
  // Aceita data como string ou Date
  const dataValida =
    (typeof data === "string" && data?.trim() !== "") || data instanceof Date;
  return valorValido && descricaoValida && dataValida;
}

/**
 * Converte uma string de valor monetário para número.
 * Ex: "R$ 12,50" → 12.5 | "12,50" → 12.5
 * @param {string|number} valorString
 * @returns {number}
 */
export function parseValor(valorString) {
  if (typeof valorString === "number") return valorString;
  if (!valorString) return 0;
  const limpo = valorString
    ?.replace(/\s/g, "")
    .replace("R$", "")
    .replace(",", ".");
  const valor = parseFloat(limpo);
  return isNaN(valor) ? 0 : valor;
}

/**
 * Verifica se uma data está no formato DD/MM/AAAA.
 * @param {string} dataString
 * @returns {boolean}
 */
export function dataEhValida(dataString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dataString?.trim());
}

/**
 * Converte data no formato DD/MM/AAAA para ISO (AAAA-MM-DD).
 * Se inválida, retorna string vazia.
 * @param {string} dataString
 * @returns {string}
 */
export function formatarDataParaISO(dataString) {
  if (!dataEhValida(dataString)) return "";
  const [dia, mes, ano] = dataString.trim().split("/");
  return `${ano}-${mes}-${dia}`;
}

/**
 * Converte data no formato ISO (AAAA-MM-DD) ou ISO DateTime para DD/MM/AAAA.
 * Se inválida, retorna string vazia.
 * @param {string} dataISO
 * @returns {string}
 */
export function formatarDataParaExibicao(dataISO) {
  if (!dataISO) return "";
  // Trata formato "2024-06-13" ou "2024-06-13T23:32:08.259Z"
  const iso = dataISO.split("T")[0];
  if (!iso.includes("-")) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Cria uma transação formatada e segura.
 * Sempre salva a data em formato ISO (AAAA-MM-DD).
 * @param {Object} dados
 * @param {string|number} dados.valor
 * @param {string} dados.descricao
 * @param {string|Date} dados.data - pode ser string (DD/MM/AAAA, ISO) ou objeto Date
 * @param {string} dados.tipo
 * @param {string} dados.categoria
 * @param {string|null} [idExistente]
 * @returns {Object} Transação formatada
 */
export function criarTransacao({
  valor,
  descricao,
  data,
  tipo,
  categoria,
  idExistente = null,
}) {
  let dataISO = "";

  if (data instanceof Date) {
    // Formato ISO puro (AAAA-MM-DD)
    dataISO = data.toISOString().split("T")[0];
  } else if (typeof data === "string") {
    // Se vier DD/MM/AAAA, converte para ISO
    if (dataEhValida(data)) {
      dataISO = formatarDataParaISO(data);
    } else if (data.includes("-")) {
      // Já está no formato ISO
      dataISO = data.split("T")[0];
    }
  }

  return {
    id: idExistente || uuid.v4(),
    titulo: descricao?.trim() || "",
    valor: parseValor(valor),
    tipo,
    categoria,
    data: dataISO,
  };
}
