import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons"; // ← tombol icon back
import { API_BASE_URL } from "../../../utils/constants";

export default function KelolaAkun({ navigation }) {
  const [pengguna, setPengguna] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPengguna = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/penggunas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      if (Array.isArray(json)) {
        setPengguna(json);
      } else {
        throw new Error("Data dari server bukan array");
      }
    } catch (error) {
      Alert.alert("Gagal Mengambil Data", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPengguna();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailAkun", { data: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <Image
            source={require("../../../assets/Home/1.png")}
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.namaBold}>{item.nama || item.usr_nama}</Text>
            {item.nama && item.usr_nama && item.nama !== item.usr_nama && (
              <Text style={styles.nama}>{item.usr_nama}</Text>
            )}
            <Text style={styles.detail}>👤 {item.usrNim}</Text>
            <Text style={styles.detail}>🆔 {item.role}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text
            style={[
              styles.statusText,
              { color: item.usrStatus === "Aktif" ? "#4CAF50" : "#fc0814" },
            ]}
          >
            {item.usrStatus || "-"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate("MainTabs", { screen: "Profil" }); // Ganti 'Profil' jika namanya beda
          }
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="#D6385E" />
      </TouchableOpacity>

      <Text style={styles.judul}>Daftar Akun Pengguna</Text>
      <Text style={styles.subjudul}>Total Akun: {pengguna.length}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#D6385E" />
      ) : (
        <FlatList
          data={pengguna}
          keyExtractor={(item, index) =>
            item?.usr_id ? item.usr_id.toString() : index.toString()
          }
          renderItem={renderItem}
        />
      )}

      {/* Tombol Tambah Akun */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TambahAkun")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60, // Tambahan agar tombol back tidak ketimpa
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    zIndex: 100,
    padding: 10,
  },
  judul: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D6385E",
    marginBottom: 10,
    textAlign: "center",
  },
  subjudul: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fdfdfd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightSection: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  infoContainer: {
    marginLeft: 10,
  },
  namaBold: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  nama: {
    fontSize: 16,
    color: "#333",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#D6385E",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
});
