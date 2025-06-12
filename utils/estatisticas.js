import { CATEGORIAS_PADRAO } from "../constants/categorias";
import COLORS from "../constants/colors";
import { parseValor } from "./transacaoUtils";

/**
 * Soma os valores das transações de um tipo específico.
 */
export function somarValores(transacoes = [], tipo = "entrada") {
  return transacoes
    .filter((t) => t?.tipo?.toLowerCase() === tipo)
    .reduce((total, t) => total + parseValor(t.valor), 0);
}

/**
 * Gera os dados para o gráfico de pizza de SAÍDAS por categoria (PieChart).
 */
export function gerarDadosPizza(transacoes = [], categorias = []) {
  if (!Array.isArray(transacoes) || !Array.isArray(categorias)) return [];

  return categorias
    .map((cat) => {
      const chave = (cat?.chave || "").trim().toLowerCase();
      if (!chave) return null;

      const total = transacoes
        .filter(
          (t) =>
            t?.tipo?.toLowerCase() === "saida" &&
            (t?.categoria?.chave || "").trim().toLowerCase() === chave
        )
        .reduce((acc, t) => acc + parseValor(t.valor), 0);

      return {
        name: cat.nome || chave,
        population: total,
        color: cat.cor || COLORS?.categoria?.outros || COLORS.verde,
      };
    })
    .filter((item) => item && item.population > 0);
}

/**
 * Agrupa transações por mês (ex: "abril de 2025").
 */
export function agruparPorMes(transacoes = []) {
  return transacoes.reduce((acc, item) => {
    const data = new Date(item?.data);
    if (isNaN(data)) return acc;
    const mesAno = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(data);
    if (!acc[mesAno]) acc[mesAno] = [];
    acc[mesAno].push(item);
    return acc;
  }, {});
}

/**
 * Gera dados para gráfico de linha de SAÍDAS mensais.
 */
export function gerarResumoMensal(transacoesAgrupadas = {}) {
  const mesesOrdenados = Object.keys(transacoesAgrupadas).sort((a, b) => {
    const dA = new Date("01 " + a);
    const dB = new Date("01 " + b);
    return dA - dB;
  });

  const labels = mesesOrdenados.map((mes) =>
    new Date("01 " + mes)
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "")
      .replace(/^./, (c) => c.toUpperCase())
  );

  const dados = mesesOrdenados.map((mes) =>
    transacoesAgrupadas[mes]
      .filter((t) => t?.tipo?.toLowerCase() === "saida")
      .reduce((acc, t) => acc + parseValor(t.valor), 0)
  );

  return {
    labels,
    datasets: [{ data: dados }],
  };
}

/**
 * Gera dados para gráfico de pizza de SAÍDAS de um mês específico.
 */
export function gerarPizzaMes(transacoes = [], mesSelecionado = "") {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const saidasDoMes = transacoes.filter((t) => {
    const data = new Date(t?.data);
    return (
      !isNaN(data) &&
      formatter.format(data) === mesSelecionado &&
      t?.tipo?.toLowerCase() === "saida"
    );
  });

  const somaPorCategoria = saidasDoMes.reduce((acc, t) => {
    const valor = parseValor(t.valor);
    const chave = t?.categoria?.chave?.trim().toLowerCase();
    if (!chave || isNaN(valor)) return acc;
    acc[chave] = (acc[chave] || 0) + valor;
    return acc;
  }, {});

  return Object.entries(somaPorCategoria).map(([chave, total]) => {
    const cat = CATEGORIAS_PADRAO.saida.find(
      (c) => c.chave.trim().toLowerCase() === chave
    );
    return {
      name: cat?.nome || chave,
      population: total,
      color: cat?.cor || COLORS.categoria?.outros || COLORS.verde,
    };
  });
}

/**
 * Gera dados para gráfico de barras com SAÍDAS por categoria em um período.
 */
export function gerarBarrasPorPeriodo(transacoes = [], periodo = "30dias") {
  const hoje = new Date();
  let dataLimite = new Date(hoje);

  switch (periodo) {
    case "7dias":
      dataLimite.setDate(hoje.getDate() - 7);
      break;
    case "30dias":
      dataLimite.setDate(hoje.getDate() - 30);
      break;
    case "ano":
      dataLimite.setFullYear(hoje.getFullYear() - 1);
      break;
  }

  const saidas = transacoes.filter((t) => {
    const data = new Date(t?.data);
    return (
      !isNaN(data) && data >= dataLimite && t?.tipo?.toLowerCase() === "saida"
    );
  });

  const somaPorCategoria = saidas.reduce((acc, t) => {
    const valor = parseValor(t.valor);
    const chave = t?.categoria?.chave?.trim().toLowerCase();
    if (!chave || isNaN(valor)) return acc;
    acc[chave] = (acc[chave] || 0) + valor;
    return acc;
  }, {});

  return Object.entries(somaPorCategoria).map(([chave, total]) => {
    const cat = CATEGORIAS_PADRAO.saida.find(
      (c) => c.chave.trim().toLowerCase() === chave
    );
    return {
      name: cat?.nome || chave,
      amount: total,
      color: cat?.cor || COLORS.categoria?.outros || COLORS.verde,
    };
  });
}
