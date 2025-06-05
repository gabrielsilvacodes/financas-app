import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { formataValor } from "../utils/formatacao";
import { carregarDados } from "../utils/storage";

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const [transacoes, setTransacoes] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [dadosPizza, setDadosPizza] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function carregarTransacoes() {
        const dados = await carregarDados();
        setTransacoes(dados);

        const entradas = dados
          .filter((t) => t.tipo === "entrada")
          .reduce((acc, cur) => acc + Number(cur.valor), 0);

        const saidas = dados
          .filter((t) => t.tipo === "saida")
          .reduce((acc, cur) => acc + Number(cur.valor), 0);

        setValorTotal(entradas - saidas);
        setDadosPizza(gerarDadosPizza(dados));
      }

      carregarTransacoes();
    }, [])
  );

  const gerarDadosPizza = (dados) => {
    return CATEGORIAS.map((cat) => {
      const total = dados
        .filter((t) => t.tipo === "saida" && t.categoria === cat.nome)
        .reduce((acc, cur) => acc + Number(cur.valor), 0);

      return {
        name: cat.nome,
        amount: total,
        color: cat.cor,
      };
    }).filter((c) => c.amount > 0);
  };

  const abrirSelecaoTipo = () => {
    Alert.alert("Tipo de Transação", "O que deseja registrar?", [
      {
        text: "Entrada",
        onPress: () =>
          router.push({
            pathname: "/transacoes/adicionar",
            params: { tipo: "entrada" },
          }),
      },
      {
        text: "Saída",
        onPress: () =>
          router.push({
            pathname: "/transacoes/adicionar",
            params: { tipo: "saida" },
          }),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header titulo="Visão Geral" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: width < 360 ? 16 : 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Section title="Saldo Total">
          <Text style={styles.valor}>{formataValor(valorTotal)}</Text>
        </Section>

        <Section title="Distribuição por categoria">
          {dadosPizza.length > 0 ? (
            <>
              <GraficoPizza dados={dadosPizza} />
              <LegendaPizza dados={dadosPizza} />
            </>
          ) : (
            <Text style={styles.semDados}>Nenhum gasto registrado ainda.</Text>
          )}
        </Section>

        <View style={[styles.bloco, styles.botoes]}>
          <BotaoVerde
            texto="Ver Transações"
            href="/transacoes/lista"
            invertido
            icone="list"
          />
        </View>

        <Section title="Categorias">
          <View style={styles.listaCategorias}>
            {CATEGORIAS.map((cat) => (
              <CategoriaCard
                key={cat.id}
                nome={cat.nome}
                cor={cat.cor}
                onPress={() =>
                  router.push({
                    pathname: "/transacoes/lista",
                    params: { categoria: cat.nome },
                  })
                }
              />
            ))}
          </View>
        </Section>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={abrirSelecaoTipo}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova transação"
      >
        <Ionicons name="add" size={28} color={COLORS.branco} />
      </TouchableOpacity>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.bloco}>
      {title && <Text style={styles.subtitulo}>{title}</Text>}
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
    paddingBottom: 80,
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
  semDados: {
    fontSize: 14,
    color: COLORS.cinzaTexto,
    textAlign: "center",
    marginTop: 12,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  listaCategorias: {
    gap: 12,
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: COLORS.verde,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
});
