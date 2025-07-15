import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../utils/constants";
import { Icon } from "react-native-elements";

import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const moods = [
  { emoji: "😢", label: "Sangat Buruk", color: "#FF3B30" },
  { emoji: "😞", label: "Buruk", color: "#FF9500" },
  { emoji: "😐", label: "Netral", color: "#FFCC00" },
  { emoji: "😊", label: "Baik", color: "#34C759" },
  { emoji: "😄", label: "Sangat Baik", color: "#32D74B" },
];

const emosiPositif = [
  "Antusias",
  "Gembira",
  "Takjub",
  "Semangat",
  "Bangga",
  "Penuh Cinta",
  "Santai",
  "Tenang",
  "Puas",
  "Lega",
  "Senang",
];

const normalizeDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export default function MoodSummary({ route, navigation }) {
  const { t, i18n } = useTranslation();
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [weeklyData, setWeeklyData] = useState({
    period: "",
    days: ["S", "S", "R", "K", "J", "S", "M"],
    moodData: [],
    totalCheckins: 0,
    latestCheckin: null,
  });

  const routeParams = route.params;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserId(parsedUser.id); // sesuaikan key-nya
        }
      } catch (err) {
        console.error("Gagal mengambil user dari storage:", err);
      }
    };

    loadUserData();
  }, []);

  // Jalankan proses setelah userId tersedia
  useEffect(() => {
    if (userId) {
      saveMoodIfNeeded();
    }
  }, [userId]);

  // Fungsi untuk mendapatkan data mood berdasarkan label
  const getMoodData = (label) => {
    return moods.find((m) => m.label === label) || { emoji: "", color: "#000" };
  };

  const saveMoodIfNeeded = async () => {
    if (!routeParams) {
      fetchCheckins();
      return;
    }

    const { mood, emosi, sumberEmosi } = routeParams;

    try {
      // Ambil data check-in terbaru
      const res = await axios.get(`${API_BASE_URL}/api/mood/user/${userId}`);
      const existingToday = res.data.find((item) => {
        const createdAt = new Date(item.createdAt);
        const today = new Date();
        return (
          createdAt.getFullYear() === today.getFullYear() &&
          createdAt.getMonth() === today.getMonth() &&
          createdAt.getDate() === today.getDate()
        );
      });

      if (existingToday) {
        console.log("Sudah check-in hari ini, tidak disimpan ulang.");
      } else {
        const payload = {
          userId: userId,
          moodLabel: mood.label,
          emosiList: emosi.map((item) => ({
            emosi: item,
            kategori: emosiPositif.includes(item) ? "Positif" : "Negatif",
          })),
          faktorList: sumberEmosi.map((item) => ({ faktor: item })),
        };
        await axios.post(`${API_BASE_URL}/api/mood/checkin`, payload);
        console.log("Mood baru berhasil disimpan.");
      }
    } catch (err) {
      console.error("Gagal menyimpan mood:", err);
    } finally {
      fetchCheckins(); // Refresh setelah post atau tidak
    }
  };

  // GET semua mood check-in user
  const fetchCheckins = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/mood/user/${userId}`);
      setCheckins(res.data);
      prepareWeeklyData(res.data);
    } catch (err) {
      console.error("Failed to fetch mood history:", err);
    } finally {
      setLoading(false);
    }
  };

  const prepareWeeklyData = (data) => {
    const today = new Date();
    const currentDay = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const period = `${monday.getDate()} ${
      monthNames[monday.getMonth()]
    } – ${sunday.getDate()} ${monthNames[sunday.getMonth()]}`;

    const moodData = Array(7).fill(null);

    data.forEach((checkin) => {
      const createdAt = normalizeDate(new Date(checkin.createdAt));
      const start = normalizeDate(monday);
      const end = normalizeDate(sunday);

      if (createdAt >= start && createdAt <= end) {
        let jsDay = createdAt.getDay();
        let index = jsDay === 0 ? 6 : jsDay - 1;
        moodData[index] = {
          label: checkin.moodLabel,
          ...getMoodData(checkin.moodLabel),
        };
      }
    });

    const latestCheckin = data.length > 0 ? data[data.length - 1] : null;

    setWeeklyData({
      period,
      days: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
      moodData,
      totalCheckins: data.length,
      latestCheckin,
    });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${dayNames[date.getDay()]}, ${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5856D6" />
        <Text style={styles.loadingText}>Memuat data mood...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "MainTabs",
                  state: {
                    routes: [{ name: t("MainTabsHome") }],
                  },
                },
              ],
            })
          }
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ringkasan Mood</Text>
          <Text style={styles.headerSubtitle}>{weeklyData.period}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Weekly Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Mood Mingguan</Text>
            <View style={styles.checkInBadge}>
              <Text style={styles.checkInText}>
                {weeklyData.totalCheckins} hari
              </Text>
            </View>
          </View>

          <View style={styles.dayRow}>
            {weeklyData.days.map((day, index) => (
              <View key={index} style={styles.dayItem}>
                <Text style={styles.dayText}>{day}</Text>
                {weeklyData.moodData[index] ? (
                  <View
                    style={[
                      styles.moodCircle,
                      {
                        backgroundColor:
                          weeklyData.moodData[index].color + "20",
                      },
                    ]}
                  >
                    <Text style={styles.moodEmoji}>
                      {weeklyData.moodData[index].emoji}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.emptyCircle}></View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Latest Check-in Section */}
        {weeklyData.latestCheckin && (
          <View style={styles.latestCheckinCard}>
            <Text style={styles.sectionTitle}>Check-in Terakhir</Text>
            <View style={styles.latestCheckinContent}>
              <View
                style={[
                  styles.moodIndicator,
                  {
                    backgroundColor:
                      getMoodData(weeklyData.latestCheckin.moodLabel).color +
                      "20",
                  },
                ]}
              >
                <Text style={styles.latestMoodEmoji}>
                  {getMoodData(weeklyData.latestCheckin.moodLabel).emoji}
                </Text>
              </View>
              <View style={styles.latestCheckinDetails}>
                <Text style={styles.latestMoodLabel}>
                  {weeklyData.latestCheckin.moodLabel}
                </Text>
                <Text style={styles.latestCheckinTime}>
                  {formatTime(weeklyData.latestCheckin.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* History Section */}
        <Text style={styles.historyTitle}>Riwayat Mood</Text>

        {checkins.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Belum ada data mood</Text>
          </View>
        ) : (
          checkins
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {formatDisplayDate(item.createdAt)}
                  </Text>
                  <Text style={styles.historyTime}>
                    {formatTime(item.createdAt)}
                  </Text>
                </View>

                <View style={styles.moodRow}>
                  <View
                    style={[
                      styles.historyMoodIndicator,
                      {
                        backgroundColor:
                          getMoodData(item.moodLabel).color + "20",
                      },
                    ]}
                  >
                    <Text style={styles.historyMoodEmoji}>
                      {getMoodData(item.moodLabel).emoji}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.historyMoodLabel,
                      { color: getMoodData(item.moodLabel).color },
                    ]}
                  >
                    {item.moodLabel}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Emosi</Text>
                  <View style={styles.wrap}>
                    {item.emosiList.map((emosi, i) => (
                      <View
                        key={i}
                        style={[
                          styles.chip,
                          {
                            backgroundColor:
                              emosi.kategori === "Positif"
                                ? "#34C75920"
                                : "#FF3B3020",
                            borderColor:
                              emosi.kategori === "Positif"
                                ? "#34C759"
                                : "#FF3B30",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            {
                              color:
                                emosi.kategori === "Positif"
                                  ? "#34C759"
                                  : "#FF3B30",
                            },
                          ]}
                        >
                          {emosi.emosi}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Faktor</Text>
                  <View style={styles.wrap}>
                    {item.faktorList.map((faktor, i) => (
                      <View key={i} style={styles.chip}>
                        <Text style={styles.chipText}>{faktor.faktor}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    color: "#5856D6",
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginLeft: -24, // Kompensasi lebar ikon back
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  checkInBadge: {
    backgroundColor: "#5856D620",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  checkInText: {
    color: "#5856D6",
    fontSize: 14,
    fontWeight: "600",
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayItem: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
    color: "#636366",
    marginBottom: 8,
  },
  moodCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 20,
  },
  emptyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#F5F5F5",
  },
  latestCheckinCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  latestCheckinContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  latestMoodEmoji: {
    fontSize: 24,
  },
  latestCheckinDetails: {
    flex: 1,
  },
  latestMoodLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  latestCheckinTime: {
    fontSize: 14,
    color: "#636366",
  },
  historyTitle: {
    fontSize: 18,
    marginLeft: 15,
    marginBottom: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#636366",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#5856D6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 14,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  historyTime: {
    fontSize: 14,
    color: "#636366",
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  historyMoodIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyMoodEmoji: {
    fontSize: 20,
  },
  historyMoodLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 16,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5856D6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 2,
  },
});
