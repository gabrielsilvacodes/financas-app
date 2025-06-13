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
  key: "nova_categoria",
};

// Função utilitária para garantir estrutura única de categoria
const normalizarCategoria = (cat, idx = 0) => ({
  label: cat.label || cat.nome || `Categoria ${idx + 1}`,
  value: cat.value || cat.nome || `valor-${idx + 1}`,
  cor: cat.cor || COLORS.cinzaClaro,
  key: cat.key || cat.value || cat.nome || `cat-${idx + 1}`,
});

export default function FormTransacao({
  tipo = "saida",
  transacaoExistente,
  onSalvar,
}) {
  const { width } = useWindowDimensions();
  const [tipoSelecionado, setTipoSelecionado] = useState(tipo);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date());
  const [categoria, setCategoria] = useState(null);
  const [open, setOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregamento robusto de categorias (padrão + personalizadas, sem duplicatas)
  const carregarCategoriasPersonalizadas = useCallback(async () => {
    try {
      const padrao = (CATEGORIAS_PADRAO[tipoSelecionado] || []).map(
        normalizarCategoria
      );

      const salvas = await carregarCategorias();
      const personalizadasRaw = salvas?.[tipoSelecionado] || [];
      const personalizadas = personalizadasRaw.map(normalizarCategoria);

      // Remover duplicadas (pelo value)
      const todas = [...personalizadas, ...padrao].filter(
        (cat, idx, arr) => arr.findIndex((c) => c.value === cat.value) === idx
      );

      const listaFinal = [...todas, OPC_NOVA_CATEGORIA];
      setCategorias(listaFinal);

      // Se a categoria atual não existe mais, ou não está definida, selecione a primeira
      if (!categoria || !listaFinal.find((c) => c.value === categoria)) {
        const primeira = listaFinal.find(
          (c) => c.value !== OPC_NOVA_CATEGORIA.value
        );
        setCategoria(primeira?.value || null);
      }
    } catch (error) {
      setCategorias([OPC_NOVA_CATEGORIA]);
      setCategoria(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoSelecionado]);

  // Carrega categorias sempre que tipo muda ou modal fecha
  useEffect(() => {
    carregarCategoriasPersonalizadas();
    // eslint-disable-next-line
  }, [carregarCategoriasPersonalizadas, mostrarModal]);

  // Ao receber uma transação existente (edição)
  useEffect(() => {
    if (transacaoExistente) {
      setValor(String(transacaoExistente.valor).replace(".", ","));
      setDescricao(transacaoExistente.titulo);
      setData(new Date(transacaoExistente.data));
      setCategoria(
        typeof transacaoExistente.categoria === "object"
          ? transacaoExistente.categoria?.value ||
              transacaoExistente.categoria?.chave
          : transacaoExistente.categoria
      );
      setTipoSelecionado(transacaoExistente.tipo);
    }
  }, [transacaoExistente]);

  // Sempre que mudar tipo, reseta para a primeira categoria válida
  useEffect(() => {
    if (categorias.length > 0) {
      const primeira = categorias.find(
        (c) => c.value !== OPC_NOVA_CATEGORIA.value
      );
      setCategoria(primeira?.value || null);
    }
    // eslint-disable-next-line
  }, [tipoSelecionado]);

  // Adicionar nova categoria (já seleciona a recém-criada)
  const adicionarNovaCategoria = async ({ nome, cor }) => {
    const nova = {
      label: nome,
      value: nome,
      cor,
      key: nome.toLowerCase().replace(/\s+/g, "-"),
    };

    const salvas = await carregarCategorias();
    const atualizadas = [...(salvas?.[tipoSelecionado] || []), nova];

    await salvarCategorias({
      ...salvas,
      [tipoSelecionado]: atualizadas,
    });

    setMostrarModal(false);
    await carregarCategoriasPersonalizadas();
    setCategoria(nova.value);
  };

  // Ao trocar categoria no picker
  const handleCategoriaChange = (value) => {
    if (value === OPC_NOVA_CATEGORIA.value) {
      setOpen(false);
      setTimeout(() => setMostrarModal(true), 200);
    } else {
      setCategoria(value);
    }
  };

  const isFormValido =
    valor &&
    descricao &&
    data &&
    categoria &&
    !loading &&
    parseValor(valor) > 0;

  // Salvamento robusto
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

    setLoading(true);
    const categoriaObj = categorias.find((c) => c.value === categoria);

    const novaTransacao = criarTransacao({
      valor,
      descricao,
      data: data.toISOString(),
      tipo: tipoSelecionado,
      categoria: categoriaObj,
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
      onSalvar?.(novaTransacao);
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
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.form,
          { padding: width < 360 ? 16 : 24 },
        ]}
      >
        {/* Botões tipo entrada/saída */}
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
                },
              ]}
              disabled={loading}
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

        {/* Campo valor */}
        <Text style={styles.label}>Valor*</Text>
        <View style={styles.valorContainer}>
          <Text style={styles.prefixo}>R$</Text>
          <TextInput
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={setValor}
            style={[styles.input, styles.inputValor]}
            editable={!loading}
            placeholderTextColor={COLORS.cinzaTexto}
          />
        </View>

        {/* Campo descrição */}
        <Text style={styles.label}>Descrição*</Text>
        <TextInput
          placeholder="Ex: Mercado, Salário..."
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          editable={!loading}
          maxLength={40}
          placeholderTextColor={COLORS.cinzaTexto}
        />

        {/* Dropdown de categorias */}
        <Text style={styles.label}>Categoria*</Text>
        <DropDownPicker
          open={open}
          value={categoria}
          items={categorias}
          setOpen={setOpen}
          onChangeValue={handleCategoriaChange}
          setItems={setCategorias}
          placeholder="Selecione ou adicione uma categoria"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          listMode="SCROLLVIEW"
          zIndex={2000}
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
          onPress={() => setMostrarPicker(true)}
          style={styles.dataBotao}
          disabled={loading}
        >
          <Text style={styles.dataTexto}>
            {data ? data.toLocaleDateString("pt-BR") : "Selecionar data"}
          </Text>
        </TouchableOpacity>

        {mostrarPicker &&
          (Platform.OS === "ios" ? (
            <View style={{ marginBottom: 16 }}>
              <DateTimePicker
                value={data}
                mode="date"
                onChange={(_, selectedDate) =>
                  selectedDate && setData(selectedDate)
                }
                locale="pt-BR"
              />
              <TouchableOpacity
                style={styles.pickerFechar}
                onPress={() => setMostrarPicker(false)}
              >
                <Text style={styles.pickerFecharTexto}>Concluir</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <DateTimePicker
              value={data}
              mode="date"
              onChange={(_, selectedDate) => {
                setMostrarPicker(false);
                selectedDate && setData(selectedDate);
              }}
            />
          ))}

        {/* Botão salvar */}
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
  form: { paddingBottom: 96, gap: 2 },
  label: { marginBottom: 5, marginTop: 2, fontWeight: "bold", fontSize: 15 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borda,
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: COLORS.branco,
    color: COLORS.textoPrincipal,
  },
  inputValor: { flex: 1, fontWeight: "bold", fontSize: 19, marginLeft: 6 },
  valorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borda,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  prefixo: { fontWeight: "600", fontSize: 16, marginRight: 2 },
  tipoContainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderRadius: 8,
    overflow: "hidden",
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
  tipoTexto: { fontWeight: "bold", textAlign: "center", fontSize: 16 },
  dropdown: {
    borderRadius: 8,
    borderColor: COLORS.borda,
    marginBottom: 16,
    minHeight: 50,
    backgroundColor: COLORS.branco,
  },
  dropdownContainer: { borderColor: COLORS.borda, borderRadius: 8 },
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
  dataTexto: { fontSize: 15, color: COLORS.textoPrincipal },
  pickerFechar: {
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: COLORS.verde,
    borderRadius: 7,
  },
  pickerFecharTexto: { color: COLORS.branco, fontWeight: "bold", fontSize: 15 },
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
  },
});
