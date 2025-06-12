import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { CATEGORIAS_PADRAO } from "../constants/categorias";
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

async function carregarJson(chave, fallback = {}) {
  try {
    const json = await AsyncStorage.getItem(chave);
    if (!json) return fallback;
    const dados = JSON.parse(json);
    if (typeof dados === "object" && dados !== null) return dados;
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

  const corrigidos = dados.map((t) => {
    const novaTransacao = { ...t };

    // Corrige transações sem ID
    if (!novaTransacao.id) {
      novaTransacao.id = uuidv4();
      precisaAtualizar = true;
    }

    // Corrige formato da categoria (de string para objeto com chave)
    if (typeof novaTransacao.categoria === "string") {
      novaTransacao.categoria = { chave: novaTransacao.categoria };
      precisaAtualizar = true;
    }

    return novaTransacao;
  });

  if (precisaAtualizar) {
    await salvarDados(corrigidos);
  }

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

export async function salvarCategorias(objetoCategorias) {
  if (
    !objetoCategorias ||
    typeof objetoCategorias !== "object" ||
    (!Array.isArray(objetoCategorias.entrada) &&
      !Array.isArray(objetoCategorias.saida))
  ) {
    throw new Error(
      "❌ O objeto de categorias deve conter arrays 'entrada' e/ou 'saida'."
    );
  }

  return await salvarJson(CHAVE_CATEGORIAS, objetoCategorias);
}

export async function carregarCategorias() {
  const categorias = await carregarJson(CHAVE_CATEGORIAS, null);

  if (!categorias || !categorias.entrada || !categorias.saida) {
    // Se não houver categorias, salva as padrão
    await salvarCategorias(CATEGORIAS_PADRAO);
    return CATEGORIAS_PADRAO;
  }

  return categorias;
}

export async function limparCategorias() {
  await removerItem(CHAVE_CATEGORIAS);
}
