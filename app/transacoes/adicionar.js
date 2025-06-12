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

  // Normaliza o tipo para evitar erros de maiúsculas/minúsculas ou undefined
  const tipoNormalizado = useMemo(
    () => String(tipo || "").toLowerCase(),
    [tipo]
  );
  const tipoEhValido = TIPOS_VALIDOS.includes(tipoNormalizado);

  // Redireciona para Home se tipo inválido
  useEffect(() => {
    if (!tipoEhValido) {
      Alert.alert("Erro", "Tipo de transação inválido.");
      router.replace("/");
    }
    // Inclui router nas dependências para seguir a recomendação do React
  }, [tipoEhValido, router]);

  // Callback chamado ao salvar uma transação
  const handleSalvar = () => {
    // Opcional: exibir um feedback visual de sucesso antes de redirecionar
    // Alert.alert("Sucesso", "Transação adicionada!");
    router.replace("/");
  };

  // Aguarda redirecionamento para não exibir a tela
  if (!tipoEhValido) {
    return null;
  }

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
