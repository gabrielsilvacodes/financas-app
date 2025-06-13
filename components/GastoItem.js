import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import COLORS from "../constants/colors";
import { formataValor } from "../utils/formatacao";

/**
 * Exibe um item da lista de transações (entrada ou saída)
 */
function GastoItem({ id, data, nome, valor, categoria, tipo }) {
  const router = useRouter();

  const valorNumerico = parseFloat(
    typeof valor === "string" ? valor.replace(",", ".") : valor
  );
  const valorFormatado = isNaN(valorNumerico)
    ? "R$ 0,00"
    : formataValor(valorNumerico);

  const corValor = tipo === "entrada" ? COLORS.verde : COLORS.vermelho;
  const corFundo = tipo === "entrada" ? COLORS.neutroClaro : COLORS.cinzaClaro;

  const nomeSeguro =
    typeof nome === "string" && nome.trim() !== "" ? nome : "Sem descrição";

  const categoriaSegura =
    typeof categoria === "string"
      ? categoria
      : typeof categoria === "object"
      ? categoria?.value || categoria?.nome || "Outros"
      : "Outros";

  const dataSegura = typeof data === "string" && data.trim() !== "" ? data : "";

  const handleEditar = () => {
    if (id) {
      router.push(`/transacoes/editar/${id}`);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: corFundo }]}
      accessible
      accessibilityRole="listitem"
      accessibilityLabel={`Transação de ${nomeSeguro} no valor de ${valorFormatado}${
        categoriaSegura ? `, categoria: ${categoriaSegura}` : ""
      }`}
      testID={`gasto-item-${id}`}
    >
      {/* Informações à esquerda: nome, categoria, data */}
      <View style={styles.info}>
        <View style={styles.topo}>
          <Text
            style={styles.nome}
            numberOfLines={1}
            ellipsizeMode="tail"
            testID="gasto-nome"
          >
            {nomeSeguro}
          </Text>

          {categoriaSegura && (
            <View
              style={[
                styles.badgeCategoria,
                { backgroundColor: COLORS.neutroClaro },
              ]}
            >
              <Text
                style={styles.badgeTexto}
                numberOfLines={1}
                ellipsizeMode="tail"
                testID="gasto-categoria"
              >
                {categoriaSegura}
              </Text>
            </View>
          )}
        </View>

        {dataSegura !== "" && (
          <Text style={styles.data} testID="gasto-data">
            {dataSegura}
          </Text>
        )}
      </View>

      {/* Lado direito: valor e botão de edição */}
      <View style={styles.ladoDireito}>
        <Text style={[styles.valor, { color: corValor }]} testID="gasto-valor">
          {valorFormatado}
        </Text>

        <TouchableOpacity
          onPress={handleEditar}
          style={styles.botaoEditar}
          accessibilityLabel={`Editar transação de ${nomeSeguro}`}
          accessibilityRole="button"
          activeOpacity={0.72}
          hitSlop={12}
          testID="gasto-editar"
        >
          <Ionicons
            name="create-outline"
            size={21}
            color={COLORS.verdeEscuro}
            style={{ opacity: 0.8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 12,
    minHeight: 62,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  info: {
    flex: 1,
    paddingRight: 10,
    minWidth: 0,
  },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 8,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    flexShrink: 1,
    maxWidth: "70%",
  },
  badgeCategoria: {
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 7,
    maxWidth: 110,
  },
  badgeTexto: {
    fontSize: 12,
    color: COLORS.textoSecundario,
    textAlign: "center",
    fontWeight: "500",
    flexShrink: 1,
  },
  data: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
    marginTop: 2,
  },
  ladoDireito: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 80,
    marginLeft: 12,
  },
  valor: {
    fontSize: 15.5,
    fontWeight: "bold",
    marginBottom: 3,
    letterSpacing: 0.1,
  },
  botaoEditar: {
    marginTop: 2,
    padding: 7,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 36,
    minHeight: 36,
  },
});

export default memo(GastoItem);
