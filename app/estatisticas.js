import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";

import BalanceteMensal from "../components/BalanceteMensal";
import GraficoBarrasCategoria from "../components/GraficoBarrasCategoria";
import GraficoPizza from "../components/GraficoPizza";
import Header from "../components/Header";
import LegendaPizza from "../components/LegendaPizza";

import COLORS from "../constants/colors";
import {
  agruparPorMes,
  gerarPizzaMes,
  gerarResumoMensal,
} from "../utils/estatisticas";
import { carregarDados } from "../utils/storage";

export default function Estatisticas() {
  const { width } = useWindowDimensions();

  const [open, setOpen] = useState(false);
  const [meses, setMeses] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [dadosLinha, setDadosLinha] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [dadosPizza, setDadosPizza] = useState([]);
  const [transacoesDoMes, setTransacoesDoMes] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState("pizza");

  // 🔁 Carrega e agrupa os dados por mês
  const carregarTransacoes = useCallback(async () => {
    const dados = await carregarDados();
    const agrupado = agruparPorMes(dados);

    const listaMeses = Object.keys(agrupado)
      .sort((a, b) => {
        const dA = new Date(`01 ${a}`);
        const dB = new Date(`01 ${b}`);
        return dB - dA;
      })
      .map((mes) => ({ label: mes, value: mes }));

    setMeses(listaMeses);

    if (listaMeses.length > 0) {
      const primeiroMes = listaMeses[0].value;
      setMesSelecionado(primeiroMes);
      setDadosLinha(gerarResumoMensal(agrupado));
    } else {
      setMesSelecionado("");
      setDadosLinha({ labels: [], datasets: [{ data: [] }] });
    }
  }, []);

  useEffect(() => {
    carregarTransacoes();
  }, [carregarTransacoes]);

  // 🔄 Atualiza os dados sempre que o mês selecionado muda
  useEffect(() => {
    async function atualizarDadosDoMes() {
      if (!mesSelecionado) return;

      const dados = await carregarDados();

      // Gráficos de categorias
      const pizza = gerarPizzaMes(dados, mesSelecionado);
      setDadosPizza(pizza);

      // Balancete (filtra transações do mês, considerando formato DD/MM/AAAA)
      const [mesLabel, anoLabel] = mesSelecionado.split(" de ");
      const doMes = dados.filter((item) => {
        const [dia, mes, ano] = item.data.split("/");
        const dataLabel = new Intl.DateTimeFormat("pt-BR", {
          month: "long",
          year: "numeric",
        }).format(new Date(`${ano}-${mes}-${dia}`));
        return dataLabel === mesSelecionado;
      });

      setTransacoesDoMes(doMes);
    }

    atualizarDadosDoMes();
  }, [mesSelecionado]);

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => COLORS.verde,
    labelColor: () => "#555",
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: COLORS.verde,
    },
  };

  return (
    <View style={styles.container}>
      <Header titulo="Estatísticas" mostrarVoltar />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: width < 360 ? 16 : 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Filtro de Mês */}
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={open}
            value={mesSelecionado}
            items={meses}
            setOpen={setOpen}
            setValue={setMesSelecionado}
            setItems={setMeses}
            placeholder="Selecione o mês"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            accessibilityLabel="Filtro de mês"
          />
        </View>

        {/* Balancete Mensal */}
        <Section title="Resumo do mês" label="Entradas, saídas e saldo">
          <BalanceteMensal transacoes={transacoesDoMes} />
        </Section>

        {/* Gráfico de Linha */}
        <Section
          title="Despesas mensais"
          label="Gráfico de linha de despesas mensais"
        >
          {dadosLinha.labels.length > 0 &&
          dadosLinha.datasets[0].data.length > 0 ? (
            <LineChart
              data={dadosLinha}
              width={width - 48}
              height={220}
              yAxisLabel="R$ "
              chartConfig={chartConfig}
              bezier
              style={styles.grafico}
              accessibilityLabel="Gráfico de linha"
              accessibilityRole="image"
            />
          ) : (
            <Text style={styles.semDados}>Sem dados suficientes.</Text>
          )}
        </Section>

        {/* Botões de alternância */}
        <View style={styles.toggle}>
          <Text
            onPress={() => setTipoGrafico("pizza")}
            style={[
              styles.toggleBtn,
              tipoGrafico === "pizza" && styles.toggleAtivo,
            ]}
          >
            Pizza
          </Text>
          <Text
            onPress={() => setTipoGrafico("barras")}
            style={[
              styles.toggleBtn,
              tipoGrafico === "barras" && styles.toggleAtivo,
            ]}
          >
            Barras
          </Text>
        </View>

        {/* Gráfico de Categorias */}
        <Section
          title={
            tipoGrafico === "pizza"
              ? "Categorias (gráfico de pizza)"
              : "Categorias (gráfico de barras)"
          }
          label="Distribuição por categoria"
        >
          {dadosPizza.length > 0 ? (
            tipoGrafico === "pizza" ? (
              <>
                <GraficoPizza dados={dadosPizza} />
                <LegendaPizza dados={dadosPizza} />
              </>
            ) : (
              <GraficoBarrasCategoria dados={dadosPizza} />
            )
          ) : (
            <Text style={styles.semDados}>Nenhuma despesa neste mês.</Text>
          )}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, label, children }) {
  return (
    <View
      style={styles.bloco}
      accessible
      accessibilityRole="header"
      accessibilityLabel={label}
    >
      <Text style={styles.subtitulo}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.branco,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  dropdownWrapper: {
    zIndex: 1000,
    marginBottom: 24,
  },
  dropdown: {
    borderColor: COLORS.borda,
    borderRadius: 6,
    minHeight: 48,
  },
  dropdownContainer: {
    borderColor: COLORS.borda,
    borderRadius: 6,
    marginTop: 4,
  },
  bloco: {
    marginBottom: 32,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    marginBottom: 12,
  },
  grafico: {
    borderRadius: 8,
    marginTop: 8,
  },
  semDados: {
    fontSize: 14,
    color: COLORS.cinzaTexto,
    textAlign: "center",
    marginTop: 12,
  },
  toggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  toggleBtn: {
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.borda,
    borderRadius: 6,
    marginHorizontal: 4,
    color: COLORS.cinzaTexto,
  },
  toggleAtivo: {
    backgroundColor: COLORS.verdeClaro,
    color: COLORS.verdeEscuro,
    fontWeight: "bold",
  },
});
