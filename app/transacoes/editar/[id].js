// app/transacoes/editar/[id].js

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

  // 🔄 Busca a transação pelo ID ao montar
  useEffect(() => {
    async function buscarTransacao() {
      const dados = await carregarDados();
      const encontrada = dados.find((t) => t.id === id);

      if (!encontrada) {
        Alert.alert("Erro", "Transação não encontrada.");
        return router.back();
      }

      setTransacao(encontrada);
      setCarregando(false);
    }

    if (id) {
      buscarTransacao();
    }

    // 🧹 Limpa estado ao desmontar
    return () => {
      setTransacao(null);
      setCarregando(true);
    };
  }, [id]);

  // 💾 Salva as alterações feitas no formulário
  const handleSalvar = async (transacaoEditada) => {
    const dados = await carregarDados();
    const atualizados = dados.map((t) =>
      t.id === transacaoEditada.id ? transacaoEditada : t
    );

    await salvarDados(atualizados);
    Alert.alert("Sucesso", "Transação atualizada!");
    router.push("/home");
  };

  if (carregando) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.verde} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header titulo="Editar Transação" mostrarVoltar />
      <FormTransacao
        transacaoExistente={transacao}
        onSalvar={handleSalvar}
        tipo="editar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.branco,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
