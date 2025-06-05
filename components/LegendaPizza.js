import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";

/**
 * Legenda visual associada ao gráfico de pizza,
 * mostrando a cor, categoria e valor de cada item.
 */
export default function LegendaPizza({ dados = [] }) {
  if (!dados.length) return null;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="summary"
      accessibilityLabel="Legenda com categorias e valores do gráfico de pizza"
    >
      {dados.map((item) => (
        <LegendaItem
          key={item.name}
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
  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor || 0);

  return (
    <View
      style={styles.item}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Categoria ${nome}, valor de ${valorFormatado}`}
    >
      <View
        style={[styles.bolinha, { backgroundColor: cor || COLORS.outros }]}
      />
      <Text style={styles.nome} numberOfLines={1} ellipsizeMode="tail">
        {nome || "Sem categoria"}
      </Text>
      <Text style={styles.valor}>{valorFormatado}</Text>
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
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.fundoClaro || "#f8f8f8",
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
    marginLeft: 8,
  },
});
