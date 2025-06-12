import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../constants/colors";

/**
 * Botão verde reutilizável com melhorias visuais.
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
  loading = false,
  disabled = false,
  style,
}) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (!loading && !disabled) {
      if (typeof onPress === "function") onPress();
      else if (href) router.push(href);
    }
  }, [onPress, href, router, loading, disabled]);

  const buttonStyles = [
    styles.base,
    invertido ? styles.inverso : styles.verde,
    size === "grande" && styles.grande,
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textoStyle = [
    styles.textoBase,
    invertido ? styles.textoVerde : styles.textoBranco,
    (disabled || loading) && styles.textoDesabilitado,
  ];

  const iconColor = invertido ? COLORS.verde : COLORS.branco;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={buttonStyles}
      activeOpacity={disabled ? 1 : 0.75}
      accessibilityRole="button"
      accessibilityLabel={`Botão: ${texto}`}
      testID={testID}
      disabled={disabled || loading}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.conteudo}>
        {loading ? (
          <ActivityIndicator
            size={20}
            color={iconColor}
            style={{ marginRight: 10 }}
          />
        ) : (
          icone && (
            <Ionicons
              name={icone}
              size={20}
              color={iconColor}
              style={styles.icone}
            />
          )
        )}
        <Text style={textoStyle} numberOfLines={1} ellipsizeMode="tail">
          {texto}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    minWidth: 120,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 4,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    }),
  },
  verde: {
    backgroundColor: COLORS.verde,
    borderWidth: 0,
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
    minHeight: 58,
  },
  conteudo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    flexShrink: 1,
  },
  icone: {
    marginRight: 8,
  },
  textoBase: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
    textAlign: "center",
    flexShrink: 1,
  },
  textoBranco: {
    color: COLORS.branco,
  },
  textoVerde: {
    color: COLORS.verde,
  },
  disabled: {
    opacity: 0.5,
  },
  textoDesabilitado: {
    color: COLORS.cinzaTexto,
  },
});
