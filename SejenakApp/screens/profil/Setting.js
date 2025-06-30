import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

export default function Setting({ navigation }) {
  const settingOptions = [
    "Akun Personal",
    "Ganti Password",
    "Hapus Akun",
    "Kelola Akun"
  ];

  const handleOption = (label) => {
    switch (label) {
      case "Akun Personal":
        navigation.navigate("AkunPersonal");
        break;
      case "Ganti Password":
        navigation.navigate("GantiPassword");
        break;
      case "Hapus Akun":
        navigation.navigate("HapusAkun");
        break;
      case "Kelola Akun":
        navigation.navigate("KelolaAkun");
        break;
      default:
        Alert.alert(label, `Fitur "${label}" belum tersedia.`);
    }
  };

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
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
    color: "#D6385E",
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { fontSize: 16, color: "#333" },
});
