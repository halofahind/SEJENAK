import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { API_BASE_URL } from "../../utils/constants";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function TopikList({ navigation }) {
  const [topiks, setTopiks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  useFocusEffect(
    useCallback(() => {
      fetchTopiks();
    }, [])
  );
  const fetchTopiks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/topiks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTopiks(data);
    } catch (error) {
      console.error("Error fetching topiks:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id, nama, status) => {
    const action = status === "Aktif" ? "Hapus" : "Aktifkan";
    Alert.alert(
      `${action} Topik`,
      `Apakah Anda yakin ingin ${action.toLowerCase()} topik "${nama}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: action,
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/topik/${id}`);

              fetchTopiks();
              Alert.alert(
                "Berhasil",
                `Topik berhasil di${action.toLowerCase()}`
              );
            } catch (error) {
              console.error(`Error ${action.toLowerCase()} topik:`, error);
              Alert.alert("Error", `Gagal ${action.toLowerCase()} topik`);
            }
          },
        },
      ]
    );
  };

  const handleEditTopik = (topik) => {
    const topikData = {
      tpk_nama: topik.nama,
      tpk_pesan_pertama: topik.pesanPertama,
      tpk_pesan_terakhir: topik.pesanTerakhir,
      tpk_id: topik.id,
    };

    navigation.navigate("TopikForm", {
      topik: topikData,
      mode: "edit",
      title: "Edit Topik",
    });
  };

  const handleAddTopik = () => {
    navigation.navigate("TopikForm", {
      mode: "add",
      title: "Tambah Topik",
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTopiks();
  };

  const SwipeableRow = ({ item }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const [isOpen, setIsOpen] = useState(false);

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event) => {
      if (event.nativeEvent.state === State.END) {
        const { translationX } = event.nativeEvent;

        if (translationX < -80) {
          Animated.timing(translateX, {
            toValue: -80,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setIsOpen(true));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => setIsOpen(false));
        }
      }
    };

    const closeSwipe = () => {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    };

    return (
      <GestureHandlerRootView>
        <View style={styles.swipeableRowContainer}>
          {/* Hidden Action Button */}
          <View
            style={[
              styles.hiddenButton,
              {
                backgroundColor:
                  item.status === "Aktif" || item.status === 1
                    ? "#ff4757"
                    : "#007bff",
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                closeSwipe();
                handleDelete(item.id, item.nama, item.status);
              }}
              style={styles.actionButton}
              activeOpacity={0.7}>
              <Ionicons
                name={
                  item.status === "Aktif" || item.status === 1
                    ? "trash-outline"
                    : "refresh-outline"
                }
                size={24}
                color="white"
              />
              <Text style={styles.deleteText}>
                {item.status === "Aktif" || item.status === 1
                  ? "Hapus"
                  : "Pulihkan"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Swipeable Content */}
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            activeOffsetX={[-20, 20]}
            failOffsetY={[-10, 10]}>
            <Animated.View
              style={[
                styles.rowFront,
                {
                  transform: [{ translateX }],
                },
              ]}>
              <TouchableOpacity
                style={styles.topikItem}
                onPress={() => {
                  if (isOpen) {
                    closeSwipe();
                  } else {
                    handleEditTopik(item);
                  }
                }}
                activeOpacity={0.8}>
                <View style={styles.topikContent}>
                  <View style={styles.topikInfo}>
                    <Text style={styles.topikName}>{item.nama}</Text>
                    <Text style={styles.topikSubtitle}>
                      pembukaaan :{" "}
                      {(item.pesanPertama || "Belum ada pesan")
                        .split(" ")
                        .slice(0, 10)
                        .join(" ") +
                        ((item.pesanPertama?.split(" ").length || 0) > 30
                          ? "..."
                          : "")}
                    </Text>
                    <Text style={styles.topikSubtitle}>
                      penutup :{" "}
                      {(item.pesanTerakhir || "Belum ada pesan")
                        .split(" ")
                        .slice(0, 10)
                        .join(" ") +
                        ((item.pesanTerakhir?.split(" ").length || 0) > 30
                          ? "..."
                          : "")}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === "Aktif" ? "#D7385E" : "#6c757d",
                    },
                  ]}>
                  <Text style={styles.statusText}>
                    {item.status || "Aktif"}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </GestureHandlerRootView>
    );
  };

  const renderTopikItem = ({ item }) => <SwipeableRow item={item} />;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D7385E" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("TopicManageTitle")}</Text>
      </View>

      <FlatList
        data={topiks}
        renderItem={renderTopikItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada topik tersedia</Text>
            <Text style={styles.emptySubtext}>
              Tap tombol "Tambah" untuk membuat topik baru
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTopik}
        activeOpacity={0.8}>
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#D7385E",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  swipeableRowContainer: {
    marginBottom: 10,
    position: "relative",
    height: 150,
  },
  hiddenButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    height: 150,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4757",
    borderRadius: 12,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  rowFront: {
    backgroundColor: "transparent",
  },
  topikItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    height: "100%",
  },
  topikContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  topikInfo: {
    flex: 1,
  },
  topikName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  topikSubtitle: {
    fontSize: 13,
    color: "#888",
    paddingBottom: 10,
    paddingTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 210,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
