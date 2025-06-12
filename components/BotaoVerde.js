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
 * Botão verde versátil com ícone, loading e feedback visual.
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
  style, // permite customização extra
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
    minHeight: 50,
    minWidth: 110,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.11,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    }),
    transitionDuration: "150ms", // para web (opcional)
  },
  verde: {
    backgroundColor: COLORS.verde,
    borderWidth: 0,
  },
  inverso: {
    backgroundColor: COLORS.branco,
    borderWidth: 1.7,
    borderColor: COLORS.verde,
  },
  fullWidth: {
    width: "100%",
  },
  grande: {
    paddingVertical: 18,
    minHeight: 60,
  },
  conteudo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0, // permite texto quebrar corretamente
    flex: 1,
  },
  icone: {
    marginRight: 8,
    alignSelf: "center",
  },
  textoBase: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
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
    opacity: 0.58,
  },
  textoDesabilitado: {
    color: COLORS.cinzaTexto,
  },
});
