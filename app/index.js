import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import BotaoVerde from "../components/BotaoVerde";
import CategoriaCard from "../components/CategoriaCard";
import GraficoPizza from "../components/GraficoPizza";
import Header from "../components/Header";
import LegendaPizza from "../components/LegendaPizza";
import { CATEGORIAS } from "../constants/categorias";
import COLORS from "../constants/colors";

export default function Index() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const dadosPizza = [
    { name: "Alimentação", amount: 600, color: COLORS.alerta },
    { name: "Transporte", amount: 400, color: COLORS.transporte },
    { name: "Lazer", amount: 150, color: COLORS.lazer },
    { name: "Outros", amount: 100, color: COLORS.outros },
  ];

  return (
    <View style={styles.container}>
      <Header titulo="Visão Geral" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Total de Gastos */}
        <View style={styles.bloco}>
          <Text style={styles.subtitulo}>Total de Gastos</Text>
          <Text style={styles.valor}>R$ 1.250,00</Text>
        </View>

        {/* Gráfico + Legenda */}
        <View style={styles.bloco}>
          <GraficoPizza dados={dadosPizza} />
          <LegendaPizza dados={dadosPizza} />
        </View>

        {/* Ações principais */}
        <View style={[styles.bloco, styles.botoes]}>
          <BotaoVerde texto="Adicionar Gasto" href="/adicionar" icone="add" />
          <BotaoVerde texto="Ver Gastos" href="/lista" invertido icone="list" />
        </View>

        {/* Lista de Categorias */}
        <View style={styles.bloco}>
          <Text style={styles.subtitulo}>Categorias</Text>
          {CATEGORIAS.map((cat) => (
            <CategoriaCard
              key={cat.id}
              nome={cat.nome}
              cor={cat.cor}
              onPress={() => console.log("Selecionado:", cat.nome)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.branco,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  bloco: {
    marginBottom: 24,
  },
  subtitulo: {
    fontSize: 16,
    color: COLORS.cinzaTexto,
    marginBottom: 6,
    fontWeight: "600",
  },
  valor: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
