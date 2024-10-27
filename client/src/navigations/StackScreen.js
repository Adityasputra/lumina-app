import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoginScreen from "../screens/LoginScreen";
import { StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";

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

export function AuthStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* <Stack.Screen name="Post" component={PostScreen} /> */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
