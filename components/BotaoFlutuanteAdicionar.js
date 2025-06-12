import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import COLORS from "../constants/colors";

/**
 * Botão flutuante para adicionar nova transação.
 * Visível apenas fora das rotas de formulário.
 */
export default function BotaoFlutuanteAdicionar() {
  const router = useRouter();
  const pathname = usePathname();

  // Esconde em rotas de formulário
  const ocultar =
    pathname.includes("/adicionar") || pathname.includes("/editar");

  if (ocultar) return null;

  const handleAdicionar = () => {
    router.push({
      pathname: "/transacoes/adicionar",
      params: { tipo: "entrada" },
    });
  };

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <Pressable
        onPress={handleAdicionar}
        style={({ pressed }) => [styles.botao, pressed && styles.botaoAtivo]}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova transação"
        hitSlop={12}
        android_ripple={{ color: COLORS.verdeEscuro, radius: 38 }}
        testID="fab-adicionar"
      >
        <Ionicons name="add" size={34} color={COLORS.branco} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 36 : 28,
    right: 22,
    zIndex: 999,
    elevation: 6,
    // Safe area extra para não cobrir navegadores no iOS ou botões no Android
    pointerEvents: "box-none",
  },
  botao: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.verde,
    borderWidth: 2,
    borderColor: COLORS.verdeEscuro,
    alignItems: "center",
    justifyContent: "center",
    // Sombra cross-platform
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 12,
    // Feedback de toque
    transform: [{ scale: 1 }],
  },
  botaoAtivo: {
    opacity: 0.75,
    backgroundColor: COLORS.verdeEscuro,
    transform: [{ scale: 0.96 }],
  },
});
