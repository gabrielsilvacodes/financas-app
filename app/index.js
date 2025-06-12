import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import BotaoFlutuanteAdicionar from "../components/BotaoFlutuanteAdicionar";
import BotaoVerde from "../components/BotaoVerde";
import CategoriaCard from "../components/CategoriaCard";
import EmptyState from "../components/EmptyState";
import GraficoPizza from "../components/GraficoPizza";
import Header from "../components/Header";
import LegendaPizza from "../components/LegendaPizza";

import COLORS from "../constants/colors";
import { gerarDadosPizza, somarValores } from "../utils/estatisticas";
import { formataValor } from "../utils/formatacao";
import { carregarCategorias, carregarDados } from "../utils/storage";

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const [transacoes, setTransacoes] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [dadosPizza, setDadosPizza] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const carregarDadosIniciais = async () => {
        setCarregando(true);
        try {
          const dados = await carregarDados();
          const cats = await carregarCategorias();

          setTransacoes(dados);

          const listaCategorias = [
            ...(Array.isArray(cats?.entrada) ? cats.entrada : []),
            ...(Array.isArray(cats?.saida) ? cats.saida : []),
          ];
          setCategorias(listaCategorias);

          const entradas = somarValores(dados, "entrada");
          const saidas = somarValores(dados, "saida");
          setValorTotal(entradas - saidas);

          const pizza = gerarDadosPizza(dados, listaCategorias);
          setDadosPizza(pizza);
        } catch (erro) {
          console.error("❌ Erro ao carregar dados da Dashboard:", erro);
          Alert.alert("Erro", "Não foi possível carregar as informações.");
        } finally {
          setCarregando(false);
        }
      };
      carregarDadosIniciais();
    }, [])
  );

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.verde} />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </View>
    );
  }

  const isEmpty = transacoes.length === 0 && categorias.length === 0;

  return (
    <View style={styles.container}>
      <Header
        titulo="Visão Geral"
        corFundo={COLORS.verde}
        corTitulo={COLORS.branco}
        corIcone={COLORS.branco}
        mostrarEstatisticas={true}
      />

      <FlatList
        data={categorias}
        keyExtractor={(item, index) => `${item?.chave || item?.nome}-${index}`}
        ListHeaderComponent={
          <View
            style={[
              styles.content,
              { paddingHorizontal: width < 360 ? 16 : 24 },
            ]}
          >
            {isEmpty ? (
              <View style={styles.emptyWrapper}>
                <EmptyState
                  titulo="Seu app está pronto!"
                  descricao="Comece adicionando sua primeira transação."
                  icone="wallet-outline"
                />
              </View>
            ) : (
              <>
                <Section title="Saldo Total">
                  <View style={styles.cardBox}>
                    <Text
                      style={[
                        styles.valor,
                        {
                          color:
                            valorTotal >= 0 ? COLORS.verde : COLORS.vermelho,
                        },
                      ]}
                      testID="valor-total"
                    >
                      {formataValor(valorTotal)}
                    </Text>
                  </View>
                </Section>

                <Section title="Distribuição por categoria">
                  <View style={styles.cardBox}>
                    {dadosPizza?.length > 0 ? (
                      <>
                        <GraficoPizza dados={dadosPizza} />
                        <LegendaPizza dados={dadosPizza} />
                      </>
                    ) : (
                      <EmptyState
                        titulo="Nenhum gasto registrado"
                        descricao="Adicione transações para visualizar a distribuição."
                        icone="pie-chart-outline"
                      />
                    )}
                  </View>
                </Section>

                <View style={[styles.bloco, styles.botoes]}>
                  <BotaoVerde
                    texto="Ver Transações"
                    href="/transacoes/lista"
                    invertido
                    icone="list"
                    testID="botao-transacoes"
                  />
                </View>

                <Section title="Categorias" />
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: width < 360 ? 16 : 24 }}>
            <CategoriaCard
              nome={item.nome}
              cor={item.cor || COLORS.categoria?.outros}
              onPress={() =>
                router.push({
                  pathname: "/transacoes/lista",
                  params: { categoria: item.chave },
                })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          !isEmpty && (
            <EmptyState
              titulo="Nenhuma categoria cadastrada"
              descricao="Adicione ou personalize suas categorias."
              icone="grid-outline"
            />
          )
        }
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: Platform.select({ ios: 24, android: 16 }),
        }}
        showsVerticalScrollIndicator={false}
      />

      <BotaoFlutuanteAdicionar style={{ bottom: 32 }} />
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
    backgroundColor: COLORS.neutroClaro,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.branco,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    color: COLORS.cinzaTexto,
    marginTop: 12,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  content: {
    paddingTop: 0,
  },
  bloco: {
    marginBottom: 32,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    marginBottom: 10,
    marginTop: 8,
    letterSpacing: 0.1,
  },
  valor: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  cardBox: {
    backgroundColor: COLORS.fundoClaro,
    borderRadius: 12,
    padding: 24,
    shadowColor: COLORS.sombraLeve,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 6,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  emptyWrapper: {
    paddingVertical: 32,
  },
});
