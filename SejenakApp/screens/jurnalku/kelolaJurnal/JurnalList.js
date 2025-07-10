import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

export default function JurnalList({ route, navigation }) {
  const { jenisjurnal } = route.params;
  const [jurnalList, setJurnalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchJurnal();
    }, [])
  );

  const fetchJurnal = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/jurnalbyjenis?id=${jenisjurnal.id}`
      );
      setJurnalList(response.data);
    } catch (error) {
      console.error("Gagal ambil jurnal:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (id, status) => {
    let confirmationText = status === "Aktif" ? "Hapus" : "Pulihkan";
    Alert.alert(
      `${confirmationText} Jurnal`,
      `Yakin ingin ${confirmationText.toLowerCase()} jurnal ini?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: confirmationText,
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/jurnal/${id}`);
              fetchJurnal();
              Alert.alert(
                "Berhasil",
                `Jurnal berhasil di${confirmationText.toLowerCase()}`
              );
            } catch (error) {
              console.error("Gagal hapus jurnal:", error.message);
              Alert.alert("Gagal", "Terjadi kesalahan saat menghapus jurnal");
            }
          },
        },
      ]
    );
  };

  const handleEditJurnal = (jurnal) => {
    navigation.navigate("JurnalKelolaForm", {
      jenisjurnal: jenisjurnal,
      journal: jurnal,
      mode: "edit",
      title: "Form Jurnal",
    });
  };

  const handleAddJurnal = () => {
    navigation.navigate("JurnalKelolaForm", {
      jenisjurnal: jenisjurnal,
      mode: "add",
      title: "Form Jurnal",
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJurnal();
  };

  const getStatusText = (status) =>
    status === "Aktif" || status === 1 ? "Aktif" : "Tidak Aktif";

  const getStatusColor = (status) =>
    status === "Aktif" || status === 1 ? "#D7385E" : "#6c757d";

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
          <View
            style={[
              styles.hiddenButton,
              {
                backgroundColor:
                  item.status === "Aktif" || item.status === 1
                    ? "#ff4757"
                    : "#007bff",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                closeSwipe();
                handleDelete(item.id, item.status);
              }}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
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
                onPress={() => handleEditJurnal(item)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.judul}</Text>
                    <Text style={styles.cardText}>{item.desc}</Text>
                  </View>
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
          <Text style={styles.loadingText}>Memuat jurnal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{jenisjurnal.title}</Text>
      </View>

      <FlatList
        data={jurnalList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada jurnal</Text>
            <Text style={styles.emptySubtext}>
              Tap tombol + untuk menambahkan jurnal baru
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleAddJurnal()}
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
  swipeableRowContainer: {
    marginBottom: 12,
    position: "relative",
    height: 90,
  },
  hiddenButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 4,
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
    height: "100%",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
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
});
