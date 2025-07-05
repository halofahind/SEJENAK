import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Setting({ navigation }) {
  const settingOptions = [
    "Akun Personal",
    "Ganti Password",
    "Hapus Akun",
    "Kelola Akun",
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
  const handleLogout = () => {
    Alert.alert("Keluar", "Yakin ingin keluar dari aplikasi?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userData");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (err) {
            Alert.alert("Gagal logout", err.message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pengaturan</Text>
      {settingOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => handleOption(item)}>
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={20} color="#D33" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
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
