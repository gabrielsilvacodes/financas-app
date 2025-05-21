// app/_layout.js
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import COLORS from "../constants/colors";

export default function Layout() {
  return (
    <>
      {/* Aplica estilo global da status bar */}
      <StatusBar style={Platform.OS === "ios" ? "dark" : "light"} />

      <Stack
        screenOptions={{
          headerShown: false, // Remove o header nativo do React Navigation
          animation: "slide_from_right",
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: COLORS.branco,
          },
        }}
      />
    </>
  );
}
