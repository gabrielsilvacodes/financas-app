import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../components/Header";
import COLORS from "../constants/colors";

export default function AdicionarGasto() {
  const { width } = useWindowDimensions();

  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState("Alimentação");
  const [categorias, setCategorias] = useState([
    { label: "Alimentação", value: "Alimentação" },
    { label: "Transporte", value: "Transporte" },
    { label: "Lazer", value: "Lazer" },
    { label: "Outros", value: "Outros" },
  ]);

  const handleSalvar = () => {
    if (!valor || !descricao || !data) {
      return Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos marcados com *."
      );
    }

    console.log({ valor, descricao, categoria, data });
    Alert.alert("Sucesso", "Gasto adicionado com sucesso!");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <Header titulo="Adicionar Gasto" mostrarVoltar />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: width < 360 ? 16 : 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* VALOR */}
        <Text style={styles.label}>Valor*</Text>
        <View style={styles.valorWrapper}>
          <Text style={styles.prefixo}>R$</Text>
          <TextInput
            style={styles.valorInput}
            placeholder="0,00"
            keyboardType="decimal-pad"
            returnKeyType="next"
            value={valor}
            onChangeText={setValor}
            blurOnSubmit={false}
            accessibilityLabel="Campo de valor"
            accessibilityHint="Informe o valor do gasto"
          />
        </View>

        {/* DESCRIÇÃO */}
        <Text style={styles.label}>Descrição*</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Farmácia, Padaria..."
          value={descricao}
          onChangeText={setDescricao}
          returnKeyType="next"
          blurOnSubmit={false}
          accessibilityLabel="Campo de descrição"
          accessibilityHint="Informe o que foi comprado"
        />

        {/* CATEGORIA */}
        <Text style={styles.label}>Categoria*</Text>
        <DropDownPicker
          open={open}
          value={categoria}
          items={categorias}
          setOpen={setOpen}
          setValue={setCategoria}
          setItems={setCategorias}
          placeholder="Selecione uma categoria"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
          accessibilityLabel="Campo de categoria"
          accessibilityHint="Escolha uma categoria para o gasto"
        />

        {/* DATA */}
        <Text style={styles.label}>Data*</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={data}
          onChangeText={setData}
          returnKeyType="done"
          accessibilityLabel="Campo de data"
          accessibilityHint="Informe a data do gasto"
        />

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.botao}
          onPress={handleSalvar}
          accessibilityRole="button"
          accessibilityLabel="Salvar gasto"
          accessibilityHint="Toque para salvar o novo gasto"
        >
          <Text style={styles.botaoTexto}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.branco,
  },
  container: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  label: {
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 4,
    marginTop: 12,
    fontSize: 15,
  },
  valorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borda,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: COLORS.branco,
  },
  prefixo: {
    marginRight: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: COLORS.cinzaTexto,
  },
  valorInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textoPrincipal,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borda,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: COLORS.branco,
    color: COLORS.textoPrincipal,
  },
  dropdown: {
    borderColor: COLORS.borda,
    borderRadius: 6,
    minHeight: 48,
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: COLORS.borda,
    borderRadius: 6,
  },
  botao: {
    marginTop: 24,
    backgroundColor: COLORS.verde,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 48,
  },
  botaoTexto: {
    color: COLORS.branco,
    fontWeight: "bold",
    fontSize: 16,
  },
});
