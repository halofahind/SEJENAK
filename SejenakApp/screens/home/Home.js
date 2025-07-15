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
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";

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
    image: require("../../assets/Home/3.png"),
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
  { emoji: "😢", label: "Sangat Buruk", color: "#FF3B30" },
  { emoji: "😞", label: "Buruk", color: "#FF9500" },
  { emoji: "😐", label: "Netral", color: "#FFCC00" },
  { emoji: "😊", label: "Baik", color: "#34C759" },
  { emoji: "😄", label: "Sangat Baik", color: "#32D74B" },
];

const getMoodColor = (label) => {
  const mood = moods.find((m) => m.label === label);
  return mood ? mood.color : "#5856D6";
};

export default function Home({ navigation }) {
  const [motivasiHarian, setMotivasiHarian] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const [todayCheckin, setTodayCheckin] = useState(null);

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    profilePic: require("../../assets/Home/1.png"),
    role: "user",
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

        // Cek apakah sudah check-in hari ini
        const checkinRes = await axios.get(
          `${API_BASE_URL}/api/mood/user/${parsedData.id || 1}`
        );
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        const todayMood = checkinRes.data.find(
          (item) => item.checkinDate === todayStr
        );

        setTodayCheckin(todayMood || null);

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
          role: parsedData.role,
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
              <Text style={styles.userName}>
                {t("SayHi")}, {user.name}
              </Text>
              <Text style={styles.welcomeText}>{t("HomeGreetingText")}</Text>
            </View>
          </View>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate("NotifikasiScreen")}
          >
            <Icon name="notifications-none" size={28} color="#444" />
          </TouchableOpacity> */}
        </View>

        {/* === Mood Pilihan === */}

        {!todayCheckin && (
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
        )}

        {todayCheckin && (
          <TouchableOpacity
            style={styles.latestCheckinCard}
            onPress={() => navigation.navigate("MoodSummary")}
          >
            <View style={styles.latestCheckinContent}>
              <View
                style={[
                  styles.moodIndicator,
                  {
                    backgroundColor:
                      getMoodColor(todayCheckin.moodLabel) + "20",
                  },
                ]}
              >
                <Text style={styles.latestMoodEmoji}>
                  {moods.find((m) => m.label === todayCheckin.moodLabel)
                    ?.emoji || "🙂"}
                </Text>
              </View>

              <View style={styles.latestCheckinDetails}>
                <Text style={styles.latestMoodLabel}>
                  {todayCheckin.moodLabel}
                </Text>

                <View style={styles.moodTagsCompact}>
                  {todayCheckin.emosiList.map((item, i) => (
                    <Text
                      key={i}
                      style={[
                        styles.tagSmall,
                        item.kategori === "Positif"
                          ? styles.positiveTag
                          : styles.negativeTag,
                        item.kategori === "Positif"
                          ? styles.positiveTagText
                          : styles.negativeTagText,
                      ]}
                    >
                      {item.emosi}
                    </Text>
                  ))}
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#C7C7CC"
                style={styles.chevron}
              />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.divider} />

        {/* === Quotes === */}
        <View style={styles.headerContainer}>
          <Text style={styles.manageQuotes}>{t("HomeQuotesTitle")}</Text>
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
                ? `${motivasiHarian}`
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
        <Text style={styles.sectionTitle}>{t("HomeJournalTopicTitle")}</Text>
        <Text style={styles.subTitle}>{t("HomeJournalTopicSubTitle")}</Text>

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
    marginBottom: 10,
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
    backgroundColor: "#D7385E",
    borderRadius: 10,
    marginBottom: 20,
    padding: 12,
    alignItems: "center",
    position: "relative", // penting untuk absolute image
  },

  quoteTextContainer: {
    flex: 1,
    paddingRight: 120,
  },

  quoteText: {
    margin: 5,
    fontSize: 14,
    color: "#fff",
    fontStyle: "italic",
    flexWrap: "wrap",
    textAlign: "left",
  },

  quoteImage: {
    position: "absolute",
    right: 12,
    bottom: -25,
    height: 130,
    width: 130,
    resizeMode: "contain", // supaya tidak crop
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  moodEmoji: {
    fontSize: 28,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00BFFF",
    marginBottom: 8,
  },
  chipText: {
    color: "#00BFFF",
    fontSize: 13,
  },

  latestCheckinCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 0,
    marginVertical: 8,

    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  latestCheckinContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  moodIndicator: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  latestMoodEmoji: {
    fontSize: 26,
  },
  latestCheckinDetails: {
    flex: 1,
  },
  latestMoodLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 7,
  },
  latestCheckinTime: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 6,
  },
  moodTagsCompact: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tagSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  positiveTag: {
    backgroundColor: "#34C75920",
    borderColor: "#34C759",
  },
  negativeTag: {
    backgroundColor: "#FF3B3020",
    borderColor: "#FF3B30",
  },
  positiveTagText: {
    color: "#34C759",
    fontWeight: "500",
  },
  negativeTagText: {
    color: "#FF3B30",
    fontWeight: "500",
  },
  chevron: {
    fontSize: 30,
    color: "#636363ff",
    alignSelf: "center",
    marginLeft: "auto",
  },
});
