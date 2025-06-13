import { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

import COLORS from "../constants/colors";

/**
 * Gráfico de pizza com distribuição de valores por categoria.
 * Ideal para representar gastos ou entradas por tipo.
 */
export default function GraficoPizza({
  dados = [],
  height = 220,
  backgroundColor = COLORS.neutroClaro,
}) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(width - 48, 240);

  const chartData = useMemo(() => {
    if (!Array.isArray(dados)) return [];

    return dados
      .map(({ name, population, amount, valor, color }) => {
        const value = parseFloat(population ?? amount ?? valor);

        if (isNaN(value) || value <= 0) return null;

        return {
          name: name?.trim() || "Sem nome",
          population: value,
          color: color || COLORS.verde, // fallback robusto
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
        hasLegend={false}
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
    backgroundColor: COLORS.neutroClaro,
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
