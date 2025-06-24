import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Daftar({ navigation }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak sama!");
      return;
    }
    alert("Registrasi berhasil!");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.registerBox}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
        >
          <View style={styles.innerContent}>
            <Image
              source={require("../../assets/OnBoarding/o2.png")}
              style={styles.logoImage}
            />

            <Text style={styles.registerTitle}>Daftar</Text>

            {/* Nama */}
            <View style={styles.inputWrapper}>
              <Icon name="person-outline" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Nama Lengkap"
                value={nama}
                onChangeText={setNama}
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Icon name="mail-outline" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Icon name="lock-outline" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Konfirmasi Password */}
            <View style={styles.inputWrapper}>
              <Icon name="lock-outline" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Tanggal Lahir */}
            <View style={styles.inputWrapper}>
              <Icon name="calendar-today" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Tanggal Lahir (DD/MM/YYYY)"
                value={dob}
                onChangeText={setDob}
              />
            </View>

            {/* Jenis Kelamin */}
            <View style={styles.inputWrapper}>
              <Icon name="wc" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Jenis Kelamin (Laki-laki / Perempuan)"
                value={gender}
                onChangeText={setGender}
              />
            </View>

            {/* Nomor Telepon */}
            <View style={styles.inputWrapper}>
              <Icon name="phone" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Nomor Telepon"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Alamat */}
            <View style={styles.inputWrapper}>
              <Icon name="location-on" size={20} color="#333" />
              <TextInput
                style={styles.input}
                placeholder="Alamat"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Tombol Daftar */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Daftar</Text>
            </TouchableOpacity>

            {/* Link ke Login */}
            <Text style={styles.loginText}>
              Sudah punya akun?{" "}
              <Text
                style={{ color: "#EF6A6A", fontWeight: "bold" }}
                onPress={() => navigation.navigate("Login")}
              >
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
    paddingHorizontal: 50,
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
});
