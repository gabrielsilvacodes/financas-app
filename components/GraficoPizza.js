import { Dimensions, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default function GraficoPizza({ dados = [], height = 200 }) {
  const screenWidth = Dimensions.get("window").width - 48;

  return (
    <View style={styles.container}>
      <PieChart
        data={dados.map((item) => ({
          name: item.name,
          amount: item.amount,
          color: item.color,
          legendFontColor: "#333",
          legendFontSize: 14,
        }))}
        width={screenWidth}
        height={height}
        chartConfig={{
          color: () => "#000",
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="20"
        center={[10, 0]}
        hasLegend={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
});
