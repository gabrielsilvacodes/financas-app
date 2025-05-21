import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors";

/**
 * Exibe um cartão de categoria com ícone, cor e título.
 */
export default function CategoriaCard({
  nome = "",
  cor = COLORS.borda,
  onPress,
  testID,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Categoria: ${nome}`}
      accessibilityHint="Toque para visualizar os gastos desta categoria"
      accessible
      testID={testID}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={styles.container}>
        {/* Indicador de cor + Nome */}
        <View style={styles.esquerda}>
          <View style={[styles.bolinha, { backgroundColor: cor }]} />
          <Text
            style={styles.nomeCategoria}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nome}
          </Text>
        </View>

        {/* Ícone de ação */}
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
