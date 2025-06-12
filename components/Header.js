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
 * Cabeçalho global refinado com:
 * - Safe Area real
 * - Título centralizado com equilíbrio visual
 * - Ícones bem espaçados
 * - Padding proporcional e sombra leve
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
          label={mostrarVoltar ? "Voltar" : "Menu"}
          onPress={mostrarVoltar ? handleVoltar : handleAbrirMenu}
          corIcone={corIcone}
        />

        {/* Título centralizado */}
        <View pointerEvents="none" style={styles.tituloWrapper}>
          <Text
            style={[styles.titulo, { color: corTitulo }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {titulo}
          </Text>
        </View>

        {/* Ícone à direita */}
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

const HeaderIcon = memo(({ name, label, onPress, corIcone }) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    activeOpacity={0.7}
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    style={styles.touchArea}
  >
    <Ionicons name={name} size={26} color={corIcone} />
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  safe: {
    backgroundColor: COLORS.verde,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 60,
    paddingHorizontal: 16,
    paddingTop: Platform.select({
      ios: 12,
      android: (StatusBar.currentHeight ?? 20) * 0.2 + 10,
    }),
    paddingBottom: 10,
    zIndex: 10,
  },
  sombra: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
  },
  tituloWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.3,
    textAlign: "center",
    maxWidth: "90%",
  },
  touchArea: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
