import { useEffect, useState } from "react";
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

import COLORS from "../constants/colors";
import { carregarDados, salvarDados } from "../utils/storage";
import {
  criarTransacao,
  dataEhValida,
  parseValor,
  validarCampos,
} from "../utils/transacaoUtils";

export default function FormTransacao({
  tipo = "saida",
  transacaoExistente,
  onSalvar,
}) {
  const { width } = useWindowDimensions();

  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("Alimentação");
  const [open, setOpen] = useState(false);
  const [categorias, setCategorias] = useState([
    { label: "Alimentação", value: "Alimentação" },
    { label: "Transporte", value: "Transporte" },
    { label: "Lazer", value: "Lazer" },
    { label: "Outros", value: "Outros" },
  ]);

  useEffect(() => {
    if (transacaoExistente) {
      setValor(String(transacaoExistente.valor));
      setDescricao(transacaoExistente.titulo);
      setData(new Date(transacaoExistente.data).toLocaleDateString("pt-BR"));
      setCategoria(transacaoExistente.categoria);
    }
  }, [transacaoExistente]);

  const handleSalvar = async () => {
    if (!validarCampos({ valor, descricao, data })) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    const valorNumerico = parseValor(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert("Valor inválido", "Informe um valor válido maior que zero.");
      return;
    }

    if (!dataEhValida(data)) {
      Alert.alert("Data inválida", "Use o formato DD/MM/AAAA.");
      return;
    }

    const novaTransacao = criarTransacao({
      valor,
      descricao,
      data,
      tipo,
      categoria,
      idExistente: transacaoExistente?.id,
    });

    try {
      const existentes = await carregarDados();
      const atualizadas = transacaoExistente
        ? existentes.map((t) =>
            t.id === transacaoExistente.id ? novaTransacao : t
          )
        : [...existentes, novaTransacao];

      await salvarDados(atualizadas);
      Alert.alert("Sucesso", "Transação salva com sucesso!");

      // ✅ Aqui está o ajuste: passando a transação de volta
      if (typeof onSalvar === "function") onSalvar(novaTransacao);
    } catch (e) {
      console.error("Erro ao salvar transação:", e);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: width < 360 ? 16 : 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Valor*</Text>
        <View style={styles.valorWrapper}>
          <Text style={styles.prefixo}>R$</Text>
          <TextInput
            style={styles.valorInput}
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
          />
        </View>

        <Text style={styles.label}>Descrição*</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Salário, Supermercado..."
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
          placeholder="Selecione a categoria"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={Platform.OS === "ios" ? 2000 : 1000}
        />

        <Text style={styles.label}>Data*</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={data}
          onChangeText={setData}
        />

        <TouchableOpacity
          style={[
            styles.botao,
            {
              backgroundColor:
                tipo === "entrada" ? COLORS.verde : COLORS.vermelho,
            },
          ]}
          onPress={handleSalvar}
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
    backgroundColor: COLORS.branco,
    color: COLORS.textoPrincipal,
    marginBottom: 8,
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
