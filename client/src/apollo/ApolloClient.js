import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { getItemAsync } from "expo-secure-store";

const httpLink = createHttpLink({
  uri: "https://da3b-114-5-105-86.ngrok-free.app",
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fetchPolicy: "cache-and-network",
      },
    },
  }),
});

export default client;
