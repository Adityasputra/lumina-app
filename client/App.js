import { ApolloProvider } from "@apollo/client";
import { StyleSheet, Text, View } from "react-native";
import MainStack from "./src/navigations/MainStack";
import client from "./src/apollo/ApolloClient";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <MainStack />
    </ApolloProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
