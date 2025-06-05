import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import COLORS from "../constants/colors";

export default function Layout() {
  return (
    <>
      {/* Barra de status com estilo adaptado por plataforma */}
      <StatusBar
        style={Platform.OS === "ios" ? "dark" : "light"}
        backgroundColor={COLORS.branco}
      />

      <Stack
        screenOptions={{
          headerShown: false, // Cabeçalho customizado, usamos <Header />
          animation: "slide_from_right", // Transição moderna
          gestureEnabled: true, // Permite gestos de navegação
          contentStyle: {
            backgroundColor: COLORS.branco, // Fundo padrão
          },
        }}
      />
    </>
  );
}
