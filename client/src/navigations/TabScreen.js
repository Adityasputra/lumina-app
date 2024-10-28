import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/auth/HomeScreen";
const Tab = createBottomTabNavigator();
export default function TabScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: "Lumina" }}
      />
    </Tab.Navigator>
  );
}
