import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";

/**
 * Componente reutilizável para estados vazios (Empty State).
 */
export default function EmptyState({
  titulo = "Nenhum conteúdo encontrado",
  descricao = "Adicione novos itens para começar.",
  icone = "alert-circle-outline",
  corIcone = COLORS.cinzaTexto,
  iconSize = 56,
  children,
  role = "status",
  testID = "empty-state",
}) {
  return (
    <View
      style={styles.wrapper}
      accessible
      accessibilityRole={role}
      accessibilityLabel={`${titulo}. ${descricao}`}
      testID={testID}
    >
      <View style={styles.container}>
        <Ionicons
          name={icone}
          size={iconSize}
          color={corIcone}
          style={styles.icone}
        />

        <Text style={styles.titulo} accessibilityRole="header">
          {titulo}
        </Text>

        <Text style={styles.descricao}>{descricao}</Text>

        {children && <View style={styles.extra}>{children}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    width: "100%",
  },
  container: {
    backgroundColor: COLORS.fundoClaro || "#F5F5F5",
    borderRadius: 14,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 220,
    maxWidth: 370,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
  },
  icone: {
    marginBottom: 18,
    opacity: 0.82,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 6,
    textAlign: "center",
    maxWidth: 300,
  },
  descricao: {
    fontSize: 15,
    color: COLORS.cinzaTexto,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 22,
    marginBottom: 2,
  },
  extra: {
    marginTop: 18,
    alignItems: "center",
    width: "100%",
  },
});
