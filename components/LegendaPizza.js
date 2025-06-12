import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";
import { formataValor } from "../utils/formatacao";

/**
 * Legenda associada ao gráfico de pizza.
 */
export default function LegendaPizza({ dados = [] }) {
  if (!Array.isArray(dados) || dados.length === 0) return null;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="summary"
      accessibilityLabel="Legenda das categorias do gráfico de pizza"
      accessibilityHint="Lista de categorias, suas cores e valores correspondentes"
      testID="legenda-pizza"
    >
      {dados.map((item, index) => (
        <LegendaItem
          key={`${item?.name || "categoria"}-${index}`}
          nome={item?.name}
          cor={item?.color}
          valor={item?.amount ?? item?.population}
        />
      ))}
    </View>
  );
}

function LegendaItem({ nome, cor, valor }) {
  const valorNumerico = Number(valor) || 0;
  const valorFormatado = useMemo(
    () => formataValor(valorNumerico),
    [valorNumerico]
  );

  return (
    <View
      style={styles.item}
      accessible
      testID={`legenda-item-${(nome || "sem-nome")
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.bolinha,
            {
              backgroundColor: cor || COLORS.categoria?.outros || COLORS.verde,
            },
          ]}
        />
        <Text
          style={styles.nome}
          numberOfLines={1}
          ellipsizeMode="tail"
          testID="legenda-nome"
        >
          {nome || "Sem categoria"}
        </Text>
      </View>
      <Text style={styles.valor}>{valorFormatado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borda,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  bolinha: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.borda,
  },
  nome: {
    flexShrink: 1,
    fontSize: 15,
    color: COLORS.textoPrincipal,
    fontWeight: "500",
  },
  valor: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textoSecundario,
    minWidth: 72,
    textAlign: "right",
  },
});
