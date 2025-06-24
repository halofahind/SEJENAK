import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("RevalinaAzzah@gmail.com");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("Login berhasil!");
    navigation.navigate("MainTabs");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.loginBox}>
        <Image
          source={require("../../assets/OnBoarding/o2.png")}
          style={styles.logoImage}
        />

        <Text style={styles.loginTitle}>Login</Text>

        <View style={styles.inputWrapper}>
          <Icon name="person-outline" size={20} color="#333" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="lock-outline" size={20} color="#333" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Icon name="visibility-off" size={20} color="#ccc" />
        </View>

        <View style={styles.rowButtons}>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forget Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialIcons}>
          <FontAwesome name="google" size={26} color="#EA4335" />
          <FontAwesome name="apple" size={26} color="#000" />
          <FontAwesome5 name="facebook" size={26} color="#1877F2" />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.signupText}>Belum memiliki akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Daftar")}>
            <Text style={{ color: "#EF6A6A", fontWeight: "bold" }}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F28B8B",
  },
  header: {
    height: 200,
    backgroundColor: "#D6385E",
  },
  loginBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 20,
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#222",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    width: "100%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "#D6385E",
    marginBottom: 30,
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: "#D6385E",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginBottom: 30,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginBottom: 30,
  },
  signupText: {
    fontSize: 13,
    color: "#555",
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    marginBottom: 35,
  },
});
