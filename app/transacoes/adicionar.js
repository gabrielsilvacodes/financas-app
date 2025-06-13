import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Alert, StyleSheet, View } from "react-native";

import FormTransacao from "../../components/FormTransacao";
import Header from "../../components/Header";
import COLORS from "../../constants/colors";

const TIPOS_VALIDOS = ["entrada", "saida"];

export default function AdicionarTransacao() {
  const router = useRouter();
  const { tipo: tipoParam } = useLocalSearchParams();

  // 🧹 Normaliza e valida o tipo
  const tipoNormalizado = useMemo(
    () => (typeof tipoParam === "string" ? tipoParam.trim().toLowerCase() : ""),
    [tipoParam]
  );

  const tipoEhValido = TIPOS_VALIDOS.includes(tipoNormalizado);

  // 🚫 Redireciona se tipo for inválido
  useEffect(() => {
    if (!tipoEhValido) {
      Alert.alert("Erro", "Tipo de transação inválido.");
      router.replace("/");
    }
  }, [tipoEhValido, router]);

  // ✅ Callback após salvar
  const handleSalvar = () => {
    router.replace("/");
  };

  // 🛑 Evita renderização se tipo for inválido
  if (!tipoEhValido) return null;

  return (
    <View
      style={styles.container}
      testID="adicionar-transacao-screen"
      accessibilityRole="main"
    >
      <Header titulo="Adicionar Transação" mostrarVoltar />
      <FormTransacao tipo={tipoNormalizado} onSalvar={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.branco,
  },
});
