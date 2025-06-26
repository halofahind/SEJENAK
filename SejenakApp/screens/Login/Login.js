import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// Konstanta untuk API
const API_BASE_URL = "http://10.1.47.159:8080";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  const handleLogin = async () => {
    // Validasi input
    if (!email.trim()) {
      Alert.alert("Error", "Username tidak boleh kosong!");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Password tidak boleh kosong!");
      return;
    }

    setIsLoading(true);

    try {
      // Buat request body sesuai dengan API Spring Boot
      const loginData = {
        username: email.trim(),
        password: password.trim(),
      };

      console.log("Mengirim data login:", loginData);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
        // Tambahkan timeout untuk menghindari hanging
        timeout: 10000,
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        // Login berhasil
        const userData = await response.json();
        console.log("Login berhasil:", userData);

        // Simpan data user jika diperlukan (bisa pakai AsyncStorage)
        // await AsyncStorage.setItem('userData', JSON.stringify(userData));

        navigation.navigate("MainTabs");
      } else if (response.status === 401) {
        // Unauthorized - Username atau password salah
        setErrorMsg("Username atau password salah!");
        setIsPasswordInvalid(true);
      } else {
        // Error lainnya
        Alert.alert("Error", `Terjadi kesalahan server (${response.status})`);
      }
    } catch (error) {
      console.error("Error login:", error);

      // Handle berbagai jenis error
      if (
        error.name === "TypeError" &&
        error.message.includes("Network request failed")
      ) {
        Alert.alert(
          "Koneksi Gagal",
          "Tidak dapat terhubung ke server. Pastikan:\n" +
            "• Koneksi internet stabil\n" +
            "• Server sedang berjalan\n" +
            "• IP address benar (10.1.47.159:8080)"
        );
      } else if (error.name === "AbortError") {
        Alert.alert("Timeout", "Koneksi ke server terlalu lama. Coba lagi.");
      } else {
        Alert.alert(
          "Error",
          "Terjadi kesalahan tidak terduga: " + error.message
        );
      }
    } finally {
      setIsLoading(false);
    }
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
        {errorMsg !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity onPress={() => setErrorMsg("")}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <Icon name="person-outline" size={20} color="#D6385E" />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={email}
            onChangeText={setEmail}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Icon name="lock-outline" size={20} color="#D6385E" />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}>
            <Icon
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rowButtons}>
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.loginButtonText}>Memuat...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.signupText}>Belum memiliki akun? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Daftar")}
            disabled={isLoading}>
            <Text
              style={{
                color: isLoading ? "#ccc" : "#EF6A6A",
                fontWeight: "bold",
              }}>
              Daftar
            </Text>
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
    paddingHorizontal: 160,
    borderRadius: 24,
    marginBottom: 30,
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: "#ccc",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    width: "100%",
    alignItems: "center",
    marginBottom: 35,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdecea",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "red",
  },

  errorText: {
    color: "red",
    flex: 1,
  },

  closeText: {
    color: "red",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 18,
  },
});
