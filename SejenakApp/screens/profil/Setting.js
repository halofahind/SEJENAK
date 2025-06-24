import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

export default function Setting({ navigation }) {
  const handleOption = (label) => {
    Alert.alert(label, `Fitur "${label}" belum tersedia.`);
  };

  const settingOptions = [
    "Akun Personal",
    "Berlangganan",
    "Bantuan",
    "Notifikasi",
    "Ganti Password",
    "Hapus Akun",
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pengaturan</Text>
      {settingOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => handleOption(item)}
        >
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D6385E",
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
