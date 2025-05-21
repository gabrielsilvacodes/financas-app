import { StyleSheet, Text, View } from "react-native";

export default function LegendaPizza({ dados = [] }) {
  return (
    <View style={styles.legenda}>
      {dados.map((item, index) => (
        <View key={index} style={styles.legendaItem}>
          <View style={[styles.cor, { backgroundColor: item.color }]} />
          <Text style={styles.legendaTexto}>{item.name}</Text>
          <Text style={styles.valor}>R$ {item.amount.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  legenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    rowGap: 12,
  },
  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%", // ocupa duas colunas em grid
    marginBottom: 6,
  },
  cor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendaTexto: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  valor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1DB954",
  },
});
