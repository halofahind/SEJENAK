import React, { useState, useEffect } from "react";
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

export default function TopikList({ navigation }) {
  const [topiks, setTopiks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTopiks();
  }, []);

  const fetchTopiks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/topiks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Data topik:", response);

      const data = await response.json();
      setTopiks(data);
    } catch (error) {
      console.error("Error fetching topiks:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id, nama) => {
    Alert.alert(
      "Hapus Topik",
      `Apakah Anda yakin ingin menghapus topik "${nama}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/topik/${id}`);
              fetchTopiks();
              Alert.alert("Berhasil", "Topik berhasil dihapus");
            } catch (error) {
              console.error("Error deleting topik:", error);
              Alert.alert("Error", "Gagal menghapus topik");
            }
          },
        },
      ]
    );
  };

  const handleEditTopik = (topik) => {
    console.log("Data yang dikirim:", topik); // Debugging

    // Pastikan struktur data sesuai dengan yang diharapkan TopikForm
    const topikData = {
      tpk_nama: topik.nama,
      tpk_pesan_pertama: topik.pesanPertama,
      tpk_pesan_terakhir: topik.pesanTerakhir,
      tpk_id: topik.id,
    };

    navigation.navigate("TopikForm", {
      topik: topikData, // Gunakan key 'topik' bukan 'topiks'
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

  const SwipeableRow = ({ item, onDelete, onEdit }) => {
    const translateX = new Animated.Value(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event) => {
      if (event.nativeEvent.state === State.END) {
        const { translationX } = event.nativeEvent;

        if (translationX < -100) {
          // Swipe left untuk delete
          Animated.timing(translateX, {
            toValue: -200,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setIsDeleting(true);
            setTimeout(() => {
              onDelete(item.id, item.nama);
              setIsDeleting(false);
            }, 100);
          });
        } else {
          // Kembalikan ke posisi semula
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    return (
      <View style={styles.swipeContainer}>
        <View style={styles.deleteBackground}>
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={styles.deleteText}>Hapus</Text>
        </View>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}>
            <Animated.View
              style={[
                styles.rowFront,
                {
                  transform: [{ translateX }],
                  opacity: isDeleting ? 0.5 : 1,
                },
              ]}>
              <TouchableOpacity
                style={styles.topikItem}
                onPress={() => onEdit(item)}
                activeOpacity={0.7}>
                <View style={styles.topikContent}>
                  <View style={styles.topikInfo}>
                    <Text style={styles.topikName}>{item.nama}</Text>
                    <Text style={styles.topikSubtitle}>
                      {item.pesanPertama || "Belum ada pesan"}
                    </Text>
                    <Text style={styles.topikSubtitle}>
                      {item.pesanTerakhir || "Belum ada pesan"}
                    </Text>
                  </View>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Aktif</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </View>
    );
  };

  const renderTopikItem = ({ item }) => (
    <SwipeableRow
      item={item}
      onDelete={handleDelete}
      onEdit={handleEditTopik}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daftar Topik</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingTop: 40,
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
  fabText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e91e63",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e91e63",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
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
    paddingBottom: 100,
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
    backgroundColor: "#ff4757",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 12,
    flexDirection: "row",
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
    backgroundColor: "#e91e63",
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
  instructionContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 8,
    padding: 12,
  },
  instructionText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});
