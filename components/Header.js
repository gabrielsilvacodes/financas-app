import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors"; // ✅ Importação centralizada

export default function Header({ titulo = "Título" }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Botão Menu (placeholder) */}
      <TouchableOpacity
        onPress={() => console.log("Menu aberto")}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
        hitSlop={8}
        style={styles.iconeWrapper}
      >
        <Ionicons name="menu" size={24} color={COLORS.branco} />
      </TouchableOpacity>

      {/* Título */}
      <Text
        style={styles.titulo}
        numberOfLines={1}
        ellipsizeMode="tail"
        accessibilityRole="header"
      >
        {titulo}
      </Text>

      {/* Botão Estatísticas */}
      <TouchableOpacity
        onPress={() => router.push("/estatisticas")}
        accessibilityRole="button"
        accessibilityLabel="Ver estatísticas"
        hitSlop={8}
        style={styles.iconeWrapper}
      >
        <Ionicons name="stats-chart" size={24} color={COLORS.branco} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.verde,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titulo: {
    color: COLORS.branco,
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  iconeWrapper: {
    padding: 4,
    minWidth: 32,
    alignItems: "center",
  },
});
