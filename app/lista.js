import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import GastoItem from "../components/GastoItem";
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
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Lista de Gastos",
      headerStyle: { backgroundColor: COLORS.verde },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, []);

  const renderItem = ({ item }) => (
    <GastoItem data={item.data} nome={item.nome} valor={item.valor} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={GASTOS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View
            style={[styles.topo, { paddingHorizontal: width < 360 ? 16 : 24 }]}
          >
            {/* Filtros */}
            <View style={styles.filtros}>
              <FiltroBotao
                label="Filtrar por categoria"
                onPress={() => console.log("Filtro de categoria")}
              />
              <FiltroBotao
                label="Filtrar por período"
                onPress={() => console.log("Filtro de período")}
              />
            </View>

            {/* Totalizador */}
            <Text
              style={styles.totalizador}
              accessibilityRole="summary"
              accessibilityLabel="Total de gastos no período"
            >
              Total no período: R$ 1.234,00
            </Text>
          </View>
        }
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// 🔄 Filtro reutilizável
function FiltroBotao({ label, onPress }) {
  return (
    <TouchableOpacity
      style={styles.filtroBotao}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.85}
    >
      <Text style={styles.filtroTexto}>
        {label.replace("Filtrar por ", "")} ▼
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
});
