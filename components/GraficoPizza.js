import { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import COLORS from "../constants/colors";

/**
 * Gráfico de pizza com distribuição de gastos por categoria.
 */
export default function GraficoPizza({
  dados = [],
  height = 220,
  backgroundColor = COLORS.neutroClaro || "#F5F5F5",
}) {
  const { width } = useWindowDimensions();
  // Garante boa visualização até em categorias numerosas
  const chartWidth = Math.max(width - 48, 240);

  const chartData = useMemo(() => {
    if (!Array.isArray(dados)) return [];
    return dados
      .map(({ name, population, amount, color }) => {
        // Suporte para amount OU population (backward compatibility)
        const value =
          typeof population !== "undefined"
            ? parseFloat(population)
            : parseFloat(amount);

        if (isNaN(value) || value <= 0) return null;

        return {
          name: name?.trim() || "Sem nome",
          population: value, // PIE CHART REQUER ESSA KEY!
          color: color || COLORS.categoria?.outros || COLORS.verde,
          legendFontColor: COLORS.textoPrincipal,
          legendFontSize: 14,
        };
      })
      .filter(Boolean);
  }, [dados]);

  const total = useMemo(
    () => chartData.reduce((acc, item) => acc + item.population, 0),
    [chartData]
  );

  // Estado vazio amigável
  if (chartData.length === 0 || total === 0) {
    return (
      <View style={styles.semDados}>
        <Text style={styles.msgSemDados}>Nenhum dado para exibir.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="grafico-pizza">
      <PieChart
        data={chartData}
        width={chartWidth}
        height={height}
        accessor="population"
        backgroundColor={backgroundColor}
        center={[0, 0]}
        chartConfig={{
          color: () => COLORS.textoPrincipal,
          propsForLabels: {
            fontWeight: "bold",
          },
        }}
        style={styles.chart}
        hasLegend={false} // Preferir legenda externa personalizada
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.neutroClaro || "#F5F5F5",
    borderRadius: 16,
    marginBottom: 16,
    minHeight: 220,
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  chart: {
    borderRadius: 14,
    minHeight: 200,
  },
  semDados: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  msgSemDados: {
    color: COLORS.cinzaTexto,
    fontSize: 15,
    textAlign: "center",
  },
});
