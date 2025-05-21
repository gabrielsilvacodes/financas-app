import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";

import GraficoPizza from "../components/GraficoPizza";
import LegendaPizza from "../components/LegendaPizza";
import COLORS from "../constants/colors";

export default function Estatisticas() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Estatísticas",
      headerStyle: { backgroundColor: COLORS.verde },
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
    { name: "Alimentação", amount: 600, color: COLORS.alerta },
    { name: "Transporte", amount: 400, color: COLORS.transporte },
    { name: "Lazer", amount: 150, color: COLORS.lazer },
    { name: "Outros", amount: 100, color: COLORS.outros },
  ];

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => COLORS.verde,
    labelColor: () => "#555",
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: COLORS.verde,
    },
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: width < 360 ? 16 : 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Mês Dropdown */}
      <View style={styles.dropdownWrapper}>
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
          accessibilityLabel="Selecionar mês para análise"
        />
      </View>

      {/* Gráfico de Linha */}
      <View style={styles.bloco}>
        <Text style={styles.subtitulo} accessibilityRole="header">
          Despesas do mês
        </Text>
        <LineChart
          data={dadosLinha}
          width={width - 48}
          height={200}
          yAxisLabel="R$ "
          chartConfig={chartConfig}
          bezier
          style={styles.grafico}
          accessibilityLabel="Gráfico de linha com histórico mensal de gastos"
          accessibilityRole="image"
        />
      </View>

      {/* Gráfico de Pizza + Legenda */}
      <View style={styles.bloco}>
        <Text style={styles.subtitulo} accessibilityRole="header">
          Distribuição por categoria
        </Text>
        <GraficoPizza dados={dadosPizza} />
        <LegendaPizza dados={dadosPizza} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: COLORS.branco,
  },
  dropdownWrapper: {
    zIndex: 1000,
    marginBottom: 24,
  },
  dropdown: {
    borderColor: COLORS.borda,
    minHeight: 48,
  },
  dropdownContainer: {
    borderColor: COLORS.borda,
  },
  bloco: {
    marginBottom: 32,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    marginBottom: 12,
  },
  grafico: {
    borderRadius: 8,
    marginTop: 8,
  },
});
