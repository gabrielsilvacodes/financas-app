import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Alert, StyleSheet, View } from "react-native";

import FormTransacao from "../../components/FormTransacao";
import Header from "../../components/Header";
import COLORS from "../../constants/colors";

const TIPOS_VALIDOS = ["entrada", "saida"];

export default function AdicionarTransacao() {
  const router = useRouter();
  const { tipo } = useLocalSearchParams();

  // Normaliza o tipo e verifica validade
  const tipoNormalizado = useMemo(
    () => (typeof tipo === "string" ? tipo.toLowerCase() : ""),
    [tipo]
  );

  const tipoEhValido = TIPOS_VALIDOS.includes(tipoNormalizado);

  useEffect(() => {
    if (!tipoEhValido) {
      Alert.alert("Erro", "Tipo de transação inválido.");
      router.replace("/");
    }
  }, [tipoEhValido, router]);

  const handleSalvar = () => {
    // 🚀 Redireciona após salvar
    router.replace("/");
  };

  // Evita exibição se o tipo é inválido
  if (!tipoEhValido) return null;

  return (
    <View style={styles.container} testID="adicionar-transacao-screen">
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
