import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";

/**
 * Legenda visual associada ao gráfico de pizza,
 * mostrando a cor, categoria e valor de cada item.
 */
export default function LegendaPizza({ dados = [] }) {
  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="summary"
      accessibilityLabel="Legenda com as categorias e valores do gráfico de pizza"
    >
      {dados.map((item, index) => (
        <LegendaItem
          key={index}
          nome={item.name}
          cor={item.color}
          valor={item.amount}
        />
      ))}
    </View>
  );
}

/**
 * Item individual da legenda — cor + nome + valor.
 */
function LegendaItem({ nome, cor, valor }) {
  return (
    <View
      style={styles.item}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Categoria ${nome}, valor R$ ${valor.toFixed(2)}`}
    >
      <View style={[styles.bolinha, { backgroundColor: cor }]} />
      <Text style={styles.nome} numberOfLines={1} ellipsizeMode="tail">
        {nome}
      </Text>
      <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    minHeight: 48,
    paddingRight: 4,
  },
  bolinha: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  nome: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textoPrincipal,
  },
  valor: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.verde,
    textAlign: "right",
  },
});
