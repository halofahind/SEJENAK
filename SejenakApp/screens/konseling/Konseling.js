import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import { API_BASE_URL } from "../../utils/constants";
import dayjs from "dayjs";
import "dayjs/locale/id";

const Konseling = ({ navigation }) => {
  dayjs.locale("id");
  const [konselings, setKonselings] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    fetchKonselings();
  }, []);

  const fetchKonselings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/konselings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Data topik:", response);

      const data = await response.json();
      setKonselings(data);
    } catch (error) {
      console.error("Error fetching topiks:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  // di useEffect atau saat mapping data
  const fetchTopikById = async (topikId) => {
    const res = await fetch(`${API_BASE_URL}/topik/${topikId}`);
    return await res.json();
  };

  const fetchUserById = async (userId) => {
    const res = await fetch(`${API_BASE_URL}/pengguna/${userId}`);
    return await res.json();
  };

  const handleStartCounseling = () => {
    navigation.navigate("Topik");
  };

  const handleAddTopik = () => {
    navigation.navigate("TopikList");
  };

  const handleHistoryPress = (item) => {
    // Navigate to chat with selected history
    navigation.navigate("Chat", { topic: item.title, isHistory: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Topik Konseling</Text>
        <Text style={styles.sectionSubtitle}>
          Pilih salah satu topik dan mulai ceritakan masalahmu dengan aman dan
          nyaman
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={handleAddTopik}>
          <Text style={styles.startButtonText}>Kelola Topik</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartCounseling}>
          <Text style={styles.startButtonText}>Mulai Konseling</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section]}>
        <Text style={styles.sectionTitle}>Riwayat Konseling</Text>

        <FlatList
          data={konselings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyItem}
              onPress={() => handleHistoryPress(item)}>
              <View style={[styles.avatar, { backgroundColor: item.color }]}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>{item.id}</Text>
                <Text style={styles.historySubtitle}>
                  Mulai : {dayjs(item.tanggalMulai).format("D MMMM YYYY")}
                </Text>
                <Text style={styles.historySubtitle}>Selesai :</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
                <Text style={styles.statusText}>
                  {dayjs(item.tanggalSelesai).format("HH :mm")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 80,
  },
  section: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
  },
  riwayatSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  addButtonTopik: {
    backgroundColor: "#e91e63",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButton: {
    backgroundColor: "#e91e63",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    color: "white",
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e91e63",
  },
  historySubtitle: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    backgroundColor: "#e91e63",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default Konseling;
