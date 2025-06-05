import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import GastoItem from "../../components/GastoItem";
import Header from "../../components/Header";
import COLORS from "../../constants/colors";
import { carregarDados, salvarDados } from "../../utils/storage";
import { formatarDataParaExibicao } from "../../utils/transacaoUtils";

export default function ListaGastos() {
  const { width } = useWindowDimensions();
  const { categoria } = useLocalSearchParams();
  const [gastos, setGastos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const carregarGastos = async () => {
        try {
          const todos = await carregarDados();
          setGastos(todos);
          if (categoria) {
            setFiltroCategoria(categoria.toString());
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      };
      carregarGastos();
    }, [categoria])
  );

  const categoriasDisponiveis = useMemo(() => {
    const unicas = [...new Set(gastos.map((g) => g.categoria))];
    return ["Todas", ...unicas];
  }, [gastos]);

  const gastosFiltrados = useMemo(() => {
    if (!filtroCategoria || filtroCategoria === "Todas") return gastos;
    return gastos.filter((item) => item.categoria === filtroCategoria);
  }, [gastos, filtroCategoria]);

  const gastosAgrupados = useMemo(() => {
    const agrupado = {};
    gastosFiltrados.forEach((item) => {
      const dataExibicao = formatarDataParaExibicao(item.data);
      if (!agrupado[dataExibicao]) agrupado[dataExibicao] = [];
      agrupado[dataExibicao].push(item);
    });
    return Object.entries(agrupado);
  }, [gastosFiltrados]);

  const total = useMemo(() => {
    return gastosFiltrados
      .reduce((acc, item) => acc + parseFloat(item.valor), 0)
      .toFixed(2)
      .replace(".", ",");
  }, [gastosFiltrados]);

  const removerGasto = async (id) => {
    Alert.alert("Confirmar remoção", "Deseja excluir esta transação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const atualizados = gastos.filter((item) => item.id !== id);
            await salvarDados(atualizados);
            setGastos(atualizados);
          } catch (e) {
            console.error("Erro ao excluir:", e);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header titulo="Lista de Transações" mostrarVoltar />

      <FlatList
        data={gastosAgrupados}
        keyExtractor={([data], i) => data + i}
        renderItem={({ item: [data, transacoes] }) => (
          <View style={styles.grupo}>
            <Text style={styles.dataTitulo}>{data}</Text>
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
                  onPress={() => removerGasto(gasto.id)}
                  accessibilityLabel="Excluir transação"
                  accessibilityRole="button"
                  hitSlop={8}
                >
                  <Ionicons name="trash" size={20} color={COLORS.vermelho} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        ListHeaderComponent={
          <View
            style={[styles.topo, { paddingHorizontal: width < 360 ? 16 : 24 }]}
          >
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
                />
              ))}
            </View>
            <Text style={styles.totalizador}>Total: R$ {total}</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.semDados}>Nenhuma transação registrada.</Text>
        }
        contentContainerStyle={[
          styles.lista,
          { paddingHorizontal: width < 360 ? 16 : 24 },
        ]}
      />
    </View>
  );
}

function FiltroBotao({ texto, ativo, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.filtroBotao, ativo && { backgroundColor: COLORS.verde }]}
      onPress={onPress}
      activeOpacity={0.85}
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
    backgroundColor: COLORS.branco,
  },
  topo: {
    paddingTop: 24,
    paddingBottom: 12,
  },
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  filtroBotao: {
    backgroundColor: COLORS.cinzaClaro,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
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
  },
  lista: {
    paddingBottom: 32,
  },
  grupo: {
    marginBottom: 20,
  },
  dataTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.cinzaTexto,
    marginBottom: 6,
  },
  transacaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  semDados: {
    textAlign: "center",
    color: COLORS.cinzaTexto,
    fontSize: 16,
    marginTop: 40,
  },
});
