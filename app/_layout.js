import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import COLORS from "../constants/colors";

export default function Layout() {
  return (
    <View style={styles.root} testID="layout-root">
      {/* StatusBar com fundo transparente para integração fluida */}
      <StatusBar
        style={Platform.OS === "ios" ? "dark" : "light"}
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            gestureEnabled: true,
            contentStyle: styles.contentStyle,
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
    backgroundColor: COLORS.neutroClaro ?? "#F5F5F5",
  },
  safeArea: {
    flex: 1,
    paddingBottom: Platform.OS === "android" ? 0 : 4,
  },
  contentStyle: {
    backgroundColor: COLORS.neutroClaro ?? "#F5F5F5",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
});
