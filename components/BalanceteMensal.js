import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";
import { formatarValor, parseValor } from "../utils/transacaoUtils";

export default function BalanceteMensal({ transacoes = [] }) {
  const entradas = transacoes
    .filter((t) => t.tipo?.toLowerCase() === "entrada")
    .reduce((total, t) => total + parseValor(t.valor), 0);

  const saidas = transacoes
    .filter((t) => t.tipo?.toLowerCase() === "saida")
    .reduce((total, t) => total + parseValor(t.valor), 0);

  const saldo = entradas - saidas;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Resumo financeiro do mês"
      accessibilityRole="summary"
    >
      <Linha label="Entradas:" valor={entradas} cor={COLORS.verde} />
      <Linha label="Saídas:" valor={saidas} cor={COLORS.vermelho} />
      <Linha
        label="Saldo:"
        valor={saldo}
        cor={saldo >= 0 ? COLORS.verde : COLORS.vermelho}
      />
    </View>
  );
}

function Linha({ label, valor, cor }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.valor, { color: cor }]}>{formatarValor(valor)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.fundoClaro,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.borda,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: COLORS.textoPrincipal,
    fontWeight: "500",
  },
  valor: {
    fontSize: 15,
    fontWeight: "600",
  },
});
