import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";

import FormTransacao from "../../components/FormTransacao";
import Header from "../../components/Header";
import COLORS from "../../constants/colors";

export default function AdicionarTransacao() {
  const router = useRouter();
  const { tipo = "saida" } = useLocalSearchParams();

  useEffect(() => {
    const tiposValidos = ["entrada", "saida"];

    // Verificação se o tipo é válido
    if (!tiposValidos.includes(tipo)) {
      Alert.alert("Erro", "Tipo de transação inválido.");
      router.replace("/index"); // Redireciona para uma rota segura
    }
  }, [tipo]);

  const titulo = tipo === "entrada" ? "Adicionar Receita" : "Adicionar Gasto";

  const handleSalvar = () => {
    console.log("Transação salva, navegando...");
    router.replace("/"); // Substitui a tela em vez de empilhar
  };

  return (
    <View style={styles.container}>
      <Header titulo={titulo} mostrarVoltar />
      <FormTransacao tipo={tipo} onSalvar={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.branco,
    paddingTop: Platform.OS === "ios" ? 0 : 0,
  },
});
