import {
  Platform,
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

/**
 * Tela principal (dashboard) com visão geral de gastos.
 */
export default function Index() {
  const { width } = useWindowDimensions();

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
        accessibilityLabel="Tela de visão geral com gráficos e resumo de gastos"
      >
        <Section title="Total de Gastos">
          <Text
            style={styles.valor}
            accessibilityRole="text"
            accessibilityLabel={`Valor total gasto no período: R$ ${valorTotal.toFixed(
              2
            )}`}
          >
            R$ {valorTotal.toFixed(2)}
          </Text>
        </Section>

        <Section title="Distribuição por categoria">
          <GraficoPizza dados={dadosPizza} />
          <LegendaPizza dados={dadosPizza} />
        </Section>

        <View style={[styles.bloco, styles.botoes]}>
          <BotaoVerde texto="Adicionar Gasto" href="/adicionar" icone="add" />
          <BotaoVerde texto="Ver Gastos" href="/lista" invertido icone="list" />
        </View>

        <Section title="Categorias">
          <View style={styles.listaCategorias}>
            {CATEGORIAS.map((cat) => (
              <CategoriaCard
                key={cat.id}
                nome={cat.nome}
                cor={cat.cor}
                onPress={() => {
                  console.log("Selecionado:", cat.nome);
                  // Futuro: navegação para gastos por categoria
                }}
              />
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

/**
 * Bloco visual reutilizável com título e filhos.
 */
function Section({ title, children }) {
  return (
    <View style={styles.bloco}>
      {title && (
        <Text
          style={styles.subtitulo}
          accessibilityRole="header"
          accessibilityLabel={`Seção: ${title}`}
        >
          {title}
        </Text>
      )}
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
    paddingTop: Platform.select({ ios: 24, android: 16 }),
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
