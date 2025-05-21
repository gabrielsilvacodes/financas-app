import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors"; // ✅ Importação centralizada

export default function GastoItem({ data, nome, valor }) {
  return (
    <View style={styles.item} accessible accessibilityRole="text">
      <View style={styles.info}>
        <Text style={styles.data}>{data}</Text>
        <Text style={styles.nome} numberOfLines={1} ellipsizeMode="tail">
          {nome}
        </Text>
      </View>

      <Text style={styles.valor}>R$ {(valor || 0).toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLORS.cinzaClaro,
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  data: {
    color: COLORS.cinzaTexto,
    fontSize: 12,
    marginBottom: 4,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.verde,
    textAlign: "right",
    minWidth: 90,
  },
});
