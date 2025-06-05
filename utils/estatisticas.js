import { CATEGORIAS } from "../constants/categorias";
import COLORS from "../constants/colors";
import { parseValor } from "./transacaoUtils"; // para tratar corretamente valores

// 📊 Agrupa transações por mês (ex: "abril de 2025")
export function agruparPorMes(transacoes) {
  return transacoes.reduce((acc, item) => {
    const data = new Date(item.data);
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

// 📈 Gera os dados para o gráfico de linha (somente SAÍDAS por mês)
export function gerarResumoMensal(agrupado) {
  const mesesOrdenados = Object.keys(agrupado).sort((a, b) => {
    const dA = new Date("01 " + a);
    const dB = new Date("01 " + b);
    return dA - dB;
  });

  const labels = mesesOrdenados.map(
    (mes) => mes.split(" ")[0].slice(0, 3) // Ex: "abr", "mai"
  );

  const valores = mesesOrdenados.map((mes) =>
    agrupado[mes]
      .filter((item) => item.tipo?.toLowerCase() === "saida")
      .reduce((acc, item) => acc + parseValor(item.valor), 0)
  );

  return {
    labels,
    datasets: [{ data: valores }],
  };
}

// 🥧 Gera os dados para o gráfico de pizza (somente SAÍDAS do mês selecionado)
export function gerarPizzaMes(transacoes, mesSelecionado) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const dadosMes = transacoes.filter((item) => {
    const data = new Date(item.data);
    if (isNaN(data)) return false;
    return (
      formatter.format(data) === mesSelecionado &&
      item.tipo?.toLowerCase() === "saida"
    );
  });

  const somaPorCategoria = dadosMes.reduce((acc, item) => {
    const valor = parseValor(item.valor);
    if (isNaN(valor) || !item.categoria) return acc;

    acc[item.categoria] = (acc[item.categoria] || 0) + valor;
    return acc;
  }, {});

  return Object.entries(somaPorCategoria).map(([categoria, total]) => {
    const cor =
      CATEGORIAS.find((c) => c.nome === categoria)?.cor || COLORS.outros;

    return {
      name: categoria,
      amount: total,
      color: cor,
    };
  });
}
