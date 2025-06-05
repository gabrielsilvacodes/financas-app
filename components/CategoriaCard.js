import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors";

/**
 * Componente visual de cartão de categoria com:
 * - Indicador colorido
 * - Nome da categoria
 * - Ícone de ação
 */
export default function CategoriaCard({
  nome = "",
  cor = COLORS.borda,
  onPress,
  testID,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Categoria: ${nome}`}
      accessibilityHint="Toque para ver os detalhes da categoria"
      accessible={true}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      testID={testID}
    >
      <View style={styles.container}>
        {/* 🔵 Indicador de cor + texto */}
        <View style={styles.info}>
          <View style={[styles.indicador, { backgroundColor: cor }]} />
          <Text
            style={styles.nomeCategoria}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nome}
          </Text>
        </View>

        {/* ➤ Ícone de ação */}
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.cinzaTexto}
          style={styles.icone}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.branco,
    borderColor: COLORS.borda,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  nomeCategoria: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    flexShrink: 1,
  },
  icone: {
    marginLeft: 8,
  },
});
