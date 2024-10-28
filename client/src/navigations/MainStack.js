import { NavigationContainer } from "@react-navigation/native";
import UnAuthStackScreen, { AuthStackScreen } from "./StackScreen";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";

export default function MainStack() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        setLoading(true);
        const access_token = await getItemAsync("access_token");

        if (access_token) {
          setIsSignedIn(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <AuthStackScreen /> : <UnAuthStackScreen />}
    </NavigationContainer>
  );
}
