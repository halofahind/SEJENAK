import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { API_BASE_URL } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const Topik = ({ navigation }) => {
  const [topiks, setTopiks] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
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

      const data = await response.json();

      const aktifTopiks = data.filter((topik) => topik.status === "Aktif");

      console.log(aktifTopiks);
      setTopiks(aktifTopiks);
    } catch (error) {
      console.error("Error fetching topiks:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handlePilihTopik = async () => {
    if (!selectedTopic) return;

    const userData = await AsyncStorage.getItem("userData");

    if (userData) {
      const parsedUserData = JSON.parse(userData);

      const userId = parsedUserData.id;

      const newKonseling = {
        topik: {
          id: selectedTopic.id,
        },
        userId: userId,
        tglMulai: new Date().toISOString(),
        tglSelesai: null,
        status: "Sedang Berjalan",
      };

      try {
        const response = await fetch(`${API_BASE_URL}/konseling`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newKonseling),
        });

        const result = await response.json();

        if (response.ok) {
          console.log(result);

          navigation.navigate("DetailKonseling", {
            topic: selectedTopic.nama,
            msg1: selectedTopic.pesanPertama,
            msg2: selectedTopic.pesanTerakhir,
            status: result.status,
            konId: result.konId,
            isHistory: false,
          });
        } else {
          Alert.alert("Gagal", "Gagal membuat sesi konseling");
        }
      } catch (error) {
        console.error("Error:", error.message);
        Alert.alert("Error", "Terjadi kesalahan saat membuat sesi konseling");
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#e91e63" />
          <Text>Memuat daftar topik...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("TopicSelectTitle")}</Text>
        <Text style={styles.subtitle}>{t("TopicSelectSubTitle")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {topiks.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              selectedTopic?.id === topic.id && styles.cardSelected,
            ]}
            onPress={() => handleTopicSelect(topic)}
            activeOpacity={0.8}>
            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.cardText,
                  selectedTopic?.id === topic.id && styles.cardTextSelected,
                ]}>
                {topic.nama}
              </Text>
              <View
                style={[
                  styles.radioButton,
                  selectedTopic?.id === topic.id && styles.radioButtonSelected,
                ]}>
                {selectedTopic?.id === topic.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.selectButton,
          !selectedTopic && styles.selectButtonDisabled,
        ]}
        onPress={handlePilihTopik}
        disabled={!selectedTopic}
        activeOpacity={selectedTopic ? 0.8 : 1}>
        <Text style={styles.selectButtonText}>{t("TopicSelectBtn")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D7385E",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: "#D7385E",
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  cardTextSelected: {
    color: "#D7385E",
    fontWeight: "500",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: "#D7385E",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D7385E",
  },
  selectButton: {
    backgroundColor: "#D7385E",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    margin: 20,
    shadowColor: "#D7385E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  selectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Topik;
