import uuid from "react-native-uuid";

/**
 * ✅ Valida se os campos obrigatórios estão preenchidos corretamente.
 * Aceita valor como número ou string, data como string ou Date.
 */
export function validarCampos({ valor, descricao, data }) {
  const valorValido = !!valor?.toString().trim();
  const descricaoValida = !!descricao?.trim();
  const dataValida =
    (typeof data === "string" && !!data.trim()) || data instanceof Date;

  return valorValido && descricaoValida && dataValida;
}

/**
 * 💰 Converte string monetária para número. Ex: "R$ 12,50" → 12.5
 */
export function parseValor(valorString) {
  if (typeof valorString === "number") return valorString;
  if (!valorString || typeof valorString !== "string") return 0;

  const limpo = valorString
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(",", ".");

  const valor = parseFloat(limpo);
  return isNaN(valor) ? 0 : valor;
}

/**
 * 📆 Valida se a data está no formato DD/MM/AAAA.
 */
export function dataEhValida(dataString) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dataString?.trim());
}

/**
 * 🔁 Converte data de DD/MM/AAAA para ISO (AAAA-MM-DD).
 */
export function formatarDataParaISO(dataString) {
  if (!dataEhValida(dataString)) return "";
  const [dia, mes, ano] = dataString.trim().split("/");
  return `${ano}-${mes}-${dia}`;
}

/**
 * 📅 Converte ISO DateTime para DD/MM/AAAA.
 */
export function formatarDataParaExibicao(dataISO) {
  if (!dataISO || typeof dataISO !== "string") return "";
  const [ano, mes, dia] = dataISO.split("T")[0]?.split("-") || [];
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : "";
}

/**
 * 🧱 Cria um objeto de transação padronizado para salvar no sistema.
 */
export function criarTransacao({
  valor,
  descricao,
  data,
  tipo = "saida",
  categoria = "outra",
  idExistente = null,
}) {
  let dataISO = "";

  if (data instanceof Date) {
    dataISO = data.toISOString().split("T")[0];
  } else if (typeof data === "string") {
    if (dataEhValida(data)) {
      dataISO = formatarDataParaISO(data);
    } else if (data.includes("-")) {
      // ISO ou formato compatível
      dataISO = data.split("T")[0];
    }
  }

  if (!dataISO) {
    console.warn("⚠️ Data inválida fornecida. Usando data atual.");
    dataISO = new Date().toISOString().split("T")[0];
  }

  return {
    id: idExistente || uuid.v4(),
    titulo: descricao?.trim() || "Sem descrição",
    valor: parseValor(valor),
    tipo,
    categoria,
    data: dataISO,
  };
}
