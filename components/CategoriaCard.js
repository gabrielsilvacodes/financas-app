import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors"; // ✅ Importação centralizada

export default function CategoriaCard({
  nome = "",
  cor = COLORS.borda,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Categoria ${nome}`}
    >
      <View style={styles.esquerda}>
        <View style={[styles.bolinha, { backgroundColor: cor }]} />
        <Text style={styles.texto}>{nome}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.cinzaTexto} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: COLORS.branco,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borda,
  },
  esquerda: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  texto: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textoPrincipal,
  },
});
