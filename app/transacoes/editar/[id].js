import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

import FormTransacao from "../../../components/FormTransacao";
import Header from "../../../components/Header";
import COLORS from "../../../constants/colors";
import { carregarDados, salvarDados } from "../../../utils/storage";

export default function EditarTransacao() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [carregando, setCarregando] = useState(true);
  const [transacao, setTransacao] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function buscarTransacao() {
      try {
        const dados = await carregarDados();
        const encontrada = dados.find((t) => t.id === id);

        if (!encontrada) {
          Alert.alert("Erro", "Transação não encontrada.");
          router.replace("/");
          return;
        }

        if (ativo) setTransacao(encontrada);
      } catch (error) {
        Alert.alert("Erro", "Ocorreu um problema ao buscar a transação.");
        router.replace("/");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    if (typeof id === "string") {
      buscarTransacao();
    } else {
      router.replace("/");
    }

    return () => {
      ativo = false;
    };
  }, [id, router]);

  const handleSalvar = async (transacaoEditada) => {
    try {
      const dados = await carregarDados();
      const atualizados = dados.map((t) =>
        t.id === transacaoEditada.id ? transacaoEditada : t
      );
      await salvarDados(atualizados);
      Alert.alert("Sucesso", "Transação atualizada!");
      router.replace("/");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  if (carregando) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.verde} />
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityRole="form">
      <Header titulo="Editar Transação" mostrarVoltar />
      <FormTransacao
        tipo={transacao?.tipo}
        transacaoExistente={transacao}
        onSalvar={handleSalvar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.branco,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
