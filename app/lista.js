// app/lista.js
import { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import GastoItem from "../components/GastoItem";
import Header from "../components/Header";
import COLORS from "../constants/colors";

// 💰 Dados simulados
const GASTOS = [
  { id: 1, data: "25 de abril de 2024", nome: "Supermercado", valor: 50 },
  { id: 2, data: "25 de abril de 2024", nome: "Gasolina", valor: 150 },
  { id: 3, data: "25 de abril de 2024", nome: "Aluguel", valor: 700 },
  { id: 4, data: "24 de abril de 2024", nome: "Restaurante", valor: 80 },
  { id: 5, data: "23 de abril de 2024", nome: "Internet", valor: 90 },
  { id: 6, data: "23 de abril de 2024", nome: "Farmácia", valor: 30 },
  { id: 7, data: "23 de abril de 2024", nome: "Água", valor: 54 },
  { id: 8, data: "22 de abril de 2024", nome: "Luz", valor: 80 },
];

export default function ListaGastos() {
  const { width } = useWindowDimensions();
  const total = useMemo(
    () => GASTOS.reduce((acc, item) => acc + item.valor, 0).toFixed(2),
    []
  );

  return (
    <View style={styles.container}>
      <Header titulo="Lista de Gastos" mostrarVoltar />

      <FlatList
        data={GASTOS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GastoItem data={item.data} nome={item.nome} valor={item.valor} />
        )}
        ListHeaderComponent={
          <View
            style={[styles.topo, { paddingHorizontal: width < 360 ? 16 : 24 }]}
          >
            {/* Filtros */}
            <View style={styles.filtros}>
              <FiltroBotao
                texto="Categoria"
                onPress={() => console.log("Filtrar por categoria")}
              />
              <FiltroBotao
                texto="Período"
                onPress={() => console.log("Filtrar por período")}
              />
            </View>

            {/* Totalizador */}
            <Text
              style={styles.totalizador}
              accessibilityRole="text"
              accessibilityLabel={`Valor total dos gastos no período: R$ ${total}`}
            >
              Total no período: R$ {total}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.semDados} accessibilityRole="text">
            Nenhum gasto registrado.
          </Text>
        }
        contentContainerStyle={[
          styles.lista,
          { paddingHorizontal: width < 360 ? 16 : 24 },
        ]}
        initialNumToRender={6}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// 🔄 Botão reutilizável de filtro
function FiltroBotao({ texto, onPress }) {
  return (
    <TouchableOpacity
      style={styles.filtroBotao}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filtrar por ${texto}`}
      accessibilityHint={`Filtrar os gastos por ${texto.toLowerCase()}`}
      activeOpacity={0.85}
    >
      <Text style={styles.filtroTexto}>{texto} ▼</Text>
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
    gap: 12,
    marginBottom: 12,
  },
  filtroBotao: {
    flex: 1,
    backgroundColor: COLORS.cinzaClaro,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  filtroTexto: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
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
  semDados: {
    textAlign: "center",
    color: COLORS.cinzaTexto,
    fontSize: 16,
    marginTop: 40,
  },
});
