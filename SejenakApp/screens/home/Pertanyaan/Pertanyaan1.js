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
    image: require("../../../assets/OnBoarding/o3.png"),
    text: "Terkadang kita menghabiskan waktu untuk menyesali kegagalan, kita abai pada kemajuan yang kita buat",
  },
  {
    id: 2,
    image: require("../../../assets/Home/1.png"),
    text: "Mari fokuskan pikiran untuk menghargai jalan keluar atas masalah yang dihadapi",
  },
  {
    id: 3,
    image: require("../../../assets/Home/1.png"),
    text: "Masalah apa yang menganggu pikiranmu saat ini?",
  },
  {
    id: 4,
    image: require("../../../assets/Home/1.png"),
    text: "Ceritakan lebih lanjut penyebab masalah tersebut",
  },
  {
    id: 5,
    image: require("../../../assets/Home/1.png"),
    text: "Terus merasa bersalah tidak mengubah segalanya, untuk mewujudkan impian kita perli bangkit dari kegagalan",
  },
  {
    id: 6,
    image: require("../../../assets/Home/1.png"),
    text: "Tuliskan apa saja usaha yang sudah kamu lakukan selama ini",
  },
  {
    id: 7,
    image: require("../../../assets/Home/1.png"),
    text: "Fokus pada penyelesaian masalah membantu melepas simpul kusut di pikiranmu",
  },
  {
    id: 8,
    image: require("../../../assets/Home/1.png"),
    text: "Adapa tips buat kamu untuk bisa menentukan langkah selanjutnya, pilih yang kamu suka ya!",
  },
  {
    id: 9,
    image: require("../../../assets/Home/1.png"),
    text: "Terimakasih sudah berusaha tegar dan mau belajar untuk bangkit, kamu hebat dan berhak bahagia",
  },
  {
    id: 10,
    image: require("../../../assets/Home/1.png"),
    text: "Teruslah fokus pada apa saja yang bisa dilakukan dan jangan lupa untuk percaya diri sendiri, yaa!",
  },
];

export default function Pertanyaan1({ navigation }) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.navigate("Jurnal1");
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
      <View style={styles.headerPink}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.judul}>Berdamai dengan Pikiran</Text>
        <Text style={styles.pageCount}>
          {currentPage + 1}/{pages.length}
        </Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.content}>
        <Image source={pages[currentPage].image} style={styles.image} />
        <Text style={styles.text}>{pages[currentPage].text}</Text>
      </View>

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
