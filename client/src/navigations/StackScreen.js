import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LandingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TabScreen from "./TabScreen";

const Stack = createNativeStackNavigator();

export default function UnAuthStackScreen() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerTitle: "", headerShadowVisible: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerTitle: "", headerShadowVisible: false }}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

export function AuthStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabScreen"
        component={TabScreen}
        options={{ headerShown: false, headerShadowVisible: false }}
      />
      {/* <Stack.Screen name="Post" component={PostScreen} /> */}
    </Stack.Navigator>
  );
}