import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const pages = [
  {
    id: 1,
    image: require("../../assets/home/o.png"),
    text: "Terkadang kita menghabiskan waktu untuk menyesali kegagalan, kita abai pada kemajuan yang kita buat",
  },
  {
    id: 2,
    image: require("../../assets/home/o3.png"),
    text: "Mari fokuskan pikiran untuk menghargai jalan keluar atas masalah yang dihadapi",
  },
  // Tambahkan halaman lain di sini jika perlu
];

export default function HalamanJournal({ navigation }) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const progress = ((currentPage + 1) / pages.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header pink */}
      <View style={styles.headerPink}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Progress Section */}
      <View style={styles.progressContainer}>
        <Text style={styles.judul}>Berdamai dengan Pikiran</Text>
        <Text style={styles.pageCount}>
          {currentPage + 1}/{pages.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      {/* Gambar dan teks */}
      <View style={styles.content}>
        <Image source={pages[currentPage].image} style={styles.image} />
        <Text style={styles.text}>{pages[currentPage].text}</Text>
      </View>

      {/* Button navigasi */}
      <View style={styles.buttonRow}>
        {currentPage > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backText}>Sebelumnya</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentPage === pages.length - 1 ? "Selesai" : "Selanjutnya"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerPink: {
    height: 60,
    backgroundColor: "#E9748F",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  judul: {
    fontWeight: "bold",
    color: "#333",
  },
  pageCount: {
    fontSize: 12,
    color: "#555",
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#ddd",
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 6,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#E9748F",
    borderRadius: 10,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  backBtn: {
    borderColor: "#6C63FF",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backText: {
    color: "#6C63FF",
    fontWeight: "bold",
  },
  nextBtn: {
    backgroundColor: "#6C63FF",
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
