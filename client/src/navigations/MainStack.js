import { NavigationContainer } from "@react-navigation/native";
import UnAuthStackScreen from "./StackScreen";

export default function MainStack() {
  return (
    <NavigationContainer>
      <UnAuthStackScreen />
    </NavigationContainer>
  );
}
