import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
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
import axios from "axios";
import { API_BASE_URL } from "../../../utils/constants";

export default function MotivasiScreen({ navigation }) {
  const [motivasiList, setMotivasiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMotivasi();
  }, []);

  const fetchMotivasi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/motivasi/get`);
      setMotivasiList(response.data);
    } catch (error) {
      console.error("Gagal ambil motivasi:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (id, text, status) => {
    let confirmationText = status === "Aktif" ? "Hapus" : "Pulihkan";
    Alert.alert(
      "Hapus Motivasi",
      `Yakin ingin ${confirmationText} motivasi"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: confirmationText,
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/motivasi/delete/${id}`);
              fetchMotivasi();
              Alert.alert(
                "Berhasil",
                `Motivasi berhasil di${confirmationText}`
              );
            } catch (error) {
              console.error("Gagal hapus motivasi:", error.message);
              Alert.alert("Gagal", "Terjadi kesalahan saat menghapus motivasi");
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMotivasi();
  };

  const getStatusText = (status) =>
    status === "Aktif" || status === 1 ? "Aktif" : "Tidak Aktif";

  const getStatusColor = (status) =>
    status === "Aktif" || status === 1 ? "#e91e63" : "#6c757d";

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
          {/* Delete Button Background */}
          <View style={styles.hiddenButton}>
            {item.status === "Aktif" || item.status === 1 ? (
              <TouchableOpacity
                onPress={() => {
                  closeSwipe();
                  handleDelete(item.motivasiId, item.motivasiText, item.status);
                }}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
                <Text style={styles.deleteText}>Hapus</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  closeSwipe();
                  handleDelete(item.motivasiId, item.motivasiText, item.status);
                }}
                style={styles.deleteButton}
              >
                <Ionicons name="refresh-outline" size={24} color="white" />
                <Text style={styles.deleteText}>Pulihkan</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Swipeable Foreground */}
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            activeOffsetX={[-20, 20]}
            failOffsetY={[-10, 10]}
          >
            <Animated.View
              style={[
                styles.rowFront,
                {
                  transform: [{ translateX }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("UpdateMotivasi", { item })}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardText}>{item.motivasiText}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </GestureHandlerRootView>
    );
  };

  const renderItem = ({ item }) => <SwipeableRow item={item} />;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D7385E" />
          <Text style={styles.loadingText}>Memuat motivasi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Motivasi</Text>
      </View>

      <FlatList
        data={motivasiList}
        renderItem={renderItem}
        keyExtractor={(item) => item.motivasiId.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada motivasi</Text>
            <Text style={styles.emptySubtext}>
              Tap tombol + untuk menambahkan motivasi baru
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddMotivasi")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D7385E",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#D7385E",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  swipeContainer: {
    marginBottom: 12,
    position: "relative",
  },
  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
    width: 100,
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: "#ff4757",
    width: 100,
    height: "100%",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    flex: 1,
    paddingRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 200,
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
  swipeableRowContainer: {
    marginBottom: 12,
    position: "relative",
    height: 80, // pastikan tingginya konsisten
  },

  hiddenButton: {
    backgroundColor: "#ff4757",
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
  },

  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
