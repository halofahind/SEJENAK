import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";

// Tambahkan gambar kutipan di sini
const quoteImages = [
  require("../../assets/Home/1.png"),
  require("../../assets/Home/2.png"),
  require("../../assets/Home/1.png"),
];

import { useTranslation } from "react-i18next";

export default function JurnalDetailPertanyaan({ route, navigation }) {
  const { jurnal, transaksi, jenisjurnal } = route.params;
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchJurnalData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/transaksiJurnalDetail?id=${transaksi.id}`
        );
        setPages(res.data);

        // Ambil jawaban yang sudah ada dari API dan simpan ke state
        const initialAnswers = {};
        res.data.forEach((item) => {
          if (item.jawaban) {
            initialAnswers[item.id] = item.jawaban;
          }
        });
        setAnswers(initialAnswers);

        const firstUnansweredIndex = res.data.findIndex(
          (item) => !item.jawaban || item.jawaban.trim() === ""
        );

        setCurrentPage(firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJurnalData();
  }, []);

  const handleNext = async () => {
    const currentItem = pages[currentPage];
    const jawaban =
      currentItem.jenis === "kutipan" ? "done" : answers[currentItem.id] || "";

    try {
      await axios.post(`${API_BASE_URL}/updateJawabanJurnal`, {
        id: currentItem.id,
        jawaban: jawaban,
      });
      console.log("Jawaban berhasil dikirim:", jawaban);
    } catch (error) {
      console.error("Gagal mengirim jawaban:", error);
    }

    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      try {
        await axios.put(`${API_BASE_URL}/selesaikanJurnal?id=${transaksi.id}`);
        const formattedData = {
          id: transaksi.id.toString(),
          title: jurnal.title,
          image: require("../../assets/Jurnalku/2.png"),
          dateObj: new Date(transaksi.date),
          date: `${t("JournalTextDate")} ${new Date(
            transaksi.date
          ).toLocaleString([], {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`,
        };

        navigation.navigate("JurnalPenutup", { jurnal: formattedData });
      } catch (error) {
        console.error("Gagal menyelesaikan jurnal:", error);
      }
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAnswerChange = (text) => {
    setAnswers({ ...answers, [pages[currentPage].id]: text });
  };

  useEffect(() => {
    const currentItem = pages[currentPage];
    if (currentItem?.jenis === "pertanyaan") {
      const answer = answers[currentItem.id];
      setIsNextDisabled(!answer || answer.trim() === "");
    } else {
      setIsNextDisabled(false);
    }
  }, [answers, currentPage, pages]);

  const progress =
    pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#E9748F" />
      </SafeAreaView>
    );
  }

  const currentItem = pages[currentPage];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerPink}>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "DaftarJurnal", params: { jenisjurnal } }],
            })
          }
          style={styles.backButton}
        >
          <Icon name="close" size={24} color="#fff" />
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

      <ScrollView contentContainerStyle={styles.content}>
        {currentItem ? (
          currentItem.jenis === "kutipan" ? (
            <View style={styles.quoteContainer}>
              <Image
                source={quoteImages[currentPage % quoteImages.length]}
                style={styles.quoteImage}
              />
              <Text style={styles.quoteText}>{currentItem.isi}</Text>
            </View>
          ) : (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{currentItem.isi}</Text>
              <Text style={styles.exampleText}>{currentItem.placeholder}</Text>
              <TextInput
                style={styles.input}
                placeholder="Tulis jawaban di sini..."
                placeholderTextColor="#888"
                value={answers[currentItem.id] || ""}
                onChangeText={handleAnswerChange}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          )
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Tidak ada konten untuk ditampilkan.
          </Text>
        )}
      </ScrollView>

      <View style={styles.buttonRow}>
        {currentPage > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backText}>Sebelumnya</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, isNextDisabled && styles.disabledBtn]}
          onPress={handleNext}
          disabled={isNextDisabled}
        >
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
    alignSelf: "flex-end",
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
    fontSize: 16,
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  // Kutipan
  quoteContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  quoteImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    lineHeight: 24,
    fontStyle: "italic",
  },
  // Pertanyaan
  questionContainer: {
    backgroundColor: "#fff",
    padding: 0,
    marginHorizontal: 0,
    marginTop: 10,
  },
  questionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 0,
    fontWeight: "600",
  },
  exampleText: {
    fontSize: 12,
    color: "#333",
    marginVertical: 20,
    fontWeight: "400",
    fontStyle: "italic",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 0,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#fff",
    minHeight: 120,
    color: "#333",
  },
  // Tombol
  buttonRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
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
  disabledBtn: {
    backgroundColor: "#ccc",
  },
});
