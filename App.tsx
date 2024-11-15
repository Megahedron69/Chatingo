import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootStack from "./App/Routes/routes";
export default function App() {
  NavigationBar.setVisibilityAsync("hidden");
  NavigationBar.setBehaviorAsync("overlay-swipe");
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
        <StatusBar style="auto" translucent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
