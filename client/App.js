import { ApolloProvider } from "@apollo/client";
import MainStack from "./src/navigations/MainStack";
import client from "./src/apollo/ApolloClient";
import AuthProvider from "./src/contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <MainStack />
      </ApolloProvider>
    </AuthProvider>
  );
}
