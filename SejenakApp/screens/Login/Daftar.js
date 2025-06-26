import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";

const { height: screenHeight } = Dimensions.get("window");

export default function Daftar({ navigation }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Refs untuk setiap input
  const scrollViewRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const namaRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak sama!");
      return;
    }
    alert("Registrasi berhasil!");
    navigation.navigate("Login");
  };

  // Fungsi untuk scroll ke input yang sedang fokus
  const scrollToInput = (inputRef) => {
    setTimeout(() => {
      inputRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          const scrollY = y - 150; // Offset agar tidak tepat di tepi
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, scrollY),
            animated: true,
          });
        },
        () => {}
      );
    }, 150);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View
        style={[
          styles.registerBox,
          { marginBottom: keyboardHeight > 0 ? keyboardHeight - 20 : 0 },
        ]}>
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
          <View style={styles.innerContent}>
            <Image
              source={require("../../assets/OnBoarding/o2.png")}
              style={styles.logoImage}
            />

            <Text style={styles.registerTitle}>Daftar</Text>

            {/* Email */}
            <View style={styles.inputWrapper} ref={emailRef}>
              <Icon name="mail-outline" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                returnKeyType="next"
                onFocus={() => scrollToInput(emailRef)}
                onSubmitEditing={() => usernameRef.current?.focus()}
              />
            </View>

            {/* Username */}
            <View style={styles.inputWrapper} ref={usernameRef}>
              <Icon name="person-outline" size={20} color="#333" />
              <TextInput
                ref={usernameRef}
                style={styles.input}
                placeholder="Username"
                value={nama}
                onChangeText={setNama}
                returnKeyType="next"
                onFocus={() => scrollToInput(usernameRef)}
                onSubmitEditing={() => namaRef.current?.focus()}
              />
            </View>

            {/* Nama Lengkap */}
            <View style={styles.inputWrapper} ref={namaRef}>
              <Icon name="person-outline" size={20} color="#333" />
              <TextInput
                ref={namaRef}
                style={styles.input}
                placeholder="Nama Lengkap"
                value={nama}
                onChangeText={setNama}
                returnKeyType="next"
                onFocus={() => scrollToInput(namaRef)}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper} ref={passwordRef}>
              <Icon name="lock-outline" size={20} color="#333" />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
                onFocus={() => scrollToInput(passwordRef)}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              />
            </View>

            {/* Konfirmasi Password */}
            <View style={styles.inputWrapper} ref={confirmPasswordRef}>
              <Icon name="lock-outline" size={20} color="#333" />
              <TextInput
                ref={confirmPasswordRef}
                style={styles.input}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="next"
                onFocus={() => scrollToInput(confirmPasswordRef)}
                onSubmitEditing={() => {
                  // Scroll ke area gender
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                      y: 450,
                      animated: true,
                    });
                  }, 100);
                }}
              />
            </View>

            {/* Tanggal Lahir */}
            <View style={styles.inputWrapper}>
              <Icon name="calendar-today" size={20} color="#333" />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{ flex: 1 }}>
                <Text style={styles.input}>
                  {dob ? dob : "Tanggal Lahir (DD/MM/YYYY)"}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const formattedDate =
                      selectedDate.toLocaleDateString("id-ID");
                    setDob(formattedDate);
                  }
                }}
              />
            )}

            <View style={styles.genderButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Laki-laki" && styles.genderButtonLaki,
                ]}
                onPress={() => setGender("Laki-laki")}>
                <Icon
                  name="male"
                  size={18}
                  color={gender === "Laki-laki" ? "#fff" : "#555"}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "Laki-laki" && styles.genderButtonTextActive,
                  ]}>
                  Laki-laki
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Perempuan" && styles.genderButtonPerempuan,
                ]}
                onPress={() => setGender("Perempuan")}>
                <Icon
                  name="female"
                  size={18}
                  color={gender === "Perempuan" ? "#fff" : "#555"}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === "Perempuan" && styles.genderButtonTextActive,
                  ]}>
                  Perempuan
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nomor Telepon */}
            <View style={styles.inputWrapper} ref={phoneRef}>
              <Icon name="phone" size={20} color="#333" />
              <TextInput
                ref={phoneRef}
                style={styles.input}
                placeholder="Nomor Telepon"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="done"
                onFocus={() => scrollToInput(phoneRef)}
              />
            </View>

            {/* Tombol Daftar */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Daftar</Text>
            </TouchableOpacity>

            {/* Link ke Login */}
            <Text style={styles.loginText}>
              Sudah punya akun?{" "}
              <Text
                style={{ color: "#EF6A6A", fontWeight: "bold" }}
                onPress={() => navigation.navigate("Login")}>
                Login
              </Text>
            </Text>
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
  registerBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  innerContent: {
    paddingBottom: 40,
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
    borderRadius: 20,
  },
  registerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#222",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E3E3E3",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#D6385E",
    paddingVertical: 14,
    paddingHorizontal: 155,
    borderRadius: 30,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#D6385E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  genderButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  genderButtonLaki: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  genderButtonPerempuan: {
    backgroundColor: "#D6385E",
    borderColor: "#D6385E",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  genderButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
  },
  genderButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
  },
});
