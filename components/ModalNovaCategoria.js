import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ColorPicker } from "react-native-color-picker";
import Modal from "react-native-modal";
import COLORS from "../constants/colors";

const CATEGORIAS_KEY = "@categorias_personalizadas";

export default function ModalNovaCategoria({
  visivel,
  onFechar,
  onSalvar,
  tipo = "saida",
}) {
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState(COLORS.verde);
  const [mostrarPicker, setMostrarPicker] = useState(false);

  useEffect(() => {
    if (!visivel) {
      setNome("");
      setCor(COLORS.verde);
      setMostrarPicker(false);
    }
  }, [visivel]);

  async function salvarCategoriaLocal(novaCategoria) {
    try {
      const armazenadas = await AsyncStorage.getItem(CATEGORIAS_KEY);
      const categorias = armazenadas ? JSON.parse(armazenadas) : [];

      const categoriasFiltradas = categorias.filter(
        (cat) => cat.chave !== novaCategoria.chave
      );

      const atualizadas = [...categoriasFiltradas, novaCategoria];
      await AsyncStorage.setItem(CATEGORIAS_KEY, JSON.stringify(atualizadas));
    } catch (e) {
      console.warn("Erro ao salvar categoria personalizada:", e);
      Alert.alert("Erro", "Não foi possível salvar a categoria.");
    }
  }

  const handleSalvar = async () => {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      Alert.alert("Atenção", "Informe o nome da categoria.");
      return;
    }

    const chave = nomeLimpo.toLowerCase().replace(/\s+/g, "_");

    try {
      const armazenadas = await AsyncStorage.getItem(CATEGORIAS_KEY);
      const categorias = armazenadas ? JSON.parse(armazenadas) : [];

      const duplicada = categorias.some(
        (cat) => cat.chave?.toLowerCase() === chave
      );
      if (duplicada) {
        Alert.alert("Duplicado", "Já existe uma categoria com esse nome.");
        return;
      }

      const novaCategoria = { chave, nome: nomeLimpo, cor, tipo };
      await salvarCategoriaLocal(novaCategoria);
      onSalvar(novaCategoria);
      onFechar();
    } catch (e) {
      console.warn("Erro ao verificar duplicatas:", e);
      Alert.alert("Erro", "Erro ao verificar duplicações.");
    }
  };

  return (
    <Modal
      isVisible={visivel}
      onBackdropPress={onFechar}
      onBackButtonPress={onFechar}
      useNativeDriver
      animationIn="zoomIn"
      animationOut="fadeOut"
      backdropOpacity={0.6}
      style={styles.modalRaiz}
      avoidKeyboard
      propagateSwipe
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.modal}>
          <Text style={styles.titulo} accessibilityRole="header">
            Nova Categoria {tipo === "entrada" ? "(entrada)" : "(saída)"}
          </Text>

          <Text style={styles.label}>Nome da categoria</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Farmácia, Escola..."
            placeholderTextColor={COLORS.cinzaTexto}
            maxLength={30}
            returnKeyType="done"
            autoFocus
            accessible
            accessibilityLabel="Campo nome da categoria"
          />

          <Text style={styles.label}>Cor da categoria</Text>
          <TouchableOpacity
            style={[
              styles.corPreview,
              { backgroundColor: cor, borderColor: COLORS.borda },
            ]}
            onPress={() => setMostrarPicker((v) => !v)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Escolher cor da categoria"
          >
            <View style={styles.corBola} />
            <Text style={styles.corTexto}>Escolher cor</Text>
          </TouchableOpacity>

          {mostrarPicker && (
            <View style={styles.pickerContainer}>
              <ColorPicker
                onColorSelected={(color) => {
                  setCor(color);
                  setMostrarPicker(false);
                }}
                defaultColor={cor}
                style={{ flex: 1, borderRadius: 8 }}
                hideSliders
              />
            </View>
          )}

          <View style={styles.botoes}>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={onFechar}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
            >
              <Text style={styles.txtCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoSalvar, { opacity: nome.trim() ? 1 : 0.7 }]}
              onPress={handleSalvar}
              disabled={!nome.trim()}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Salvar categoria"
            >
              <Text style={styles.txtSalvar}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRaiz: {
    justifyContent: "center",
    margin: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.textoPrincipal,
    letterSpacing: 0.2,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: COLORS.textoPrincipal,
    fontSize: 15,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.borda,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textoPrincipal,
    backgroundColor: COLORS.fundoClaro,
    marginBottom: 6,
  },
  corPreview: {
    marginTop: 3,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  corBola: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  corTexto: {
    color: COLORS.textoPrincipal,
    fontWeight: "600",
    fontSize: 15,
  },
  pickerContainer: {
    height: 180,
    marginTop: 10,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.fundoClaro,
    borderWidth: 1,
    borderColor: COLORS.borda,
    padding: 5,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
    gap: 14,
  },
  botaoCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: COLORS.neutroClaro,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borda,
  },
  txtCancelar: {
    fontWeight: "600",
    color: COLORS.textoSecundario,
    fontSize: 15,
  },
  botaoSalvar: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: COLORS.verde,
    borderRadius: 8,
    marginLeft: 5,
  },
  txtSalvar: {
    color: COLORS.branco,
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
