import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import COLORS from "../constants/colors";

/**
 * Componente de gráfico de pizza que representa a distribuição dos gastos por categoria.
 */
const GraficoPizza = ({
  dados = [],
  height = 200,
  backgroundColor = "transparent",
}) => {
  const screenWidth = Dimensions.get("window").width - 48;

  // ✅ Constrói os dados do gráfico somente quando "dados" mudar
  const chartData = useMemo(() => {
    return dados.map((item) => ({
      name: item.name,
      amount: Number(item.amount),
      color: item.color || COLORS.outros,
      legendFontColor: COLORS.cinzaTexto,
      legendFontSize: 14,
    }));
  }, [dados]);

  // ✅ Verificação para evitar erro em gráfico vazio
  if (chartData.length === 0) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Gráfico de pizza com a distribuição dos gastos por categoria"
    >
      <PieChart
        data={chartData}
        width={screenWidth}
        height={height}
        accessor="amount"
        backgroundColor={backgroundColor}
        paddingLeft="20"
        center={[0, 0]}
        hasLegend={false}
        chartConfig={{
          color: () => COLORS.textoPrincipal,
        }}
      />
    </View>
  );
};

export default GraficoPizza;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
    minHeight: 220,
  },
});
