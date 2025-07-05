import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // pakai icon bawaan expo

const API_URL = "http://192.168.43.40:8080/api/notifikasi";

export default function NotifikasiScreen() {
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        console.log("Respon API:", json);

        if (Array.isArray(json)) {
          setNotifikasi(json);
        } else if (json && Array.isArray(json.data)) {
          setNotifikasi(json.data);
        } else {
          setNotifikasi([]);
        }
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
        setNotifikasi([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifikasi();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <MaterialIcons name="notifications" size={24} color="#D6385E" />
        <Text style={styles.title}>{item.judul || "Notifikasi"}</Text>
      </View>
      <Text style={styles.body}>{item.pesan || "Pesan tidak tersedia."}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D6385E" />
      </View>
    );
  }

  if (notifikasi.length === 0) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="notifications-off" size={60} color="#ccc" />
        <Text style={styles.emptyText}>Belum ada notifikasi.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifikasi}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 8,
    color: "#D6385E",
  },
  body: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
});
