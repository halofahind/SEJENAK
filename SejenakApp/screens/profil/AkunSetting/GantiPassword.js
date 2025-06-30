import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function GantiPassword() {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");

  const handleSimpan = () => {
    Alert.alert("Berhasil", "Password berhasil diganti!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ganti Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password Lama"
        secureTextEntry
        value={passwordLama}
        onChangeText={setPasswordLama}
      />
      <TextInput
        style={styles.input}
        placeholder="Password Baru"
        secureTextEntry
        value={passwordBaru}
        onChangeText={setPasswordBaru}
      />
      <TouchableOpacity style={styles.button} onPress={handleSimpan}>
        <Text style={styles.buttonText}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D6385E",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#D6385E",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
