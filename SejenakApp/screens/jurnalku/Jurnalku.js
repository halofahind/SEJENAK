import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import React, { useCallback, useEffect, useState } from "react";

import axios from "axios";

import { API_BASE_URL } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Jurnalku() {
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const userData = await AsyncStorage.getItem("userData");
          const parsedUserData = JSON.parse(userData);

          const response = await axios.get(
            `${API_BASE_URL}/transaksiJurnalSelesai?id=${parsedUserData.id}`
          );

          const formattedData = response.data.map((item) => ({
            id: item.transaksi.id.toString(),
            title: item.jurnal.judul,
            image: require("../../assets/Jurnalku/2.png"),
            date: `Ditulis pada ${new Date(
              item.jurnal.createDate
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          }));

          setData(formattedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Journalku</Text>
        <Ionicons name="search-outline" size={20} color="#000" />
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Tampilkan Berdasarkan</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Tanggal</Text>
          <Ionicons name="chevron-down" size={16} color="#555" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={20} color="#555" />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Belum ada jurnal</Text>
            <Text style={styles.emptySubtext}>
              Mulai isi jurnal harianmu dengan mengunjungi menu beranda
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterLabel: {
    color: "#555",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
  },
  filterText: {
    marginRight: 4,
    color: "#555",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  cardImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
  },
  cardDate: {
    fontSize: 12,
    color: "#999",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
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
