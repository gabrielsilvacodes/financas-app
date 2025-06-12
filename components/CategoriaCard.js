import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors";

/**
 * Cartão clicável de categoria com indicador colorido e ícone de seta.
 */
function CategoriaCard({
  nome = "Categoria",
  cor = COLORS.categoria?.outros || COLORS.verde,
  onPress = () => {},
  ativo = false,
  testID,
}) {
  const nomeSeguro = nome?.trim() || "Categoria";
  const corIndicador = cor || COLORS.categoria?.outros || COLORS.verde;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, ativo && styles.cardAtivo]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Categoria: ${nomeSeguro}`}
      accessibilityHint={`Toque para visualizar transações da categoria ${nomeSeguro}`}
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      testID={testID || `card-${nomeSeguro.toLowerCase().replace(/\s/g, "-")}`}
    >
      <View style={styles.container}>
        <View style={styles.info}>
          <View style={[styles.indicador, { backgroundColor: corIndicador }]} />
          <Text
            style={styles.nomeCategoria}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {nomeSeguro}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={22}
          color={COLORS.cinzaTexto}
          style={styles.icone}
          accessible={false}
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
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    minHeight: 60,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardAtivo: {
    borderColor: COLORS.verde,
    backgroundColor: "#e6f9f1", // leve highlight (padrão de feedback)
    elevation: 2,
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
    minWidth: 0,
  },
  indicador: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  nomeCategoria: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    flexShrink: 1,
  },
  icone: {
    marginLeft: 14,
    alignSelf: "center",
  },
});

export default memo(CategoriaCard);
