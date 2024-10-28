import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  View,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Register } from "../apollo/queries/queryUser";
import { useMutation } from "@apollo/client";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { data, loading, error }] = useMutation(Register);

  const handleRegister = async () => {
    if (!email || !password || !name || !username) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const newUser = {
        email,
        password,
        name,
        username,
      };

      const response = await register({
        variables: {
          input: newUser,
        },
      });

      if (response.data.register) {
        console.log("User registered successfully:", response.data.register);
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please check your details.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.header}>Let's get </Text>
        <Text style={styles.header}>Started</Text>
      </View>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>
      <View style={styles.containerForm}>
        <View style={styles.inputContainer}>
          <FontAwesome
            name="user-circle-o"
            color="#aaa"
            size={20}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={setName}
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome6
            name="user-large"
            size={20}
            color="#aaa"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
            placeholderTextColor="#aaa"
          />
        </View>
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
        <TouchableOpacity style={styles.buttonSubmit} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={styles.signUpLink}
        >
          <Text>
            Already have an account?{" "}
            <Text style={styles.signUpText}>Log In</Text>
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
