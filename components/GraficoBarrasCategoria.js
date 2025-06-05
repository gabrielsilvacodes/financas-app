import { StyleSheet, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import COLORS from "../constants/colors";

/**
 * Gráfico de barras por categoria de despesa.
 * @param {Array} dados - Array com objetos { name, amount, color }
 */
export default function GraficoBarrasCategoria({ dados = [] }) {
  const { width } = useWindowDimensions();

  const labels = dados.map((item) => item.name);
  const valores = dados.map((item) => Number(item.amount));

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => COLORS.verdeEscuro,
    labelColor: () => COLORS.textoPrincipal,
    propsForBackgroundLines: {
      stroke: "#e5e5e5",
    },
    barPercentage: 0.6,
  };

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Gráfico de barras com categorias de despesa"
      accessibilityRole="image"
    >
      <BarChart
        data={{
          labels,
          datasets: [{ data: valores }],
        }}
        width={width - 48}
        height={Math.max(220, dados.length * 40)}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        style={styles.grafico}
        verticalLabelRotation={0}
        withHorizontalLabels
        withVerticalLabels
        flatColor
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: "center",
  },
  grafico: {
    borderRadius: 8,
  },
});
