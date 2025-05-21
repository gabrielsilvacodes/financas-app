import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";

import GraficoPizza from "../components/GraficoPizza";
import LegendaPizza from "../components/LegendaPizza";

export default function Estatisticas() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Estatística",
      headerStyle: { backgroundColor: "#1DB954" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, []);

  const [open, setOpen] = useState(false);
  const [mes, setMes] = useState("Abril 2025");
  const [meses, setMeses] = useState([
    { label: "Abril 2025", value: "Abril 2025" },
    { label: "Março 2025", value: "Março 2025" },
    { label: "Fevereiro 2025", value: "Fevereiro 2025" },
  ]);

  const dadosLinha = {
    labels: ["Dez", "Jan", "Fev", "Mar", "Abr"],
    datasets: [{ data: [500, 2000, 1000, 1700, 2500] }],
  };

  const dadosPizza = [
    { name: "Alimentação", amount: 600, color: "#f57c00" },
    { name: "Transporte", amount: 400, color: "#2ecc71" },
    { name: "Lazer", amount: 150, color: "#f1c40f" },
    { name: "Outros", amount: 100, color: "#2980b9" },
  ];

  const screenWidth = Dimensions.get("window").width - 48;

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => "#1DB954",
    labelColor: () => "#555",
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#1DB954",
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Mês Dropdown */}
      <View style={{ zIndex: 1000 }}>
        <DropDownPicker
          open={open}
          value={mes}
          items={meses}
          setOpen={setOpen}
          setValue={setMes}
          setItems={setMeses}
          placeholder="Selecione o mês"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {/* Gráfico de Linha */}
      <Text style={styles.subtitulo}>Despesas do mês</Text>
      <LineChart
        data={dadosLinha}
        width={screenWidth}
        height={200}
        yAxisLabel="R$ "
        chartConfig={chartConfig}
        bezier
        style={styles.grafico}
      />

      {/* Gráfico de Pizza + Legenda */}
      <Text style={[styles.subtitulo, { marginTop: 24 }]}>
        Total por categoria
      </Text>
      <GraficoPizza dados={dadosPizza} />
      <LegendaPizza dados={dadosPizza} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  dropdown: {
    borderColor: "#ccc",
    minHeight: 48,
    marginBottom: Platform.OS === "android" ? 8 : 24,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    zIndex: 1000,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  grafico: {
    borderRadius: 8,
    marginBottom: 24,
  },
});
