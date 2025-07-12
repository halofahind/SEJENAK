import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../utils/constants";

const screenWidth = Dimensions.get("window").width;

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
    backgroundColor: "#697BC4",
  },
  {
    id: "3",
    title: "Cerita Keseharian",
    image: require("../../assets/Home/3-Perempuan.png"),
    backgroundColor: "#11CBE0",
  },
  {
    id: "4",
    title: "Tingkatkan Potensi Diri",
    image: require("../../assets/Home/4.png"),
    backgroundColor: "#F6A75A",
  },
  {
    id: "5",
    title: "Membangun Keberanian",
    image: require("../../assets/Home/5.png"),
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

export default function Home({ navigation }) {
  const [motivasiHarian, setMotivasiHarian] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    profilePic: require("../../assets/Home/1.png"),
  });

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);

      // Load motivasi
      const res = await axios.get(`${API_BASE_URL}/motivasi/get`);
      const list = res.data.filter((item) => item.status === "Aktif");
      if (list.length > 0) {
        const today = new Date();
        const daySeed =
          today.getFullYear() * 10000 +
          (today.getMonth() + 1) * 100 +
          today.getDate();
        const index = daySeed % list.length;
        setMotivasiHarian(list[index].motivasiText);
      }

      const userData = await AsyncStorage.getItem("userData");

      if (userData) {
        const parsedData = JSON.parse(userData);

        // Handle profile picture
        let profilePicSource;
        if (parsedData.usrFoto) {
          profilePicSource = {
            uri: `${API_BASE_URL}/uploads/foto-profil/${
              parsedData.usrFoto
            }?${new Date().getTime()}`,
          };
        } else {
          profilePicSource = require("../../assets/Profil/Profil.png");
        }

        setUser({
          name: parsedData.nama || "",
          username: parsedData.username || "",
          email: parsedData.email || "",
          phone: parsedData.telepon || "",
          gender: parsedData.gender || "",
          address: parsedData.alamat || "",
          profilePic: profilePicSource,
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const navigateToProfile = () => {
    navigation.navigate("Profil");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff", marginTop: 40 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#D7385E"]}
            tintColor="#D7385E"
          />
        }
      >
        {/* === Profil & Notifikasi === */}
        <View style={styles.profileRow}>
          <View style={styles.profileContainer}>
            <Image
              source={
                user.profilePic?.uri
                  ? { uri: user.profilePic.uri }
                  : require("../../assets/Home/1.png")
              }
              style={styles.profileImage}
              onError={() => console.log("Gagal memuat gambar profil")}
            />

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
          {user.role === "admin" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("MotivasiScreen")}
            >
              <Icon name="edit" size={28} color="#444" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.quoteBox}>
          <View style={styles.quoteTextContainer}>
            <Text style={styles.quoteText}>
              {motivasiHarian
                ? `“${motivasiHarian}”`
                : "Memuat motivasi hari ini..."}
            </Text>
          </View>
          <Image
            source={require("../../assets/Home/hug.png")}
            style={styles.quoteImage}
            resizeMode="contain"
          />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#ffffff",
    flex: 1,

    paddingBottom: 50,
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
    flexDirection: "row",
    backgroundColor: "#FCD6D9",
    borderRadius: 10,
    marginBottom: 20,
    padding: 12,
    alignItems: "center",
  },

  quoteTextContainer: {
    flex: 3, // 75% area
    paddingRight: 10,
  },

  quoteText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    flexWrap: "wrap",
    textAlign: "left",
  },

  quoteImage: {
    flex: 1, // 25% area
    height: 80,
    width: 80,
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
    width: "48%",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 110,
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
