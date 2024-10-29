import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useMutation } from "@apollo/client";
import { LIKE_POST } from "../apollo/queries/queryPost";
import Toast from "react-native-toast-message";

export default function PostList({ item }) {
  const [like, { data, loading, error }] = useMutation(LIKE_POST);

  const handleLike = async () => {
    try {
      await like({
        variables: {
          postId: item._id,
        },
      });
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        Toast.show({
          type: "error",
          text1: err.graphQLErrors[0].message,
          position: "bottom",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
          onShow: () => {},
          onHide: () => {},
          onPress: () => {},
          props: {
            backgroundColor: "#E53835",
            textColor: "#FFF",
          },
        });
      } else {
        console.log("Error:", err);
      }
    }
  };
  return (
    <View style={styles.containerContent}>
      <View style={styles.header}>
        <View style={styles.profile} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.author.username}</Text>
          <View style={styles.subProfile}>
            <Text style={styles.name}>{item.author.name}</Text>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imgUrls }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.containerTitle}>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.content}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLike}>
          <AntDesign name="hearto" size={20} color="black" />
          <Text style={styles.buttonText}>{item.likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <FontAwesome name="comment-o" size={20} color="black" />
          <Text style={styles.buttonText}>{item.comments.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerContent: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    marginHorizontal: "5%",
    padding: 10,
    marginTop: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#ddd",
    marginRight: 15,
  },
  userInfo: {
    flexDirection: "column",
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 13,
  },
  dateText: {
    fontSize: 12,
    color: "gray",
    marginLeft: 10,
  },
  imageContainer: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  containerTitle: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  actionsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
  },
  buttonText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
  },
});
