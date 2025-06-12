import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import BotaoFlutuanteAdicionar from "../../components/BotaoFlutuanteAdicionar";
import EmptyState from "../../components/EmptyState";
import GastoItem from "../../components/GastoItem";
import Header from "../../components/Header";
import COLORS from "../../constants/colors";
import {
  carregarCategorias,
  carregarDados,
  salvarDados,
} from "../../utils/storage";
import { formatarDataParaExibicao } from "../../utils/transacaoUtils";

export default function ListaGastos() {
  const { width } = useWindowDimensions();
  const { categoria } = useLocalSearchParams();

  const [gastos, setGastos] = useState([]);
  const [categoriasSalvas, setCategoriasSalvas] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        setCarregando(true);
        try {
          const [dados, categorias] = await Promise.all([
            carregarDados(),
            carregarCategorias(),
          ]);
          setGastos(dados);
          setCategoriasSalvas(categorias || []);
          setFiltroCategoria(categoria?.toString() ?? null);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          Alert.alert("Erro", "Não foi possível carregar as transações.");
        } finally {
          setCarregando(false);
        }
      };
      carregar();
    }, [categoria])
  );

  const categoriasDisponiveis = useMemo(() => {
    const unicos = [...new Set(gastos.map((g) => g.categoria).filter(Boolean))];
    return ["Todas", ...unicos];
  }, [gastos]);

  const gastosFiltrados = useMemo(() => {
    if (!filtroCategoria || filtroCategoria === "Todas") return gastos;
    return gastos.filter((g) => g.categoria === filtroCategoria);
  }, [gastos, filtroCategoria]);

  const gastosAgrupados = useMemo(() => {
    return Object.entries(
      gastosFiltrados.reduce((acc, item) => {
        const data = formatarDataParaExibicao(item.data);
        acc[data] = acc[data] || [];
        acc[data].push(item);
        return acc;
      }, {})
    );
  }, [gastosFiltrados]);

  const total = useMemo(() => {
    return gastosFiltrados
      .reduce((acc, g) => acc + (parseFloat(g.valor) || 0), 0)
      .toFixed(2)
      .replace(".", ",");
  }, [gastosFiltrados]);

  const removerGasto = (id, nome) => {
    Alert.alert("Confirmar remoção", `Deseja excluir a transação "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const atualizados = gastos.filter((g) => g.id !== id);
            await salvarDados(atualizados);
            setGastos(atualizados);
            Alert.alert("Sucesso", "Transação excluída com sucesso!");
          } catch (e) {
            console.error("Erro ao excluir:", e);
            Alert.alert("Erro", "Não foi possível excluir a transação.");
          }
        },
      },
    ]);
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.verde} />
        <Text style={{ color: COLORS.cinzaTexto, marginTop: 12 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header titulo="Lista de Transações" mostrarVoltar />

      {/* Filtros */}
      <View style={[styles.topo, { paddingHorizontal: width < 360 ? 12 : 20 }]}>
        <View style={styles.filtros}>
          {categoriasDisponiveis.map((cat) => (
            <FiltroBotao
              key={cat}
              texto={cat}
              ativo={cat === (filtroCategoria || "Todas")}
              onPress={() =>
                setFiltroCategoria((prev) =>
                  prev === cat || (cat === "Todas" && !prev) ? null : cat
                )
              }
              testID={`filtro-${cat.toLowerCase()}`}
            />
          ))}
        </View>
        <Text style={styles.totalizador}>Total: R$ {total}</Text>
      </View>

      {/* Lista agrupada */}
      <FlatList
        data={gastosAgrupados}
        keyExtractor={([data], i) => `${data}-${i}`}
        renderItem={({ item: [data, transacoes] }) => (
          <View style={styles.grupoCard}>
            <View style={styles.grupoHeader}>
              <Text style={styles.dataTitulo}>{data}</Text>
              {/* Exemplo: total do grupo no header */}
              <Text style={styles.grupoTotal}>
                R$&nbsp;
                {transacoes
                  .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0)
                  .toFixed(2)
                  .replace(".", ",")}
              </Text>
            </View>
            {transacoes.map((gasto) => (
              <View key={gasto.id} style={styles.transacaoContainer}>
                <GastoItem
                  id={gasto.id}
                  data={formatarDataParaExibicao(gasto.data)}
                  nome={gasto.titulo}
                  valor={parseFloat(gasto.valor)}
                  categoria={gasto.categoria}
                  tipo={gasto.tipo}
                />
                <TouchableOpacity
                  onPress={() => removerGasto(gasto.id, gasto.titulo)}
                  accessibilityLabel={`Excluir ${gasto.titulo}`}
                  accessibilityHint="Remove essa transação da lista"
                  accessibilityRole="button"
                  hitSlop={18}
                  style={styles.trashTouch}
                  testID={`remover-${gasto.id}`}
                >
                  <Ionicons name="trash" size={22} color={COLORS.vermelho} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            titulo="Nenhuma transação registrada"
            descricao="Use o botão '+' abaixo para adicionar sua primeira transação."
            icone="wallet-outline"
          />
        }
        contentContainerStyle={[
          styles.lista,
          { paddingHorizontal: width < 360 ? 10 : 16 },
        ]}
        testID="lista-transacoes"
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
      />

      <BotaoFlutuanteAdicionar />
    </View>
  );
}

function FiltroBotao({ texto, ativo, onPress, testID }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filtroBotao,
        ativo && styles.filtroBotaoAtivo,
        { elevation: ativo ? 2 : 0 },
      ]}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Filtrar por ${texto}`}
      testID={testID}
    >
      <Text
        style={[
          styles.filtroTexto,
          ativo && { color: COLORS.branco, fontWeight: "bold" },
        ]}
      >
        {texto}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutroClaro || "#F5F5F5", // Leve acinzentado
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.neutroClaro || "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  topo: {
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: COLORS.branco,
    borderBottomWidth: 1,
    borderColor: COLORS.borda,
    borderRadius: 16,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
    justifyContent: "flex-start",
  },
  filtroBotao: {
    backgroundColor: COLORS.cinzaClaro,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 22,
    marginRight: 6,
    marginBottom: 6,
    minWidth: 70,
    alignItems: "center",
  },
  filtroBotaoAtivo: {
    backgroundColor: COLORS.verde,
    shadowColor: COLORS.verdeEscuro,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  filtroTexto: {
    fontSize: 15,
    color: COLORS.textoPrincipal,
  },
  totalizador: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    color: COLORS.verde,
    marginTop: 2,
  },
  lista: {
    paddingBottom: 100,
  },
  grupoCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    marginBottom: 14,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  grupoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: COLORS.borda,
  },
  dataTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textoPrincipal,
  },
  grupoTotal: {
    fontSize: 14,
    color: COLORS.cinzaTexto,
    fontWeight: "500",
  },
  transacaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
    marginTop: 2,
  },
  trashTouch: {
    padding: 10,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
