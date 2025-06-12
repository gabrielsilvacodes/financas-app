import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import COLORS from "../constants/colors";

export default function Layout() {
  return (
    <View style={styles.root} testID="layout-root">
      {/* StatusBar sempre overlay para fundo "clean" */}
      <StatusBar
        style={Platform.OS === "ios" ? "dark" : "light"}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            gestureEnabled: true,
            contentStyle: {
              backgroundColor: COLORS.neutroClaro || "#F5F5F5",
            },
          }}
          testID="layout-stack"
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.neutroClaro || "#F5F5F5",
  },
  safe: {
    flex: 1,
  },
});
