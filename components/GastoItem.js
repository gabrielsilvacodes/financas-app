import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";

/**
 * Exibe um item de gasto individual com valor, nome e data.
 */
export default function GastoItem({ data, nome, valor }) {
  const valorFormatado = `R$ ${(valor || 0).toFixed(2)}`;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Gasto de ${valorFormatado} em ${nome}, na data ${data}`}
    >
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1} ellipsizeMode="tail">
          {nome}
        </Text>
        <Text style={styles.data}>{data}</Text>
      </View>

      <Text style={styles.valor}>{valorFormatado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cinzaClaro,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 16,
    minHeight: 60, // 🔍 ligeiramente maior para acessibilidade
    marginBottom: 12,
  },
  info: {
    flex: 1,
    paddingRight: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    marginBottom: 2,
    flexShrink: 1,
  },
  data: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.verde,
    textAlign: "right",
    minWidth: 90,
  },
});
