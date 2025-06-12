import DateTimePicker from "@react-native-community/datetimepicker";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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

import { CATEGORIAS_PADRAO } from "../constants/categorias";
import COLORS from "../constants/colors";
import {
  carregarCategorias,
  carregarDados,
  salvarCategorias,
  salvarDados,
} from "../utils/storage";
import {
  criarTransacao,
  parseValor,
  validarCampos,
} from "../utils/transacaoUtils";
import ModalNovaCategoria from "./ModalNovaCategoria";

const OPC_NOVA_CATEGORIA = {
  label: "➕ Nova categoria...",
  value: "nova_categoria",
  cor: COLORS.cinzaClaro,
};

export default function FormTransacao({
  tipo = "saida",
  transacaoExistente,
  onSalvar,
}) {
  const { width } = useWindowDimensions();

  const [tipoSelecionado, setTipoSelecionado] = useState(tipo);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [open, setOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carrega categorias padrão + personalizadas
  const carregarCategoriasPersonalizadas = useCallback(async () => {
    try {
      const categoriasPadrao = CATEGORIAS_PADRAO[tipoSelecionado].map(
        (cat) => ({
          label: cat.nome,
          value: cat.nome,
          cor: cat.cor,
        })
      );
      const categoriasSalvas = await carregarCategorias(categoriasPadrao);

      const listaFinal = [
        ...categoriasSalvas.filter((c) => c.value !== OPC_NOVA_CATEGORIA.value),
        OPC_NOVA_CATEGORIA,
      ];

      setCategorias(listaFinal);

      if (!categoria && listaFinal.length > 0) {
        setCategoria(listaFinal[0].value);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setCategorias([OPC_NOVA_CATEGORIA]);
    }
  }, [tipoSelecionado, categoria]);

  useEffect(() => {
    carregarCategoriasPersonalizadas();
  }, [carregarCategoriasPersonalizadas]);

  useEffect(() => {
    if (transacaoExistente) {
      setValor(String(transacaoExistente.valor).replace(".", ","));
      setDescricao(transacaoExistente.titulo);
      setData(new Date(transacaoExistente.data));
      setCategoria(transacaoExistente.categoria);
      setTipoSelecionado(transacaoExistente.tipo);
    } else {
      setData(new Date());
    }
  }, [transacaoExistente]);

  // Adiciona nova categoria
  const adicionarNovaCategoria = async ({ nome, cor }) => {
    const nova = { label: nome, value: nome, cor };
    const novasCategorias = [
      ...categorias.filter((c) => c.value !== OPC_NOVA_CATEGORIA.value),
      nova,
    ];

    await salvarCategorias(novasCategorias);
    await carregarCategoriasPersonalizadas();
    setCategoria(nome); // seleciona a nova categoria automaticamente
    setMostrarModal(false);
  };

  // Handler do dropdown para abrir modal ou selecionar categoria
  const handleCategoriaChange = useCallback((value) => {
    if (value === OPC_NOVA_CATEGORIA.value) {
      setOpen(false);
      setTimeout(() => setMostrarModal(true), 250);
      // Não seleciona "nova_categoria"
    } else {
      setCategoria(value);
    }
  }, []);

  const isFormValido =
    valor &&
    descricao &&
    data &&
    categoria &&
    !loading &&
    parseValor(valor) > 0;

  const handleSalvar = async () => {
    if (!validarCampos({ valor, descricao, data })) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }
    const valorNumerico = parseValor(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert("Valor inválido", "Informe um valor maior que zero.");
      return;
    }
    if (!categoria) {
      Alert.alert("Categoria obrigatória", "Escolha uma categoria.");
      return;
    }
    setLoading(true);

    const novaTransacao = criarTransacao({
      valor,
      descricao,
      data: data.toISOString(),
      tipo: tipoSelecionado,
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
      Alert.alert(
        "Sucesso",
        transacaoExistente
          ? "Transação editada!"
          : "Transação salva com sucesso!"
      );
      if (typeof onSalvar === "function") onSalvar(novaTransacao);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.form,
          { padding: width < 360 ? 16 : 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tipo */}
        <View style={styles.tipoContainer}>
          {["entrada", "saida"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTipoSelecionado(t)}
              style={[
                styles.tipoBotao,
                {
                  backgroundColor:
                    tipoSelecionado === t
                      ? t === "entrada"
                        ? COLORS.verde
                        : COLORS.vermelho
                      : COLORS.cinzaClaro,
                  borderTopLeftRadius: t === "entrada" ? 8 : 0,
                  borderTopRightRadius: t === "saida" ? 8 : 0,
                  borderBottomLeftRadius: t === "entrada" ? 8 : 0,
                  borderBottomRightRadius: t === "saida" ? 8 : 0,
                  borderWidth: tipoSelecionado === t ? 1.5 : 1,
                  borderColor:
                    tipoSelecionado === t
                      ? t === "entrada"
                        ? COLORS.verdeEscuro
                        : COLORS.vermelho
                      : COLORS.borda,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Selecionar tipo ${t}`}
              hitSlop={8}
              disabled={loading}
              testID={`botao-tipo-${t}`}
            >
              <Text
                style={[
                  styles.tipoTexto,
                  {
                    color:
                      tipoSelecionado === t
                        ? COLORS.branco
                        : COLORS.textoPrincipal,
                  },
                ]}
              >
                {t === "entrada" ? "Entrada" : "Saída"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Valor */}
        <Text style={styles.label}>Valor*</Text>
        <View style={styles.valorContainer}>
          <Text style={styles.prefixo}>R$</Text>
          <TextInput
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
            style={[styles.input, styles.inputValor]}
            testID="input-valor"
            editable={!loading}
            accessibilityLabel="Campo valor"
            placeholderTextColor={COLORS.cinzaTexto}
          />
        </View>

        {/* Descrição */}
        <Text style={styles.label}>Descrição*</Text>
        <TextInput
          placeholder="Ex: Supermercado, Salário..."
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          testID="input-descricao"
          editable={!loading}
          accessibilityLabel="Campo descrição"
          placeholderTextColor={COLORS.cinzaTexto}
          maxLength={40}
        />

        {/* Categoria */}
        <Text style={styles.label}>Categoria*</Text>
        <DropDownPicker
          open={open}
          value={categoria === OPC_NOVA_CATEGORIA.value ? null : categoria}
          items={categorias}
          setOpen={setOpen}
          onChangeValue={handleCategoriaChange} // Essencial!
          setItems={setCategorias}
          placeholder="Selecione ou adicione uma categoria"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={Platform.OS === "ios" ? 2000 : 1000}
          disabled={loading}
        />

        <ModalNovaCategoria
          visivel={mostrarModal}
          onFechar={() => setMostrarModal(false)}
          onSalvar={adicionarNovaCategoria}
          tipo={tipoSelecionado}
        />

        {/* Data */}
        <Text style={styles.label}>Data*</Text>
        <TouchableOpacity
          onPress={() => {
            if (!mostrarPicker) setMostrarPicker(true);
          }}
          style={styles.dataBotao}
          disabled={loading}
          accessibilityLabel="Selecionar data"
        >
          <Text style={styles.dataTexto}>
            {data ? data.toLocaleDateString("pt-BR") : "Selecionar data"}
          </Text>
        </TouchableOpacity>

        {mostrarPicker &&
          (Platform.OS === "ios" ? (
            <View style={{ marginBottom: 16 }}>
              <DateTimePicker
                value={data || new Date()}
                mode="date"
                onChange={(_, selectedDate) => {
                  if (selectedDate) setData(selectedDate);
                }}
                locale="pt-BR"
              />
              <TouchableOpacity
                style={styles.pickerFechar}
                onPress={() => setMostrarPicker(false)}
                disabled={loading}
              >
                <Text style={styles.pickerFecharTexto}>Concluir</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <DateTimePicker
              value={data || new Date()}
              mode="date"
              onChange={(_, selectedDate) => {
                setMostrarPicker(false);
                if (selectedDate) setData(selectedDate);
              }}
            />
          ))}

        {/* Botão Salvar */}
        <TouchableOpacity
          onPress={handleSalvar}
          style={[
            styles.botaoSalvar,
            {
              backgroundColor:
                tipoSelecionado === "entrada" ? COLORS.verde : COLORS.vermelho,
              opacity: !isFormValido ? 0.65 : 1,
            },
          ]}
          testID="botao-salvar"
          accessibilityLabel={
            transacaoExistente ? "Salvar alterações" : "Salvar transação"
          }
          disabled={!isFormValido}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.branco} />
          ) : (
            <Text style={styles.textoSalvar}>
              {transacaoExistente ? "Salvar Alterações" : "Salvar Transação"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingBottom: 96,
    gap: 2,
  },
  label: {
    marginBottom: 5,
    marginTop: 2,
    fontWeight: "bold",
    fontSize: 15,
    color: COLORS.textoSecundario,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borda,
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: COLORS.branco,
    color: COLORS.textoPrincipal,
    transitionDuration: "120ms",
  },
  inputValor: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 19,
    marginLeft: 6,
    color: COLORS.textoPrincipal,
    backgroundColor: COLORS.branco,
  },
  valorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: COLORS.fundoClaro,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borda,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  prefixo: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.cinzaTexto,
    marginRight: 2,
  },
  tipoContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.cinzaClaro,
    borderWidth: 1,
    borderColor: COLORS.borda,
  },
  tipoBotao: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.borda,
  },
  tipoTexto: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  dropdown: {
    borderRadius: 8,
    borderColor: COLORS.borda,
    marginBottom: 16,
    minHeight: 50,
    backgroundColor: COLORS.branco,
    fontSize: 16,
  },
  dropdownContainer: {
    borderColor: COLORS.borda,
    borderRadius: 8,
    zIndex: 1000,
  },
  dataBotao: {
    borderWidth: 1,
    borderColor: COLORS.borda,
    borderRadius: 8,
    padding: 12,
    marginBottom: 26,
    backgroundColor: COLORS.branco,
    alignItems: "flex-start",
    minHeight: 48,
    justifyContent: "center",
  },
  dataTexto: {
    fontSize: 15,
    color: COLORS.textoPrincipal,
  },
  pickerFechar: {
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: COLORS.verde,
    borderRadius: 7,
  },
  pickerFecharTexto: {
    color: COLORS.branco,
    fontWeight: "bold",
    fontSize: 15,
  },
  botaoSalvar: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  textoSalvar: {
    color: COLORS.branco,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
