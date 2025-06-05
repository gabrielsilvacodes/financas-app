import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

// Chave usada para armazenar transações
const CHAVE_TRANSACOES = "@financas:transacoes";

/**
 * Salva o array completo de transações no AsyncStorage.
 * @param {Array} dados - Lista de transações a serem salvas.
 */
export async function salvarDados(dados) {
  try {
    const json = JSON.stringify(dados);
    await AsyncStorage.setItem(CHAVE_TRANSACOES, json);
  } catch (error) {
    console.error("❌ Erro ao salvar dados no AsyncStorage:", error);
    throw error;
  }
}

/**
 * Carrega os dados armazenados, adicionando IDs faltantes se necessário.
 * @returns {Array} - Lista de transações.
 */
export async function carregarDados() {
  try {
    const json = await AsyncStorage.getItem(CHAVE_TRANSACOES);
    const dados = json ? JSON.parse(json) : [];

    let precisaAtualizar = false;

    const dadosCorrigidos = dados.map((item) => {
      if (!item.id) {
        precisaAtualizar = true;
        return { ...item, id: uuidv4() };
      }
      return item;
    });

    if (precisaAtualizar) {
      await salvarDados(dadosCorrigidos);
    }

    return dadosCorrigidos;
  } catch (error) {
    console.error("❌ Erro ao carregar dados do AsyncStorage:", error);
    return [];
  }
}

/**
 * Remove todos os dados salvos (usado para testes ou redefinição).
 */
export async function limparDados() {
  try {
    await AsyncStorage.removeItem(CHAVE_TRANSACOES);
    console.log("✅ Dados limpos com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao limpar dados:", error);
  }
}

/**
 * Busca uma transação pelo ID.
 * @param {string} id - ID da transação.
 * @returns {object|null} - Transação encontrada ou null.
 */
export async function buscarPorId(id) {
  const dados = await carregarDados();
  return dados.find((item) => item.id === id) || null;
}

/**
 * Remove uma transação específica pelo ID.
 * @param {string} id - ID da transação a ser removida.
 * @returns {boolean} - Indica se a remoção foi bem-sucedida.
 */
export async function removerTransacao(id) {
  try {
    const dados = await carregarDados();
    const atualizados = dados.filter((item) => item.id !== id);
    await salvarDados(atualizados);
    return true;
  } catch (error) {
    console.error("❌ Erro ao remover transação:", error);
    return false;
  }
}

/**
 * Atualiza uma transação existente.
 * @param {object} transacaoAtualizada - Transação com o mesmo ID da original.
 * @returns {boolean} - Indica se a atualização foi bem-sucedida.
 */
export async function atualizarTransacao(transacaoAtualizada) {
  try {
    const dados = await carregarDados();
    const atualizados = dados.map((item) =>
      item.id === transacaoAtualizada.id ? transacaoAtualizada : item
    );
    await salvarDados(atualizados);
    return true;
  } catch (error) {
    console.error("❌ Erro ao atualizar transação:", error);
    return false;
  }
}
