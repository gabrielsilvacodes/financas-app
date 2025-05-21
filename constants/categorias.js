import COLORS from "./colors"; // Centralização das cores

export const CATEGORIAS = [
  {
    id: "1",
    nome: "Alimentação",
    cor: COLORS.alerta, // Evita cor "hardcoded"
  },
  {
    id: "2",
    nome: "Transporte",
    cor: COLORS.transporte,
  },
  {
    id: "3",
    nome: "Lazer",
    cor: COLORS.lazer,
  },
  {
    id: "4",
    nome: "Outros",
    cor: COLORS.outros,
  },
];
