import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";
import { formataValor } from "../utils/formatacao";
import { parseValor } from "../utils/transacaoUtils";

/**
 * Card de resumo financeiro do mês com entradas, saídas e saldo.
 */
export default function BalanceteMensal({ transacoes = [] }) {
  const entradas = transacoes
    .filter((t) => t.tipo?.toLowerCase() === "entrada")
    .reduce((total, t) => total + parseValor(t.valor), 0);

  const saidas = transacoes
    .filter((t) => t.tipo?.toLowerCase() === "saida")
    .reduce((total, t) => total + parseValor(t.valor), 0);

  const saldo = entradas - saidas;
  const corSaldo = saldo >= 0 ? COLORS.verde : COLORS.vermelho;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="summary"
      accessibilityLabel="Resumo financeiro do mês com entradas, saídas e saldo"
      testID="balancete-mensal"
    >
      <Linha
        label="Entradas"
        valor={entradas}
        cor={COLORS.verde}
        icone="arrow-down-circle-outline"
        iconeColor={COLORS.verde}
      />
      <Linha
        label="Saídas"
        valor={saidas}
        cor={COLORS.vermelho}
        icone="arrow-up-circle-outline"
        iconeColor={COLORS.vermelho}
      />
      <View style={styles.separator} accessibilityElementsHidden />
      <Linha
        label="Saldo"
        valor={saldo}
        cor={corSaldo}
        isFinal
        icone="ellipse-outline"
        iconeColor={corSaldo}
        destaque
      />
    </View>
  );
}

/**
 * Linha individual com ícone, label e valor.
 */
function Linha({
  label,
  valor,
  cor,
  isFinal = false,
  icone,
  iconeColor,
  destaque = false,
}) {
  return (
    <View
      style={[
        styles.linha,
        isFinal && styles.linhaFinal,
        destaque && styles.saldoDestaque,
      ]}
    >
      <View style={styles.ladoEsquerdo}>
        {icone && (
          <Ionicons
            name={icone}
            size={20}
            color={iconeColor}
            style={styles.icone}
            accessibilityElementsHidden
          />
        )}
        <Text style={[styles.label, destaque && styles.saldoLabel]}>
          {label}:
        </Text>
      </View>
      <Text
        style={[styles.valor, { color: cor }, destaque && styles.saldoValor]}
      >
        {formataValor(valor)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutroClaro || "#F5F5F5",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.borda,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    minHeight: 28,
  },
  linhaFinal: {
    marginBottom: 0,
    marginTop: 8,
  },
  ladoEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icone: {
    marginRight: 8,
    opacity: 0.75,
  },
  label: {
    fontSize: 16,
    color: COLORS.textoPrincipal,
    fontWeight: "500",
  },
  valor: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  separator: {
    borderTopWidth: 1,
    borderColor: COLORS.borda,
    marginVertical: 6,
    opacity: 0.55,
  },
  // Destaques para o saldo
  saldoDestaque: {
    backgroundColor: "rgba(29,185,84,0.06)", // verde bem suave, pode customizar
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 10,
  },
  saldoLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
  },
  saldoValor: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
});
