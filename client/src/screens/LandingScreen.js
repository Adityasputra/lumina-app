import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Logo from "../assets/social.svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Lumina</Text>
      </View>
      <View style={styles.containerContent}>
        <View style={styles.content}>
          <Logo width={250} height={250} />
        </View>
        <View>
          <Text style={styles.titleContent}>
            Best Social App to Make New Friends
          </Text>
          <Text style={styles.subTitleContent}>
            With Lumina, you’ll connect with new friends from various countries
            and regions across the globe.
          </Text>
        </View>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.buttonStart}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonLogin}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonLoginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFC727",
  },
  containerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    paddingBottom: 30,
  },
  titleContent: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    color: "#333",
  },
  subTitleContent: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#666",
    lineHeight: 22,
  },
  containerButton: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  buttonStart: {
    backgroundColor: "#FFC727",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 30,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonLogin: {
    paddingVertical: 15,
    width: "100%",
    borderWidth: 2,
    borderColor: "#FFC727",
    borderRadius: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginTop: 10,
  },
  buttonLoginText: {
    color: "#FFC727",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
