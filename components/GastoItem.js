import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors";
import { formatarValor } from "../utils/transacaoUtils";

export default function GastoItem({ id, data, nome, valor, categoria, tipo }) {
  const router = useRouter();

  // Converte corretamente mesmo que venha string
  const valorNumerico = Number(valor);
  const valorFormatado = !isNaN(valorNumerico)
    ? formatarValor(valorNumerico)
    : "R$ 0,00";

  const corValor = tipo === "entrada" ? COLORS.verde : COLORS.vermelho;

  const handleEditar = () => {
    router.push(`/transacoes/editar/${id}`);
  };

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${
        tipo === "entrada" ? "Entrada" : "Gasto"
      } de ${valorFormatado} com ${nome}, na categoria ${categoria}, em ${data}`}
    >
      <View style={styles.info}>
        <View style={styles.linhaTopo}>
          <Text style={styles.nome} numberOfLines={1} ellipsizeMode="tail">
            {nome}
          </Text>
          <View style={styles.badgeCategoria}>
            <Text style={styles.badgeTexto}>{categoria}</Text>
          </View>
        </View>
        <Text style={styles.data}>{data}</Text>
      </View>

      <View style={styles.direita}>
        <Text style={[styles.valor, { color: corValor }]}>
          {valorFormatado}
        </Text>
        <TouchableOpacity
          onPress={handleEditar}
          style={styles.botaoEditar}
          accessibilityLabel="Editar transação"
          accessibilityRole="button"
        >
          <Ionicons name="create-outline" size={20} color={COLORS.icone} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cinzaClaro,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 16,
    minHeight: 60,
    marginBottom: 12,
  },
  info: {
    flex: 1,
    paddingRight: 8,
  },
  linhaTopo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    flexShrink: 1,
    marginRight: 8,
  },
  badgeCategoria: {
    backgroundColor: COLORS.neutroClaro,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeTexto: {
    fontSize: 12,
    color: COLORS.textoSecundario,
  },
  data: {
    fontSize: 12,
    color: COLORS.cinzaTexto,
  },
  direita: {
    alignItems: "flex-end",
    minWidth: 90,
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoEditar: {
    marginTop: 6,
    padding: 4,
  },
});
