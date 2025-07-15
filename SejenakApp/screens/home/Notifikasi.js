import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";

const API_URL = "http://192.168.43.40:8080/api/notifikasi";

const HomeScreen = ({ navigation }) => {
  const [jumlahNotifBaru, setJumlahNotifBaru] = useState(0);

  const fetchNotifikasiBaru = async () => {
    try {
      const res = await axios.get(API_URL);
      const notifBaru = res.data.filter(
        (item) => item.status === "baru" // sesuaikan dengan backend kamu
      );
      setJumlahNotifBaru(notifBaru.length);
    } catch (error) {
      console.log("Gagal cek notifikasi:", error);
    }
  };

  useEffect(() => {
    fetchNotifikasiBaru();
    const interval = setInterval(fetchNotifikasiBaru, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile dan Notifikasi */}
      <View style={styles.headerRow}>
        <Text style={styles.welcomeText}>Selamat datang 👋</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Notifikasi")}
          style={styles.notifWrapper}
        >
          <Icon name="bell-outline" size={28} color="#444" />
          {jumlahNotifBaru > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{jumlahNotifBaru}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Konten Halaman */}
      <Text style={styles.title}>Apa kabar hari ini?</Text>
      <Text style={styles.subText}>Semoga harimu menyenangkan ✨</Text>

      {/* Tombol Menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate("Notifikasi")}
      >
        <Icon name="message-text-outline" size={22} color="#fff" />
        <Text style={styles.menuText}>Lihat Notifikasi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  notifWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 18,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  menuButton: {
    flexDirection: "row",
    backgroundColor: "#4D7CFE",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default HomeScreen;
