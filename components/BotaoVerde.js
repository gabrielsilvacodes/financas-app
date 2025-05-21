import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import COLORS from "../constants/colors"; // ✅ Importação centralizada das cores

export default function BotaoVerde({
  texto = "Ação",
  href,
  invertido = false,
  icone,
  onPress,
}) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();
    if (href) return router.push(href);
  };

  return (
    <TouchableOpacity
      style={[
        styles.botaoBase,
        invertido ? styles.botaoInverso : styles.botaoVerde,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={texto}
    >
      {icone && (
        <Ionicons
          name={icone}
          size={18}
          color={invertido ? COLORS.verde : COLORS.branco}
          style={styles.icone}
        />
      )}
      <Text
        style={[
          styles.textoBase,
          invertido ? styles.textoVerde : styles.textoBranco,
        ]}
      >
        {texto}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botaoBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  botaoVerde: {
    backgroundColor: COLORS.verde,
    elevation: 2,
  },
  botaoInverso: {
    backgroundColor: COLORS.branco,
    borderWidth: 1.5,
    borderColor: COLORS.verde,
  },
  textoBase: {
    fontWeight: "bold",
    fontSize: 14,
  },
  textoBranco: {
    color: COLORS.branco,
  },
  textoVerde: {
    color: COLORS.verde,
  },
  icone: {
    marginRight: 6,
  },
});
