import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getItemAsync } from "expo-secure-store";

const httpLink = createHttpLink({
  uri: "https://3483-114-5-110-191.ngrok-free.app",
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const access_token = await getItemAsync("access_token");
    return {
      headers: {
        ...headers,
        authorization: access_token ? `Bearer ${access_token}` : "",
      },
    };
  } catch (error) {
    console.error("Error fetching access token:", error);
    return { headers };
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fetchPolicy: "cache-and-network",
      },
    },
  }),
});

export default client;
