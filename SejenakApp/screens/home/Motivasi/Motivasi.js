import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { API_BASE_URL } from "../../../utils/constants";

export default function MotivasiScreen({ navigation }) {
  const [motivasiList, setMotivasiList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchMotivasi();
    }, [])
  );

  const fetchMotivasi = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/motivasi/get`);
      setMotivasiList(res.data);
    } catch (err) {
      console.error("Gagal ambil motivasi:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/motivasi/delete/${id}`);
      setMotivasiList((prev) => prev.filter((item) => item.motivasiId !== id));
      Alert.alert("Berhasil", "Motivasi berhasil dihapus.");
    } catch (err) {
      console.error("Gagal hapus motivasi:", err.message);
      Alert.alert("Gagal", "Gagal menghapus motivasi. Coba lagi nanti.");
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(id)}
    >
      <Text style={styles.deleteButtonText}>Hapus</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.flatHeader}>
        <Text style={styles.flatTitle}>Daftar Motivasi</Text>
      </View>

      <ScrollView style={styles.scrollArea}>
        <View style={styles.listWrapper}>
          {motivasiList.map((item) => (
            <Swipeable
              key={item.motivasiId}
              renderRightActions={() => renderRightActions(item.motivasiId)}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("UpdateMotivasi", { item })}
              >
                <Text style={styles.cardText}>{item.motivasiText}</Text>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddMotivasi")}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  // Header baru
  flatHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  flatTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D7385E",
  },

  scrollArea: { flex: 1, paddingHorizontal: 20 },
  listWrapper: { gap: 16, paddingBottom: 60, marginTop: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  statusBadge: {
    backgroundColor: "#D7385E",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },

  fab: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#D7385E",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  deleteButton: {
    backgroundColor: "#D7385E",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 2,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
