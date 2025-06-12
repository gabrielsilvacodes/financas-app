import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";
import { formataValor } from "../utils/formatacao";

/**
 * Legenda associada ao gráfico de pizza.
 * Aceita props.dados como [{ name, amount/population, color }]
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

/**
 * Item individual da legenda: cor, nome e valor.
 */
function LegendaItem({ nome, cor, valor }) {
  // Compatível com amount ou population
  const valorNumerico = Number(valor) || 0;
  const valorFormatado = useMemo(
    () => formataValor(valorNumerico),
    [valorNumerico]
  );

  return (
    <View
      style={styles.item}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Categoria ${
        nome || "sem nome"
      }, valor ${valorFormatado}`}
      testID={`legenda-item-${(nome || "sem-nome")
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      <View
        style={[
          styles.bolinha,
          { backgroundColor: cor || COLORS.categoria?.outros || COLORS.verde },
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
      <Text style={styles.valor}>{valorFormatado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 24,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    minWidth: 150,
    maxWidth: 230,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.neutroClaro,
    borderColor: COLORS.borda,
    borderWidth: 1,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bolinha: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.borda,
    alignSelf: "center",
  },
  nome: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textoPrincipal,
    fontWeight: "500",
    paddingRight: 8,
  },
  valor: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.verdeEscuro ?? COLORS.verde,
    textAlign: "right",
    minWidth: 64,
  },
});
