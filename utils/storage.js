import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import STORAGE_KEYS from "../constants/storageKeys";

const CHAVE_TRANSACOES = STORAGE_KEYS.TRANSACOES;
const CHAVE_CATEGORIAS = STORAGE_KEYS.CATEGORIAS;

/* ====================================================== */
/* 🔧 UTILITÁRIOS GENÉRICOS: Leitura e Escrita de JSON     */
/* ====================================================== */

async function salvarJson(chave, dados) {
  try {
    const json = JSON.stringify(dados);
    await AsyncStorage.setItem(chave, json);
    return dados;
  } catch (error) {
    console.error(`❌ Falha ao salvar dados em "${chave}":`, error);
    throw new Error(`Erro ao salvar dados: ${chave}`);
  }
}

async function carregarJson(chave, fallback = []) {
  try {
    const json = await AsyncStorage.getItem(chave);
    if (!json) return fallback;
    const dados = JSON.parse(json);
    if (Array.isArray(dados)) return dados;
    // Se por algum motivo veio um objeto/valor inválido, retorna fallback
    return fallback;
  } catch (error) {
    console.error(`❌ Falha ao carregar dados de "${chave}":`, error);
    return fallback;
  }
}

async function removerItem(chave) {
  try {
    await AsyncStorage.removeItem(chave);
    // console.log(`🧹 Dados removidos: ${chave}`); // Remover em prod
  } catch (error) {
    console.error(`❌ Erro ao remover "${chave}":`, error);
  }
}

/* ======================================== */
/* 💸 TRANSAÇÕES FINANCEIRAS (CRUD LOCAL)  */
/* ======================================== */

export async function salvarDados(transacoes) {
  if (!Array.isArray(transacoes)) {
    throw new Error("❌ As transações devem estar em um array.");
  }
  // Filtra para garantir que só objetos válidos sejam salvos
  const limpos = transacoes.filter(Boolean);
  return await salvarJson(CHAVE_TRANSACOES, limpos);
}

export async function carregarDados(fallback = []) {
  const dados = await carregarJson(CHAVE_TRANSACOES, fallback);
  let precisaAtualizar = false;

  // Corrige transações sem ID (legado)
  const corrigidos = dados.map((t) => {
    if (!t?.id) {
      precisaAtualizar = true;
      return { ...t, id: uuidv4() };
    }
    return t;
  });

  // Salva os corrigidos apenas se necessário
  if (precisaAtualizar) await salvarDados(corrigidos);
  return corrigidos;
}

export async function limparDados() {
  await removerItem(CHAVE_TRANSACOES);
}

export async function buscarPorId(id) {
  if (!id) return null;
  const dados = await carregarDados();
  return dados.find((t) => t.id === id) || null;
}

export async function removerTransacao(id) {
  try {
    const dados = await carregarDados();
    const atualizados = dados.filter((t) => t.id !== id);
    if (dados.length === atualizados.length) return false;
    await salvarDados(atualizados);
    return true;
  } catch (error) {
    console.error("❌ Erro ao remover transação:", error);
    return false;
  }
}

export async function atualizarTransacao(transacaoAtualizada) {
  try {
    if (!transacaoAtualizada?.id) throw new Error("Transação sem ID");
    const dados = await carregarDados();
    const atualizados = dados.map((t) =>
      t.id === transacaoAtualizada.id ? transacaoAtualizada : t
    );
    await salvarDados(atualizados);
    return true;
  } catch (error) {
    console.error("❌ Erro ao atualizar transação:", error);
    return false;
  }
}

/* ====================================== */
/* 🎨 CATEGORIAS PERSONALIZADAS (CRUD)   */
/* ====================================== */

export async function salvarCategorias(lista) {
  if (!Array.isArray(lista)) {
    throw new Error("❌ As categorias devem estar em um array.");
  }
  const limpos = lista.filter(Boolean);
  return await salvarJson(CHAVE_CATEGORIAS, limpos);
}

export async function carregarCategorias(fallback = []) {
  return await carregarJson(CHAVE_CATEGORIAS, fallback);
}

export async function limparCategorias() {
  await removerItem(CHAVE_CATEGORIAS);
}
