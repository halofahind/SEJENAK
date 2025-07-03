import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function HapusAkun() {
  const handleHapus = () => {
    Alert.alert("Akun Dihapus", "Akun kamu berhasil dihapus (simulasi).");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hapus Akun</Text>
      <Text style={styles.warning}>
        Apakah kamu yakin ingin menghapus akun? Tindakan ini tidak bisa
        dibatalkan.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleHapus}>
        <Text style={styles.buttonText}>Hapus Akun</Text>
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
    marginBottom: 16,
  },
  warning: { fontSize: 16, color: "#333", marginBottom: 24 },
  button: {
    backgroundColor: "#ff3b30",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
