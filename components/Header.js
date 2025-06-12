import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../constants/colors";

/**
 * Cabeçalho global harmonioso para apps mobile:
 * - Respeita Safe Area
 * - Centralização real do título (visual e semântico)
 * - Ícones com área touch generosa
 * - Sombra e padding elegantes
 */
export default function Header({
  titulo = "Título",
  mostrarVoltar = false,
  mostrarEstatisticas = true,
  iconeDireita = "stats-chart",
  onPressDireita = null,
  corFundo = COLORS.verde,
  corIcone = COLORS.branco,
  corTitulo = COLORS.branco,
  sombra = true,
}) {
  const router = useRouter();

  // Funções de ação
  const handleVoltar = () => router.back();
  const handleAbrirMenu = () => console.log("📂 Menu solicitado");
  const handleAbrirEstatisticas = () => router.push("/estatisticas");
  const acaoDireita = onPressDireita || handleAbrirEstatisticas;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: corFundo }]}>
      <View
        style={[
          styles.container,
          { backgroundColor: corFundo },
          sombra && styles.sombra,
        ]}
        accessible
        accessibilityRole="header"
        accessibilityLabel={`Cabeçalho da tela: ${titulo}`}
        testID="header"
      >
        {/* Ícone à esquerda */}
        <HeaderIcon
          name={mostrarVoltar ? "arrow-back" : "menu"}
          label={mostrarVoltar ? "Voltar para a tela anterior" : "Abrir menu"}
          onPress={mostrarVoltar ? handleVoltar : handleAbrirMenu}
          corIcone={corIcone}
        />

        {/* Título centralizado */}
        <View pointerEvents="none" style={styles.tituloWrapper}>
          <Text
            style={[styles.titulo, { color: corTitulo }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityRole="text"
            accessibilityLabel={`Título: ${titulo}`}
          >
            {titulo}
          </Text>
        </View>

        {/* Ícone à direita ou espaço vazio */}
        {mostrarEstatisticas ? (
          <HeaderIcon
            name={iconeDireita}
            label="Ir para estatísticas"
            onPress={acaoDireita}
            corIcone={corIcone}
          />
        ) : (
          <View style={styles.touchArea} />
        )}
      </View>
    </SafeAreaView>
  );
}

const HeaderIcon = memo(
  ({ name, label, onPress, corIcone = COLORS.branco }) => (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityHint={label}
      accessibilityRole="button"
      activeOpacity={0.7}
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      style={styles.touchArea}
    >
      <Ionicons name={name} size={26} color={corIcone} />
    </TouchableOpacity>
  )
);

const styles = StyleSheet.create({
  safe: {
    // Garante que o Header respeita a barra de status (notch/topo)
    // Pode customizar para fundo claro/escuro
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 62,
    paddingHorizontal: 18,
    paddingBottom: 8,
    paddingTop: Platform.select({
      android: (StatusBar.currentHeight ?? 20) * 0.3 + 12,
      ios: 10,
      default: 12,
    }),
    zIndex: 10,
  },
  sombra: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 5,
  },
  tituloWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  titulo: {
    fontSize: 21,
    fontWeight: "bold",
    letterSpacing: 0.2,
    textAlign: "center",
    maxWidth: "90%",
  },
  touchArea: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
