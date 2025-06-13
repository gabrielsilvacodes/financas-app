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
    return typeof dados === "object" && dados !== null ? dados : fallback;
  } catch (error) {
    console.error(`❌ Falha ao carregar dados de "${chave}":`, error);
    return fallback;
  }
}

async function removerItem(chave) {
  try {
    await AsyncStorage.removeItem(chave);
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

  const limpos = transacoes.filter(Boolean);
  return await salvarJson(CHAVE_TRANSACOES, limpos);
}

export async function carregarDados(fallback = []) {
  const dados = await carregarJson(CHAVE_TRANSACOES, fallback);
  let precisaAtualizar = false;

  const corrigidos = dados.map((t) => {
    const nova = { ...t };

    if (!nova.id) {
      nova.id = uuidv4();
      precisaAtualizar = true;
    }

    return nova;
  });

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

  const normalizar = (lista) =>
    (lista || []).map((cat) => ({
      label: cat.label || cat.nome || "Sem nome",
      value: cat.value || cat.nome || "",
      cor: cat.cor || COLORS.cinzaClaro,
      key: cat.key || (cat.nome || "").toLowerCase().replace(/\s+/g, "_"),
    }));

  const resultado = {
    entrada: normalizar(objetoCategorias.entrada),
    saida: normalizar(objetoCategorias.saida),
  };

  return await salvarJson(CHAVE_CATEGORIAS, resultado);
}

export async function carregarCategorias() {
  const categorias = await carregarJson(CHAVE_CATEGORIAS, null);

  if (
    !categorias ||
    !Array.isArray(categorias.entrada) ||
    !Array.isArray(categorias.saida)
  ) {
    await salvarCategorias(CATEGORIAS_PADRAO);
    return CATEGORIAS_PADRAO;
  }

  return categorias;
}

export async function limparCategorias() {
  await removerItem(CHAVE_CATEGORIAS);
}
