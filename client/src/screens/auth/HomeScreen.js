import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import PostList from "../../components/PostList";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../../apollo/queries/queryPost";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { deleteItemAsync } from "expo-secure-store";

export default function HomeScreen() {
  const { data, error, loading } = useQuery(GET_POSTS);

  console.log(data);
  // if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  // if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.getPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostList item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});
