import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../utils/constants";

const screenWidth = Dimensions.get("window").width;

export default function Home({ navigation }) {
  const [motivasiHarian, setMotivasiHarian] = useState("");
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    profilePic: require("../../assets/Home/1.png"),
  });

  useEffect(() => {
    const fetchMotivasi = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/motivasi/get`);
        const list = res.data;

        if (list.length > 0) {
          const today = new Date();
          const daySeed =
            today.getFullYear() * 10000 +
            (today.getMonth() + 1) * 100 +
            today.getDate();
          const index = daySeed % list.length;

          setMotivasiHarian(list[index].motivasiText);
        }
      } catch (err) {
        console.error("Gagal ambil motivasi:", err.message);
      }
    };

    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUser({
            name: parsedData.nama || "",
            username: parsedData.username || "",
            email: parsedData.email || "",
            phone: parsedData.telepon || "",
            gender: parsedData.gender || "",
            address: parsedData.alamat || "",
            profilePic: parsedData.profilePic
              ? { uri: parsedData.profilePic }
              : require("../../assets/Home/1.png"),
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchMotivasi();
    fetchUserData();
  }, []);

  const topiks = [
    {
      id: "1",
      title: "Kenali Diri Lebih Baik",
      image: require("../../assets/Home/1.png"),
      backgroundColor: "#EF6A6A",
    },
    {
      id: "2",
      title: "Menjalin Relasi",
      image: require("../../assets/Home/2.png"),
      backgroundColor: "#F6A75A",
    },
    {
      id: "3",
      title: "Cerita Keseharian",
      image: require("../../assets/Home/1.png"),
      backgroundColor: "#697BC4",
    },
    {
      id: "4",
      title: "Tingkatkan Potensi Diri",
      image: require("../../assets/Home/1.png"),
      backgroundColor: "#11CBE0",
    },
    {
      id: "5",
      title: "Membangun Keberanian",
      image: require("../../assets/Home/1.png"),
      backgroundColor: "#B676AA",
    },
  ];

  const moods = [
    { emoji: "😢", label: "Sangat Buruk" },
    { emoji: "😞", label: "Buruk" },
    { emoji: "😐", label: "Netral" },
    { emoji: "😊", label: "Baik" },
    { emoji: "😄", label: "Sangat Baik" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff", marginTop: 40 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* === Profil & Notifikasi === */}
      <View style={styles.profileRow}>
        <View style={styles.profileContainer}>
          <Image source={user.profilePic} style={styles.profileImage} />
          <View>
            <Text style={styles.userName}>Hai, {user.name}</Text>
            <Text style={styles.welcomeText}>
              Bagaimana perasaanmu hari ini?
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("NotifikasiScreen")}
        >
          <Icon name="notifications-none" size={28} color="#444" />
        </TouchableOpacity>
      </View>

      {/* === Mood Pilihan === */}
      <View style={styles.moodOptions}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={styles.moodItem}
            onPress={() =>
              navigation.navigate("MoodTracker", { selectedMood: mood })
            }
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      {/* === Quotes === */}
      <View style={styles.headerContainer}>
        <Text style={styles.manageQuotes}>Quotes hari ini</Text>
        <TouchableOpacity onPress={() => navigation.navigate("MotivasiScreen")}>
          <Text style={styles.manageQuotes}>Kelola quotes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>
          {motivasiHarian
            ? `“${motivasiHarian}”`
            : "Memuat motivasi hari ini..."}
        </Text>
      </View>

      {/* === Topik === */}
      <Text style={styles.sectionTitle}>Topik Journal</Text>
      <Text style={styles.subTitle}>Pilih salah satu topik dan mulai!</Text>

      <View style={styles.topikWrapper}>
        {topiks.map((item, index) => {
          const isLastItem = index === topiks.length - 1;
          const isOddCount = topiks.length % 2 === 1;
          const shouldFullWidth = isOddCount && isLastItem;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                { backgroundColor: item.backgroundColor },
                shouldFullWidth && { width: screenWidth - 40 },
              ]}
              onPress={() =>
                navigation.navigate("DaftarJurnal", {
                  jenisjurnal: item,
                })
              }
            >
              <Image source={item.image} style={styles.image} />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flex: 1,
    marginTop: 40,
    paddingBottom: 100,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileContainer: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  moodOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  moodItem: {
    alignItems: "center",
    flex: 1,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },
  divider: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  manageQuotes: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  quoteBox: {
    backgroundColor: "#FCD6D9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 13,
    color: "#444",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#444",
  },
  subTitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  topikWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 5,
  },
  card: {
    width: "47%",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});
