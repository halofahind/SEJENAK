import React, { useCallback } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native-elements";

const Konseling = ({ navigation }) => {
  dayjs.locale("id");
  const [konselings, setKonselings] = useState([]);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchKonselings();
    }, [])
  );

  const fetchKonselings = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      let resKonseling, resDetail;

      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUserData(parsedUserData);

        let promises;

        if (parsedUserData.role === "admin") {
          promises = [
            fetch(`${API_BASE_URL}/konselings`),
            fetch(`${API_BASE_URL}/detailKonselings`),
          ];
        } else {
          setId(parsedUserData.id);
          promises = [
            fetch(`${API_BASE_URL}/konselingbyuser?id=${parsedUserData.id}`),
            fetch(`${API_BASE_URL}/detailKonselings`),
          ];
        }

        [resKonseling, resDetail] = await Promise.all(promises);

        const konselingData = await resKonseling.json();
        const detailData = await resDetail.json();

        const mergedData = konselingData.map((item) => {
          const detail = detailData
            .filter((d) => d.konId === item.id)
            .sort((a, b) => new Date(a.waktu) - new Date(b.waktu));

          const last = detail[detail.length - 1];
          return {
            ...item,
            lastMessage: last?.pesan || "Belum ada pesan",
            lastSender: last?.pengirim || "-",
            lastTime: last?.waktu || null,
          };
        });

        const sortedData = mergedData.sort(
          (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
        );

        setKonselings(sortedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStartCounseling = () => {
    navigation.navigate("Topik");
  };

  const handleAddTopik = () => {
    navigation.navigate("TopikList");
  };

  const handleHistoryPress = (item) => {
    navigation.navigate("DetailKonseling", {
      topic: item.topik.nama,
      msg1: item.topik.pesanPertama,
      msg2: item.topik.pesanTerakhir,
      status: item.status,
      konId: item.id,
      isHistory: false,
    });
  };

  const renderItem = ({ item }) => {
    const isSelesai = item.status.toLowerCase() === "selesai";
    const badgeColor = isSelesai ? "#e74c3c" : "#3498db";

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => handleHistoryPress(item)}
      >
        <Image
          style={styles.avatarImage}
          source={require("../../assets/User/user-pr.png")}
          resizeMode="cover"
        />

        <View style={styles.historyContent}>
          <Text style={styles.historyTitle}>{item.topik.nama}</Text>

          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>

          <Text style={styles.historySubtitle}>
            {item.lastSender} :{" "}
            {(item.lastMessage || "").length > 50
              ? item.lastMessage.slice(0, 50) + "..."
              : item.lastMessage}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.timeText}>
            {dayjs(item.lastTime).format("HH:mm")}
          </Text>
          {/* <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>2</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.cardWrapper}>
          <View style={{ flex: 4, alignItems: "center" }}>
            <Image
              source={require("../../assets/Konseling/doctor.png")}
              style={styles.doctorImage}
            />
          </View>

          {/* Bagian kanan: teks + tombol (8 dari 12) */}
          <View style={{ flex: 8 }}>
            <Text style={styles.cardTitle}>Konseling</Text>
            <Text style={styles.cardSubtitle}>
              Pilih salah satu topik dan mulai ceritakan masalahmu dengan aman
              dan nyaman
            </Text>

            {userData?.role === "admin" && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAddTopik}
              >
                <Text style={styles.primaryButtonText}>Kelola Topik</Text>
              </TouchableOpacity>
            )}

            {userData?.role === "user" && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleStartCounseling}
              >
                <Text style={styles.primaryButtonText}>Mulai Konseling</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>Riwayat Konseling</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#3498db" />
          ) : (
            <FlatList
              data={konselings}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              onRefresh={() => {
                setRefreshing(true);
                fetchKonselings();
              }}
              refreshing={refreshing}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    flex: 1,
    padding: 15,
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    padding: 0,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  historySubtitle: {
    fontSize: 13,
    color: "#666",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 48,
  },
  timeText: {
    fontSize: 12,
    color: "#999",
  },
  notificationBadge: {
    backgroundColor: "#e91e63",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  notificationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardWrapper: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 0,
    margin: 0,
    flexDirection: "row",
    alignItems: "left",
    elevation: 3,
  },
  doctorImage: {
    width: 100,
    height: 180,
    resizeMode: "contain",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#e91e63",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Konseling;
