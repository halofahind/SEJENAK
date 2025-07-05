import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import styles from "./styles"; // ganti dengan file styles kamu
import { API_BASE_URL } from "../config"; // ganti sesuai lokasi config kamu

export default function JurnalList({ navigation }) {
  const [materis, setMateris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMateris();
  }, []);

  const fetchMateris = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jurnals`);
      const data = await response.json();
      setMateris(data);
    } catch (error) {
      console.error("Error fetching materis:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id, nama) => {
    Alert.alert(
      "Hapus Materi",
      `Apakah Anda yakin ingin menghapus materi "${nama}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/materi/${id}`);
              fetchMateris();
              Alert.alert("Berhasil", "Materi berhasil dihapus");
            } catch (error) {
              console.error("Error deleting materi:", error);
              Alert.alert("Error", "Gagal menghapus materi");
            }
          },
        },
      ]
    );
  };

  const handleEditMateri = (materi) => {
    const materiData = {
      mtr_judul: materi.judul,
      mtr_deskripsi: materi.deskripsi,
      mtr_id: materi.id,
    };

    navigation.navigate("MateriForm", {
      materi: materiData,
      mode: "edit",
      title: "Edit Materi",
    });
  };

  const handleAddMateri = () => {
    navigation.navigate("MateriForm", {
      mode: "add",
      title: "Tambah Materi",
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMateris();
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
          Animated.timing(translateX, {
            toValue: -200,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setIsDeleting(true);
            setTimeout(() => {
              onDelete(item.id, item.judul);
              setIsDeleting(false);
            }, 100);
          });
        } else {
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
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.rowFront,
              { transform: [{ translateX }], opacity: isDeleting ? 0.5 : 1 },
            ]}
          >
            <TouchableOpacity
              style={styles.item}
              onPress={() => onEdit(item)}
              activeOpacity={0.7}
            >
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.judul}</Text>
                <Text style={styles.itemSubtitle}>
                  {item.deskripsi || "Tidak ada deskripsi"}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Aktif</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  };

  const renderMateriItem = ({ item }) => (
    <SwipeableRow
      item={item}
      onDelete={handleDelete}
      onEdit={handleEditMateri}
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
        <Text style={styles.title}>Daftar Materi</Text>
      </View>

      <FlatList
        data={materis}
        renderItem={renderMateriItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada materi tersedia</Text>
            <Text style={styles.emptySubtext}>
              Tap tombol "Tambah" untuk menambahkan materi baru
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddMateri}
        activeOpacity={0.8}
      >
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
