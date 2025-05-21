// app/estatisticas.js
import { useMemo, useState } from "react";
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
import Header from "../components/Header";
import LegendaPizza from "../components/LegendaPizza";
import COLORS from "../constants/colors";

export default function Estatisticas() {
  const { width } = useWindowDimensions();

  const [open, setOpen] = useState(false);
  const [mes, setMes] = useState("Abril 2025");
  const [meses, setMeses] = useState([
    { label: "Abril 2025", value: "Abril 2025" },
    { label: "Março 2025", value: "Março 2025" },
    { label: "Fevereiro 2025", value: "Fevereiro 2025" },
  ]);

  const dadosLinha = useMemo(
    () => ({
      labels: ["Dez", "Jan", "Fev", "Mar", "Abr"],
      datasets: [{ data: [500, 2000, 1000, 1700, 2500] }],
    }),
    []
  );

  const dadosPizza = useMemo(
    () => [
      { name: "Alimentação", amount: 600, color: COLORS.alerta },
      { name: "Transporte", amount: 400, color: COLORS.transporte },
      { name: "Lazer", amount: 150, color: COLORS.lazer },
      { name: "Outros", amount: 100, color: COLORS.outros },
    ],
    []
  );

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
    <View style={styles.container}>
      <Header titulo="Estatísticas" mostrarVoltar />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: width < 360 ? 16 : 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Filtro de Mês */}
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
            accessibilityLabel="Filtro de mês"
          />
        </View>

        {/* Gráfico de Linha */}
        <Section title="Despesas do mês" label="Seção de despesas mensais">
          <LineChart
            data={dadosLinha}
            width={width - 48}
            height={200}
            yAxisLabel="R$ "
            chartConfig={chartConfig}
            bezier
            style={styles.grafico}
            accessibilityLabel="Gráfico de linha com a evolução das despesas"
            accessibilityRole="image"
          />
        </Section>

        {/* Gráfico de Pizza + Legenda */}
        <Section
          title="Distribuição por categoria"
          label="Seção de distribuição de despesas por categoria"
        >
          <GraficoPizza dados={dadosPizza} titulo={null} />
          <LegendaPizza dados={dadosPizza} />
        </Section>
      </ScrollView>
    </View>
  );
}

// Componente de seção reutilizável
function Section({ title, label, children }) {
  return (
    <View
      style={styles.bloco}
      accessible
      accessibilityRole="header"
      accessibilityLabel={label}
    >
      <Text style={styles.subtitulo}>{title}</Text>
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  dropdownWrapper: {
    zIndex: 1000,
    marginBottom: 24,
  },
  dropdown: {
    borderColor: COLORS.borda,
    minHeight: 48,
    borderRadius: 6,
  },
  dropdownContainer: {
    borderColor: COLORS.borda,
    borderRadius: 6,
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
