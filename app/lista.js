import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GastoItem from "../components/GastoItem";

// 💰 Dados mockados
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

  // 🔧 Estilo do header da tela
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Lista de Gastos",
      headerStyle: {
        backgroundColor: "#1DB954",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Filtros */}
      <View style={styles.filtros}>
        <TouchableOpacity
          style={styles.filtroBotao}
          accessibilityLabel="Filtrar por categoria"
          onPress={() => console.log("Filtro de categoria")}
        >
          <Text style={styles.filtroTexto}>Categoria ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filtroBotao}
          accessibilityLabel="Filtrar por período"
          onPress={() => console.log("Filtro de período")}
        >
          <Text style={styles.filtroTexto}>Período ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Totalizador */}
      <Text style={styles.totalizador}>Total no período: R$ 1.234,00</Text>

      {/* Lista de gastos */}
      {GASTOS.map((gasto) => (
        <GastoItem
          key={gasto.id}
          data={gasto.data}
          nome={gasto.nome}
          valor={gasto.valor}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
  },
  filtros: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  filtroBotao: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filtroTexto: {
    textAlign: "center",
    fontWeight: "500",
  },
  totalizador: {
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
  },
});
