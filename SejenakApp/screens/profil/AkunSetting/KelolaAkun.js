import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function KelolaAkun({ navigation }) {
 const pengguna = [
   { id: 1, nama: "Budi Santoso", username: "budi123", role: "Admin" },
   { id: 2, nama: "Siti Aisyah", username: "siti_aisyah", role: "Mahasiswa" },
   { id: 3, nama: "Ahmad", username: "ahmad99", role: "Admin" },
   { id: 4, nama: "Rina Oktaviani", username: "rinaokta", role: "Mahasiswa" },
   { id: 5, nama: "Fajar Nugraha", username: "fajarn", role: "Admin" },
   { id: 6, nama: "Dewi Lestari", username: "dewilestari", role: "Mahasiswa" },
   { id: 7, nama: "Agus Salim", username: "aguss", role: "Admin" },
   { id: 8, nama: "Nina Marlina", username: "nina_m", role: "Mahasiswa" },
   { id: 9, nama: "Rudi Hartono", username: "rudih", role: "Admin" },
   { id: 10, nama: "Lina Permata", username: "linap", role: "Mahasiswa" },
 ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailAkun", { data: item })}
    >
      <View style={styles.cardHeader}>
        <MaterialIcons name="person" size={28} color="#D6385E" />
        <Text style={styles.nama}>{item.nama}</Text>
      </View>
      <Text style={styles.detail}>👤 Username: {item.username}</Text>
      <Text style={styles.detail}>⭐ Role: {item.role}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.judul}>Daftar Akun Pengguna</Text>
      <FlatList
        data={pengguna}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  judul: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D6385E",
    marginBottom: 20,
    marginTop: 50,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fdfdfd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  nama: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    marginLeft: 4,
  },
});
