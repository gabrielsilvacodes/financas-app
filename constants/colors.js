// constants/colors.js

const COLORS = {
  // 🌑 Base
  branco: "#FFFFFF",
  preto: "#000000",

  // 📝 Texto
  textoPrincipal: "#222222", // Principal para textos
  textoSecundario: "#555555", // Para descrições e info secundária
  cinzaTexto: "#888888", // Subtítulos, dicas, campos desabilitados

  // 🎨 Fundos e áreas neutras
  cinzaClaro: "#F9F9F9", // Fundo de input ou áreas claras
  neutroClaro: "#F5F5F5", // Cards, áreas secundárias, tooltips
  fundoClaro: "#F5F5F5", // Alias para uso em vários componentes (mantém consistência)

  // 🎯 Ações e status
  verde: "#1DB954", // Confirmação, sucesso, entrada
  verdeEscuro: "#2D6A4F", // Botões principais, destaques
  verdeClaro: "#B7E4C7", // Destaques, gráfico ativo, toggles (adicione se não existir!)
  vermelho: "#E74C3C", // Erro, alerta, deletar, saída
  amarelo: "#F1C40F", // Avisos, atenção

  // 🔲 Estrutura e UI
  borda: "#E0E0E0", // Delimitações sutis
  overlay: "rgba(0, 0, 0, 0.1)", // Sobreposição leve (modais)
  sombraLeve: "rgba(0, 0, 0, 0.05)",

  // 🎨 Cores por categoria (usadas em gráficos, badges, etc)
  categoria: {
    alimentacao: "#F4A261", // Laranja queimado
    transporte: "#2A9D8F", // Verde água
    lazer: "#E9C46A", // Amarelo claro
    outros: "#264653", // Azul petróleo (padrão fallback)
  },

  // 🧪 Paleta extra para novas categorias ou temas futuros
  paletaExtra: [
    "#2D6A4F", // Verde musgo
    "#F4A261", // Laranja queimado
    "#E76F51", // Vermelho terroso
    "#1C1C1E", // Cinza escuro
    "#F5F5F5", // Neutro claro
    "#2196F3", // Azul vibrante
    "#9C27B0", // Roxo moderno
  ],
};

export default COLORS;
