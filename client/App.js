import { ApolloProvider } from "@apollo/client";
import MainStack from "./src/navigations/MainStack";
import client from "./src/apollo/ApolloClient";
import AuthProvider from "./src/contexts/AuthContext";
import { SafeAreaView, StyleSheet } from "react-native";

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <MainStack />
      </ApolloProvider>
    </AuthProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
