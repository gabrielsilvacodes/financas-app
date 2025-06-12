import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";

import BalanceteMensal from "../components/BalanceteMensal";
import EmptyState from "../components/EmptyState";
import GraficoBarrasCategoria from "../components/GraficoBarrasCategoria";
import GraficoPizza from "../components/GraficoPizza";
import Header from "../components/Header";
import LegendaPizza from "../components/LegendaPizza";

import COLORS from "../constants/colors";
import {
  agruparPorMes,
  gerarBarrasPorPeriodo,
  gerarPizzaMes,
  gerarResumoMensal,
} from "../utils/estatisticas";
import { filtrarPorMesAno } from "../utils/filtros";
import { carregarDados } from "../utils/storage";

export default function Estatisticas() {
  const { width } = useWindowDimensions();

  const [open, setOpen] = useState(false);
  const [meses, setMeses] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState("");
  const [transacoesDoMes, setTransacoesDoMes] = useState([]);
  const [dadosLinha, setDadosLinha] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [dadosPizza, setDadosPizza] = useState([]);
  const [dadosBarras, setDadosBarras] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState("pizza");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("30dias");
  const [carregando, setCarregando] = useState(true);

  const periodos = [
    { label: "7 dias", value: "7dias" },
    { label: "30 dias", value: "30dias" },
    { label: "1 ano", value: "ano" },
  ];

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => COLORS.verde,
    labelColor: () => COLORS.textoPrincipal,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: COLORS.verde,
    },
  };

  const carregarTransacoes = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await carregarDados();
      const agrupado = agruparPorMes(dados);
      const listaMeses = Object.keys(agrupado)
        .sort((a, b) => new Date(`01 ${b}`) - new Date(`01 ${a}`))
        .map((mes) => ({ label: mes, value: mes }));

      setMeses(listaMeses);
      if (listaMeses.length > 0) {
        setMesSelecionado((prev) => prev || listaMeses[0].value);
      } else {
        setMesSelecionado("");
      }
      setDadosLinha(gerarResumoMensal(agrupado));
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados das transações.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarTransacoes();
  }, [carregarTransacoes]);

  useEffect(() => {
    async function atualizarDados() {
      if (!mesSelecionado.includes(" de ")) return;
      setCarregando(true);
      try {
        const dados = await carregarDados();
        const filtradas = filtrarPorMesAno(dados, mesSelecionado);

        setTransacoesDoMes(filtradas);
        setDadosPizza(gerarPizzaMes(dados, mesSelecionado));
        setDadosBarras(gerarBarrasPorPeriodo(dados, periodoSelecionado));
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        Alert.alert("Erro", "Erro ao atualizar os gráficos do mês.");
      } finally {
        setCarregando(false);
      }
    }

    if (mesSelecionado) atualizarDados();
  }, [mesSelecionado, periodoSelecionado]);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.verdeEscuro || COLORS.verde}
        />
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header titulo="Estatísticas" mostrarVoltar />
      <ScrollView
        contentContainerStyle={{
          padding: 0,
          paddingBottom: 40,
          paddingTop: Platform.select({ ios: 24, android: 16 }),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dropdown Mês */}
        <View style={styles.section}>
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
            zIndex={1000}
          />
        </View>

        {/* Resumo Mensal */}
        <Section title="Resumo do mês" label="Entradas, saídas e saldo">
          <View style={styles.card}>
            <BalanceteMensal transacoes={transacoesDoMes} />
          </View>
        </Section>

        {/* Gráfico de Linha */}
        <Section title="Despesas mensais" label="Evolução dos gastos mês a mês">
          <View style={[styles.card, { alignItems: "center" }]}>
            {dadosLinha.labels.length > 0 ? (
              <LineChart
                data={dadosLinha}
                width={Math.min(width - 48, 400)}
                height={220}
                yAxisLabel="R$ "
                chartConfig={chartConfig}
                bezier
                style={styles.grafico}
                testID="grafico-linha"
              />
            ) : (
              <EmptyState
                titulo="Sem dados mensais"
                descricao="Adicione transações para acompanhar seus gastos ao longo dos meses."
                icone="trending-down-outline"
              />
            )}
          </View>
        </Section>

        {/* Período e Toggle tipo gráfico */}
        <View style={styles.filtros}>
          <View style={styles.toggleRow}>
            {periodos.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => setPeriodoSelecionado(item.value)}
                style={[
                  styles.toggleBtn,
                  periodoSelecionado === item.value && styles.toggleAtivo,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Filtrar por ${item.label}`}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    periodoSelecionado === item.value && styles.toggleAtivoText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.toggleRow}>
            {["pizza", "barras"].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                onPress={() => setTipoGrafico(tipo)}
                style={[
                  styles.toggleBtn,
                  tipoGrafico === tipo && styles.toggleAtivo,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Alternar para gráfico de ${tipo}`}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    tipoGrafico === tipo && styles.toggleAtivoText,
                  ]}
                >
                  {tipo === "pizza" ? "Pizza" : "Barras"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gráfico Pizza ou Barras */}
        <Section
          title={`Categorias (${tipoGrafico === "pizza" ? "Pizza" : "Barras"})`}
          label="Distribuição por categoria"
        >
          <View style={[styles.card, { alignItems: "center" }]}>
            {(tipoGrafico === "pizza" ? dadosPizza : dadosBarras).length > 0 ? (
              tipoGrafico === "pizza" ? (
                <>
                  <GraficoPizza dados={dadosPizza} />
                  <LegendaPizza dados={dadosPizza} />
                </>
              ) : (
                <GraficoBarrasCategoria dados={dadosBarras} />
              )
            ) : (
              <EmptyState
                titulo="Sem categorias"
                descricao="Adicione despesas para ver as categorias no gráfico."
                icone="pie-chart-outline"
              />
            )}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, label, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.subtitulo}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.neutroClaro || "#F5F5F5" },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.neutroClaro || "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    color: COLORS.cinzaTexto,
    marginTop: 12,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: COLORS.branco,
    borderRadius: 14,
    padding: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    alignItems: "center",
    width: "100%",
  },
  dropdown: { borderColor: COLORS.borda, borderRadius: 6, minHeight: 48 },
  dropdownContainer: {
    borderColor: COLORS.borda,
    borderRadius: 6,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 18,
    width: "100%",
  },
  subtitulo: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    marginBottom: 12,
    letterSpacing: 0.1,
    textAlign: "left",
  },
  grafico: { borderRadius: 12, marginTop: 8, marginBottom: 16 },
  filtros: {
    marginBottom: 18,
    paddingHorizontal: 18,
    width: "100%",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 8,
    flexWrap: "wrap",
  },
  toggleBtn: {
    backgroundColor: COLORS.branco,
    borderWidth: 1,
    borderColor: COLORS.borda,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 2,
    minWidth: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleAtivo: {
    backgroundColor: COLORS.verdeClaro || "#E6F4EA",
    borderColor: COLORS.verdeEscuro || "#2D6A4F",
  },
  toggleBtnText: {
    fontSize: 15,
    color: COLORS.cinzaTexto,
    fontWeight: "500",
    textAlign: "center",
  },
  toggleAtivoText: {
    color: COLORS.verdeEscuro || "#2D6A4F",
    fontWeight: "bold",
  },
});
