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
import { carregarDados, salvarDados } from "../../utils/storage";
import { formatarDataParaExibicao } from "../../utils/transacaoUtils";

const CATEGORIA_TODAS = "Todas";

export default function ListaGastos() {
  const { width } = useWindowDimensions();
  const { categoria } = useLocalSearchParams();

  const [gastos, setGastos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        setCarregando(true);
        try {
          const dados = await carregarDados();
          setGastos(dados);
          setFiltroCategoria(categoria ? String(categoria) : null);
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

  const obterTextoCategoria = (cat) => {
    if (typeof cat === "string") return cat.trim();
    if (typeof cat === "object") return (cat?.value || cat?.nome || "").trim();
    return "";
  };

  const categoriasDisponiveis = useMemo(() => {
    const categoriasEmUso = gastos
      .map((g) => obterTextoCategoria(g.categoria))
      .filter((cat) => cat && cat !== "");

    const unicos = [...new Set(categoriasEmUso)];
    const unicosFiltrados = unicos.filter(
      (cat) => cat.toLowerCase() !== CATEGORIA_TODAS.toLowerCase()
    );

    return unicosFiltrados.length > 0
      ? [CATEGORIA_TODAS, ...unicosFiltrados]
      : [];
  }, [gastos]);

  const gastosFiltrados = useMemo(() => {
    if (!filtroCategoria || filtroCategoria === CATEGORIA_TODAS) return gastos;
    return gastos.filter(
      (g) =>
        obterTextoCategoria(g.categoria).toLowerCase() ===
        filtroCategoria.toLowerCase()
    );
  }, [gastos, filtroCategoria]);

  const gastosAgrupados = useMemo(() => {
    return Object.entries(
      gastosFiltrados.reduce((acc, item) => {
        const data = formatarDataParaExibicao(item.data || new Date());
        acc[data] = acc[data] || [];
        acc[data].push(item);
        return acc;
      }, {})
    ).sort(([dataA], [dataB]) => new Date(dataB) - new Date(dataA));
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

      {categoriasDisponiveis.length > 0 && (
        <View
          style={[styles.topo, { paddingHorizontal: width < 360 ? 12 : 20 }]}
        >
          <View style={styles.filtros}>
            {categoriasDisponiveis.map((cat, index) => {
              const chave = String(cat);
              return (
                <FiltroBotao
                  key={`filtro-${index}-${chave}`}
                  texto={chave}
                  ativo={chave === (filtroCategoria || CATEGORIA_TODAS)}
                  onPress={() =>
                    setFiltroCategoria((prev) =>
                      prev === chave || (chave === CATEGORIA_TODAS && !prev)
                        ? null
                        : chave
                    )
                  }
                  testID={`filtro-${chave.toLowerCase()}`}
                />
              );
            })}
          </View>

          <Text style={styles.totalizador}>Total: R$ {total}</Text>

          {filtroCategoria && filtroCategoria !== CATEGORIA_TODAS && (
            <TouchableOpacity
              onPress={() => setFiltroCategoria(null)}
              style={{ marginTop: 6 }}
            >
              <Text
                style={{
                  color: COLORS.vermelho,
                  textAlign: "center",
                  fontSize: 13,
                }}
              >
                Remover filtro
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={gastosAgrupados}
        keyExtractor={([data]) => `grupo-${data}`}
        renderItem={({ item: [data, transacoes] }) => (
          <View style={styles.grupoCard}>
            <View style={styles.grupoHeader}>
              <Text style={styles.dataTitulo}>{data}</Text>
              <Text style={styles.grupoTotal}>
                R${" "}
                {transacoes
                  .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0)
                  .toFixed(2)
                  .replace(".", ",")}
              </Text>
            </View>
            {transacoes.map((gasto) => (
              <View key={`gasto-${gasto.id}`} style={styles.transacaoContainer}>
                <GastoItem {...gasto} />
                <TouchableOpacity
                  onPress={() => removerGasto(gasto.id, gasto.titulo)}
                  accessibilityLabel={`Excluir ${gasto.titulo}`}
                  accessibilityRole="button"
                  hitSlop={18}
                  style={styles.trashTouch}
                >
                  <Ionicons name="trash" size={22} color={COLORS.vermelho} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            titulo={
              filtroCategoria
                ? "Nenhuma transação encontrada"
                : "Nenhuma transação registrada"
            }
            descricao={
              filtroCategoria
                ? "Tente remover o filtro ou adicionar uma nova transação nesta categoria."
                : "Use o botão '+' abaixo para adicionar sua primeira transação."
            }
            icone="wallet-outline"
          />
        }
        contentContainerStyle={[
          styles.lista,
          { paddingHorizontal: width < 360 ? 10 : 16 },
        ]}
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
      style={[styles.filtroBotao, ativo && styles.filtroBotaoAtivo]}
      accessibilityRole="button"
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
  container: { flex: 1, backgroundColor: COLORS.neutroClaro },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.neutroClaro,
  },
  topo: {
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.branco,
    borderBottomWidth: 1,
    borderColor: COLORS.borda,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  filtroBotao: {
    backgroundColor: COLORS.cinzaClaro,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  filtroBotaoAtivo: {
    backgroundColor: COLORS.verde,
    shadowColor: COLORS.verdeEscuro,
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  filtroTexto: {
    fontSize: 14,
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
    paddingTop: 6,
  },
  grupoCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  grupoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: COLORS.borda,
    paddingBottom: 6,
  },
  dataTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textoPrincipal,
  },
  grupoTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.verdeEscuro,
  },
  transacaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  trashTouch: {
    padding: 10,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
