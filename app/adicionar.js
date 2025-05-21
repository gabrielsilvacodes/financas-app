import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function AdicionarGasto() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Adicionar Gasto",
      headerStyle: { backgroundColor: "#1DB954" },
      headerTintColor: "#fff",
      headerBackVisible: true,
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, []);

  // Formulário
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("10/04/2025");

  // Dropdown categoria
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState("Alimentação");
  const [categorias, setCategorias] = useState([
    { label: "Alimentação", value: "Alimentação" },
    { label: "Transporte", value: "Transporte" },
    { label: "Lazer", value: "Lazer" },
    { label: "Outros", value: "Outros" },
  ]);

  const handleSalvar = () => {
    console.log({ valor, descricao, categoria, data });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Valor*</Text>
      <View style={styles.valorWrapper}>
        <Text style={styles.prefixo}>R$</Text>
        <TextInput
          style={styles.valorInput}
          placeholder="0,00"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />
      </View>

      <Text style={styles.label}>Descrição*</Text>
      <TextInput
        style={styles.input}
        placeholder="Adicione uma descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

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
      />

      <Text style={styles.label}>Data*</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        value={data}
        onChangeText={setData}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    zIndex: 10, // necessário para DropDownPicker
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    marginTop: 12,
  },
  valorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  prefixo: {
    marginRight: 8,
    fontWeight: "bold",
    fontSize: 16,
    color: "#444",
  },
  valorInput: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  dropdown: {
    borderColor: "#ddd",
    borderRadius: 6,
    minHeight: 48,
    marginBottom: 16,
  },
  dropdownContainer: {
    borderColor: "#ddd",
    borderRadius: 6,
  },
  botao: {
    marginTop: 24,
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
