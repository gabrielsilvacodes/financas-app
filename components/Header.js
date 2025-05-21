import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../constants/colors";

/**
 * Header global com título centralizado e ícones nas laterais.
 */
export default function Header({ titulo = "Título" }) {
  const router = useRouter();

  return (
    <View style={styles.container} accessible accessibilityRole="header">
      {/* Botão de Menu (placeholder funcional) */}
      <HeaderIcon
        name="menu"
        label="Abrir menu lateral"
        onPress={() => console.log("Menu aberto")}
      />

      {/* Título Centralizado */}
      <Text style={styles.titulo} numberOfLines={1} ellipsizeMode="tail">
        {titulo}
      </Text>

      {/* Botão de Estatísticas */}
      <HeaderIcon
        name="stats-chart"
        label="Ir para estatísticas"
        onPress={() => router.push("/estatisticas")}
      />
    </View>
  );
}

/**
 * Subcomponente reutilizável de ícone de ação.
 */
function HeaderIcon({ name, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={12}
      style={styles.touchArea}
    >
      <Ionicons name={name} size={24} color={COLORS.branco} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.verde,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 48 : 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titulo: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.branco,
  },
  touchArea: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});
