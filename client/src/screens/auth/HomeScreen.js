import { StyleSheet, View, FlatList } from "react-native";
import PostList from "../../components/PostList";

const posts = [
  {
    id: "1",
    username: "user1",
    location: "Location 1",
    date: "20 Mei 2024",
    description:
      "lorem ipsum ter atdao iuasy kaiudiajajdsa agysgd sagdy dygaygsyd sgdgag asjajs ahus a yu ycayu asu cuyauiy uycy 7ay7 ca87yy c7a7",
    image:
      "https://cdn.api.upstation.media/2024-06/1718862876294_holo%20wall.jpg",
    likes: 99,
    comments: 20,
  },
  {
    id: "2",
    username: "user2",
    location: "Location 2",
    date: "21 Mei 2024",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image:
      "https://cdn.api.upstation.media/2024-06/1718862876294_holo%20wall.jpg",
    likes: 150,
    comments: 30,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={PostList}
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
