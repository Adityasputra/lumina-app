import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  View,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useMutation } from "@apollo/client";
import { Login } from "../apollo/queries/queryUser";
import { setItemAsync } from "expo-secure-store";
import Toast from "react-native-root-toast";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(Login);
  const { setIsSignedIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const user = {
        email,
        password,
      };

      const response = await login({
        variables: {
          input: user,
        },
      });

      const { access_token } = response.data.login;
      await setItemAsync("access_token", access_token);
      setIsSignedIn(true);
    } catch (error) {
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        Toast.show(error.graphQLErrors[0].message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
        });
      } else {
        Toast.show("Login failed. Please try again.", {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
        });
      }
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.header}>Hey,</Text>
        <Text style={styles.header}>Welcome </Text>
        <Text style={styles.header}>Back</Text>
      </View>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>
      <View style={styles.containerForm}>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={20}
            color="#aaa"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.inputContainer}>
          <Fontisto name="key" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.buttonSubmit} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={styles.signUpLink}
        >
          <Text>
            Don't have an account?{" "}
            <Text style={styles.signUpText}>Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  containerHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
  },
  containerForm: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  buttonSubmit: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFC727",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpLink: {
    marginTop: 20,
    alignItems: "center",
  },
  signUpText: {
    color: "#FFC727",
    textDecorationLine: "underline",
  },
});
