import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

import FormTransacao from "../../../components/FormTransacao";
import Header from "../../../components/Header";
import COLORS from "../../../constants/colors";
import { carregarDados, salvarDados } from "../../../utils/storage";

export default function EditarTransacao() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [transacao, setTransacao] = useState(null);

  useEffect(() => {
    async function buscarTransacao() {
      try {
        const dados = await carregarDados();
        const encontrada = dados.find((t) => t.id === id);

        if (!encontrada) {
          Alert.alert("Erro", "Transação não encontrada.");
          return router.replace("/");
        }

        setTransacao(encontrada);
      } catch (error) {
        Alert.alert("Erro", "Ocorreu um problema ao buscar a transação.");
        router.replace("/");
      } finally {
        setCarregando(false);
      }
    }

    if (id) {
      buscarTransacao();
    }

    // Limpa estado ao desmontar a tela
    return () => {
      setTransacao(null);
      setCarregando(true);
    };
  }, [id, router]); // Incluído router

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
        {/* Pode adicionar um texto de loading se desejar */}
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
