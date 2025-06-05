import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import COLORS from "../constants/colors";

/**
 * Botão reutilizável com:
 * - Variação de cores (normal ou invertido)
 * - Tamanho (normal ou grande)
 * - Largura (adaptável ou fullWidth)
 */
export default function BotaoVerde({
  texto = "Ação",
  href,
  onPress,
  icone,
  invertido = false,
  size = "normal",
  fullWidth = false,
  testID,
}) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();
    if (href) return router.push(href);
  };

  const buttonStyles = [
    styles.base,
    invertido ? styles.inverso : styles.verde,
    size === "grande" && styles.grande,
    fullWidth && styles.fullWidth,
  ];

  const textoStyle = [
    styles.textoBase,
    invertido ? styles.textoVerde : styles.textoBranco,
  ];

  const iconColor = invertido ? COLORS.verde : COLORS.branco;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={buttonStyles}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Botão: ${texto}`}
      accessible={true}
      testID={testID}
    >
      <View style={styles.conteudo}>
        {icone && (
          <Ionicons
            name={icone}
            size={18}
            color={iconColor}
            style={styles.icone}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          />
        )}
        <Text style={textoStyle}>{texto}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    }),
  },
  verde: {
    backgroundColor: COLORS.verde,
  },
  inverso: {
    backgroundColor: COLORS.branco,
    borderWidth: 1.5,
    borderColor: COLORS.verde,
  },
  fullWidth: {
    width: "100%",
  },
  grande: {
    paddingVertical: 16,
  },
  conteudo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icone: {
    marginRight: 8,
  },
  textoBase: {
    fontSize: 14,
    fontWeight: "bold",
  },
  textoBranco: {
    color: COLORS.branco,
  },
  textoVerde: {
    color: COLORS.verde,
  },
});
