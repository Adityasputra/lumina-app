import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "../screens/LoginScreen";
import { StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function UnAuthStackScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Post" component={PostScreen} /> */}
        </Stack.Navigator>
      </SafeAreaView>
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
