import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function PostList({ item }) {
  return (
    <View style={styles.containerContent}>
      <View style={styles.header}>
        <View style={styles.profile} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <View style={styles.subProfile}>
            <Text style={styles.name}>{item.location}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.containerTitle}>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button}>
          <AntDesign name="hearto" size={20} color="black" />
          <Text style={styles.buttonText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <FontAwesome name="comment-o" size={20} color="black" />
          <Text style={styles.buttonText}>{item.comments}</Text>
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
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 6,
    // elevation: 3,
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
