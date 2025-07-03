import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import BeritaCarousel from "../../components/BeritaCarousel";
import { API_BASE_URL } from "../../utils/constants";
import SessionManager from "../../utils/SessionManager";

const { height: screenHeight } = Dimensions.get("window");

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      const savedUser = await AsyncStorage.getItem("userData");
      if (savedUser) {
        navigation.replace("MainTabs");
        SessionManager.start(navigation); // mulai session saat auto login
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const loginData = {
        username: email.trim(),
        password: password.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const userData = await response.json();
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        navigation.replace("MainTabs");
        SessionManager.start(navigation); // mulai session timer

        await AsyncStorage.setItem(
          "lastLogin",
          JSON.stringify({
            username: email,
            password: password, // ⚠️ hati-hati nyimpan password ya, ini cuma contoh
          })
        );

        console.log("Data", userData);
      } else if (response.status === 401) {
        Alert.alert("Login Gagal", "Username atau password salah.");
      } else {
        Alert.alert("Error", `Server error (${response.status})`);
      }
    } catch (error) {
      Alert.alert(
        "Koneksi Gagal",
        "Periksa koneksi dan coba lagi.",
        ` (${response.status})`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadLastLogin = async () => {
      const saved = await AsyncStorage.getItem("lastLogin");
      if (saved) {
        const data = JSON.parse(saved);
        setEmail(data.username);
        setPassword(data.password);
      }
    };

    loadLastLogin();
  }, []);

  const scrollToInput = (inputRef) => {
    setTimeout(() => {
      inputRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          const scrollY = y - 150;
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, scrollY),
            animated: true,
          });
        },
        () => {}
      );
    }, 150);
  };

  const beritaDummy = [
    {
      id: "1",
      title: "Tips Menjaga Kesehatan Mental",
      desc: "Yuk jaga pola tidur dan luangkan waktu untuk diri sendiri!",
      image: require("../../assets/LoginCarousel/Jaga.png"),
    },
    {
      id: "2",
      title: "Jangan Takut Sendiri",
      desc: "Sekarang kamu bisa konsultasi dengan Admin dengan nyaman secara anonim",
      image: require("../../assets/LoginCarousel/Konsultasi.png"),
    },
    {
      id: "3",
      title: "Quiz",
      desc: "Jawab Pertanyaan Menarik Agar tahu seberapa dirimu",
      image: require("../../assets/LoginCarousel/Quiz.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BeritaCarousel data={beritaDummy} />
      </View>

      <View style={styles.loginBox}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          contentContainerStyle={{
            paddingBottom: keyboardHeight > 0 ? 100 : 50,
            minHeight: screenHeight * 0.8,
          }}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          <View style={styles.loginTitleWrap}>
            <Text style={styles.loginTitle}>Masuk</Text>
          </View>

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
              onFocus={() => scrollToInput(usernameRef)}
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
              onFocus={() => scrollToInput(passwordRef)}
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

          <View style={{ flexDirection: "row", bottom: 90 }}>
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
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6385E",
  },
  header: {
    height: 200,
    backgroundColor: "#D6385E",
  },
  loginTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  loginBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 70,
    padding: 20,
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
    marginRight: 30,
  },
  loginTitle: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#D6385E",
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
    paddingHorizontal: 50,
    borderRadius: 24,
    marginBottom: 30,
    marginTop: 10,
    left: 200,
  },
  loginButtonDisabled: {
    backgroundColor: "#ccc",
    left: 200,
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

  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  textWrapper: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D6385E",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#555",
  },
  indicatorWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D6385E",
    marginHorizontal: 4,
  },
});
