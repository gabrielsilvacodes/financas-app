/**
 * Filtra uma lista de transações com base no período fornecido.
 * @param {Array} transacoes - Lista de transações no formato { data: string }.
 * @param {"7dias"|"30dias"|"mes"|"ano"} periodo
 * @returns {Array} Transações dentro do período selecionado.
 */
export function filtrarPorPeriodo(transacoes = [], periodo = "30dias") {
  const hoje = zerarHora(new Date());

  return transacoes.filter((t) => {
    const data = toDateSafe(t?.data);
    if (!data) return false;

    switch (periodo) {
      case "7dias":
        return data >= subtrairDias(hoje, 7);
      case "30dias":
        return data >= subtrairDias(hoje, 30);
      case "mes":
        return (
          data.getMonth() === hoje.getMonth() &&
          data.getFullYear() === hoje.getFullYear()
        );
      case "ano":
        return data.getFullYear() === hoje.getFullYear();
      default:
        return true;
    }
  });
}

/**
 * Filtra transações que pertencem ao mês e ano específicos (ex: "junho de 2025").
 * @param {Array} transacoes
 * @param {string} mesAnoSelecionado - Formato "nome do mês de ano", ex: "junho de 2025".
 * @returns {Array}
 */
export function filtrarPorMesAno(transacoes = [], mesAnoSelecionado = "") {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const ref = mesAnoSelecionado.toLowerCase().trim();

  return transacoes.filter((t) => {
    const data = toDateSafe(t?.data);
    if (!data) return false;
    return formatter.format(data).toLowerCase().trim() === ref;
  });
}

/**
 * Subtrai um número de dias de uma data (retorna data no horário 00:00:00).
 * @param {Date} data
 * @param {number} dias
 * @returns {Date}
 */
function subtrairDias(data, dias) {
  const novaData = new Date(data);
  novaData.setDate(data.getDate() - dias);
  return zerarHora(novaData);
}

/**
 * Converte string ISO/data para Date e retorna null se inválida.
 * @param {string|Date} dt
 * @returns {Date|null}
 */
function toDateSafe(dt) {
  if (dt instanceof Date && !isNaN(dt)) return zerarHora(dt);
  if (typeof dt === "string") {
    // ISO (AAAA-MM-DD), ou ISO completo
    const parsed = Date.parse(dt);
    if (!isNaN(parsed)) return zerarHora(new Date(parsed));
    // Se vier DD/MM/AAAA
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dt.trim())) {
      const [dia, mes, ano] = dt.trim().split("/");
      return zerarHora(new Date(`${ano}-${mes}-${dia}`));
    }
  }
  return null;
}

/**
 * Zera o horário de uma data (mantém só o dia).
 * @param {Date} dt
 * @returns {Date}
 */
function zerarHora(dt) {
  const d = new Date(dt);
  d.setHours(0, 0, 0, 0);
  return d;
}
