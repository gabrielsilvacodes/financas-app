import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import COLORS from "../constants/colors";

/**
 * Gráfico de barras exibindo os totais por categoria.
 */
export default function GraficoBarrasCategoria({ dados = [] }) {
  const { width } = useWindowDimensions();

  // Permite scroll horizontal se houver muitas categorias
  const chartWidth = Math.max(width - 48, dados.length * 82);

  // Padroniza labels (máximo de 16 caracteres)
  const labels = useMemo(
    () =>
      dados.map((item) =>
        typeof item?.name === "string"
          ? item.name.trim().length > 16
            ? item.name.slice(0, 15) + "…"
            : item.name.trim()
          : "Sem nome"
      ),
    [dados]
  );

  // Campo amount padrão
  const valores = useMemo(
    () =>
      dados.map((item) => {
        const val = Number(item?.amount ?? 0);
        return isNaN(val) || val < 0 ? 0 : val;
      }),
    [dados]
  );

  // Cor de cada barra (fallback para verde padrão)
  const cores = useMemo(
    () => dados.map((item) => item?.color || COLORS.verde),
    [dados]
  );

  // Configuração do gráfico
  const chartConfig = useMemo(
    () => ({
      backgroundColor: COLORS.branco,
      backgroundGradientFrom: COLORS.branco,
      backgroundGradientTo: COLORS.branco,
      decimalPlaces: 0,
      color: (_, index) => cores[index % cores.length],
      labelColor: () => COLORS.textoPrincipal,
      propsForBackgroundLines: {
        stroke: COLORS.borda,
        strokeDasharray: "2",
      },
      propsForLabels: {
        fontSize: 12,
      },
      barPercentage: 0.52,
    }),
    [cores]
  );

  const dadosInexistentes =
    labels.length === 0 || valores.every((v) => v === 0);

  if (dadosInexistentes) {
    return (
      <View style={styles.semDados}>
        <Text style={styles.msgSemDados}>
          Nenhum dado para exibir no gráfico de barras.
        </Text>
      </View>
    );
  }

  // Altura adaptativa para quantidade de barras
  const chartHeight = Math.max(220, Math.min(dados.length * 44, 420));
  const rotateLabels = labels.length > 5;

  return (
    <ScrollView
      horizontal={chartWidth > width}
      contentContainerStyle={styles.scrollContainer}
      showsHorizontalScrollIndicator={false}
      accessibilityRole="scrollbar"
      accessibilityLabel="Rolagem horizontal do gráfico de barras"
    >
      <View
        style={styles.container}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Gráfico de barras, cada barra representa o total por categoria"
        accessibilityHint="Use rolagem lateral caso existam muitas categorias"
        testID="grafico-barras-categoria"
      >
        <BarChart
          data={{
            labels,
            datasets: [{ data: valores }],
          }}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          verticalLabelRotation={rotateLabels ? 40 : 0}
          withHorizontalLabels
          withVerticalLabels
          flatColor
          style={styles.grafico}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 8,
    minHeight: 230,
  },
  container: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
    backgroundColor: COLORS.neutroClaro || "#F5F5F5",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  grafico: {
    borderRadius: 12,
    minHeight: 220,
  },
  semDados: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  msgSemDados: {
    color: COLORS.cinzaTexto,
    fontSize: 15,
    textAlign: "center",
  },
});
