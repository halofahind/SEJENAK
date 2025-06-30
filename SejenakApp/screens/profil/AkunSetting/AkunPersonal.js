// screens/profil/AkunSetting/AkunPersonal.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function AkunPersonal() {
  // Simpan data ke state supaya bisa diubah
  const [userData, setUserData] = useState({
    nama: "Alfian Ramdhan",
    email: "alfian@email.com",
    telepon: "08123456789",
    gender: "Laki-laki",
    alamat: "Jl. Merdeka No. 123, Bandung",
  });

  const handleChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };

  const handleSave = () => {
    // Simulasikan penyimpanan (nanti bisa disambung ke API/AsyncStorage)
    Alert.alert("Berhasil", "Data akun berhasil disimpan!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Akun Personal</Text>

      {Object.entries(userData).map(([key, value]) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{key.toUpperCase()}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleChange(key, text)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D6385E",
    marginTop: 50,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, color: "#888", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#D6385E",
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
