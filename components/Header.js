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
 * Header global reutilizável com título centralizado e ícones laterais.
 * Suporta botão de voltar, menu ou estatísticas.
 */
export default function Header({
  titulo = "Título",
  mostrarVoltar = false,
  mostrarEstatisticas = true,
  iconeDireita = "stats-chart",
  onPressDireita = null,
}) {
  const router = useRouter();

  const handleVoltar = () => router.back();
  const handleAbrirMenu = () => console.log("Menu aberto");
  const handleAbrirEstatisticas = () => router.push("/estatisticas");

  const acaoDireita = onPressDireita || handleAbrirEstatisticas;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="header"
      accessibilityLabel={`Cabeçalho da página ${titulo}`}
    >
      {/* Ícone à esquerda */}
      <HeaderIcon
        name={mostrarVoltar ? "arrow-back" : "menu"}
        label={mostrarVoltar ? "Voltar" : "Abrir menu"}
        onPress={mostrarVoltar ? handleVoltar : handleAbrirMenu}
      />

      {/* Título */}
      <Text
        style={styles.titulo}
        numberOfLines={1}
        ellipsizeMode="tail"
        accessibilityRole="header"
        accessibilityLabel={titulo}
      >
        {titulo}
      </Text>

      {/* Ícone à direita */}
      {mostrarEstatisticas ? (
        <HeaderIcon
          name={iconeDireita}
          label="Ir para estatísticas"
          onPress={acaoDireita}
        />
      ) : (
        <View style={styles.touchArea} />
      )}
    </View>
  );
}

/**
 * Ícone reutilizável do Header com foco em acessibilidade.
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
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 8 : 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
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
