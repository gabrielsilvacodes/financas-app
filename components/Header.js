import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
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
 * Header global reutilizável com título centralizado e botões nas laterais.
 */
export default function Header({
  titulo = "Título",
  mostrarVoltar = false,
  mostrarEstatisticas = true,
}) {
  const router = useRouter();

  const handleVoltar = () => router.back();
  const handleAbrirMenu = () => console.log("Menu aberto");
  const handleAbrirEstatisticas = () => router.push("/estatisticas");

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="header"
      accessibilityLabel={`Cabeçalho da página: ${titulo}`}
    >
      {/* Ícone à esquerda */}
      <HeaderIcon
        name={mostrarVoltar ? "arrow-back" : "menu"}
        label={mostrarVoltar ? "Voltar" : "Abrir menu"}
        onPress={mostrarVoltar ? handleVoltar : handleAbrirMenu}
      />

      {/* Título Centralizado */}
      <Text
        style={styles.titulo}
        numberOfLines={1}
        ellipsizeMode="tail"
        accessibilityRole="header"
        accessibilityLabel={titulo}
        importantForAccessibility="yes"
      >
        {titulo}
      </Text>

      {/* Ícone à direita */}
      {mostrarEstatisticas ? (
        <HeaderIcon
          name="stats-chart"
          label="Ir para estatísticas"
          onPress={handleAbrirEstatisticas}
        />
      ) : (
        <View style={styles.touchArea} />
      )}
    </View>
  );
}

/**
 * Ícone reutilizável do Header com foco em acessibilidade e feedback visual.
 */
const HeaderIcon = memo(({ name, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityLabel={label}
    accessibilityRole="button"
    accessibilityHint={`Botão: ${label}`}
    hitSlop={12}
    style={styles.touchArea}
  >
    <Ionicons name={name} size={24} color={COLORS.branco} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.verde,
    paddingTop: Platform.select({
      android: StatusBar.currentHeight + 8,
      ios: 48,
      default: 40,
    }),
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 64,
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
