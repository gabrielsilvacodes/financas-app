import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import BotaoVerde from "../components/BotaoVerde";
import CategoriaCard from "../components/CategoriaCard";
import GraficoPizza from "../components/GraficoPizza";
import Header from "../components/Header";
import LegendaPizza from "../components/LegendaPizza";

import { CATEGORIAS } from "../constants/categorias";
import COLORS from "../constants/colors";

export default function Index() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const dadosPizza = [
    { name: "Alimentação", amount: 600, color: COLORS.alerta },
    { name: "Transporte", amount: 400, color: COLORS.transporte },
    { name: "Lazer", amount: 150, color: COLORS.lazer },
    { name: "Outros", amount: 100, color: COLORS.outros },
  ];

  const valorTotal = dadosPizza.reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <View style={styles.container}>
      <Header titulo="Visão Geral" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: width < 360 ? 16 : 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Bloco 1 – Total */}
        <Section
          title="Total de Gastos"
          accessibilityLabel="Seção de total de gastos"
        >
          <Text
            style={styles.valor}
            accessibilityLabel={`Valor total gasto: R$ ${valorTotal.toFixed(
              2
            )}`}
          >
            R$ {valorTotal.toFixed(2)}
          </Text>
        </Section>

        {/* Bloco 2 – Gráfico + Legenda */}
        <View style={styles.bloco}>
          <GraficoPizza dados={dadosPizza} />
          <LegendaPizza dados={dadosPizza} />
        </View>

        {/* Bloco 3 – Ações */}
        <View style={[styles.bloco, styles.botoes]}>
          <BotaoVerde texto="Adicionar Gasto" href="/adicionar" icone="add" />
          <BotaoVerde texto="Ver Gastos" href="/lista" invertido icone="list" />
        </View>

        {/* Bloco 4 – Categorias */}
        <Section title="Categorias" accessibilityLabel="Seção de categorias">
          <View style={styles.listaCategorias}>
            {CATEGORIAS.map((cat) => (
              <CategoriaCard
                key={cat.id}
                nome={cat.nome}
                cor={cat.cor}
                onPress={() => {
                  console.log("Selecionado:", cat.nome);
                  // Futuro: navegar para lista filtrada por categoria
                }}
              />
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

// 🔄 Componente auxiliar reutilizável para seções com título
function Section({ title, accessibilityLabel, children }) {
  return (
    <View
      style={styles.bloco}
      accessible
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.subtitulo}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.branco,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  bloco: {
    marginBottom: 32,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.cinzaTexto,
    marginBottom: 6,
  },
  valor: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  listaCategorias: {
    gap: 12,
    marginTop: 8,
  },
});
