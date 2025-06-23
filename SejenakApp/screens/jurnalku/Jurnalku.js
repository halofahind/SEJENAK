import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const data = [
  {
    id: "1",
    title: "Berdamai dengan Pikiran",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "2",
    title: "Berdamai dengan Kesalahan di masa lalu",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "3",
    title: "Bertumbuh dalam Duka",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "4",
    title: "It’s Okay Not To Be Okay",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "5",
    title: "Belajar Memaafkan Diri Sendiri",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "6",
    title: "Melepaskan Rasa Bersalah",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "7",
    title: "Menemukan Makna dalam Luka",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "8",
    title: "Perjalanan Menuju Pemulihan",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "9",
    title: "Mengelola Emosi dengan Sehat",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
  {
    id: "10",
    title: "Menerima Ketidaksempurnaan",
    image: require("../../assets/Jurnalku/2.png"),
    date: "Ditulis pada 14:27",
  },
];

export default function Jurnalku() {
  return (
    <View style={styles.container}>
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
      />
    </View>
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
});
