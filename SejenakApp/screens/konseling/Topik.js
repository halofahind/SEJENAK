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

const API_BASE_URL = "http://10.1.47.159:8080";

const Topik = ({ navigation }) => {
  const [topiks, setTopiks] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setTopiks(data);
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

    const userId = 3;
    const newKonseling = {
      topikId: selectedTopic.id,
      userId: userId,
      tglMulai: new Date().toISOString(),
      status: "Sedang Berjalan",
      createdBy: "user",
      createdDate: new Date().toISOString(),
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
        navigation.navigate("DetailKonseling", {
          topic: selectedTopic.nama,
          konId: result.konId, // ← pastikan backend return ini
          isHistory: false,
        });
      } else {
        Alert.alert("Gagal", "Gagal membuat sesi konseling");
      }
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Error", "Terjadi kesalahan saat membuat sesi konseling");
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
      <View style={styles.topicContainer}>
        <View style={styles.topicHeader}>
          <View style={styles.chatIcon}>
            <Text style={styles.chatIconText}>💬</Text>
          </View>
          <Text style={styles.topicTitle}>Pilih Topik</Text>
          <Text style={styles.topicSubtitle}>
            Permasalahan apa yang ingin Anda diskusikan?
          </Text>
        </View>

        <ScrollView style={styles.topicList}>
          {topiks.map((topic, index) => (
            <TouchableOpacity
              key={index}
              style={styles.topicOption}
              onPress={() => handleTopicSelect(topic)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.radioButton,
                  selectedTopic?.id === topic.id && styles.radioButtonSelected,
                ]}>
                {selectedTopic?.id === topic.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text
                style={[
                  styles.topicOptionText,
                  selectedTopic?.id === topic.id &&
                    styles.topicOptionTextSelected,
                ]}>
                {topic.nama}
              </Text>
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
          <Text style={styles.selectButtonText}>Pilih Topik</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  topicContainer: {
    flex: 1,
    padding: 20,
  },
  topicHeader: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  chatIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e91e63",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chatIconText: {
    fontSize: 24,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  topicSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  topicList: {
    flex: 1,
    paddingTop: 20,
  },
  topicOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: "#e91e63",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e91e63",
  },
  topicOptionText: {
    fontSize: 16,
    color: "#333",
  },
  topicOptionTextSelected: {
    color: "#e91e63",
    fontWeight: "500",
  },
  selectButton: {
    backgroundColor: "#e91e63",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#e91e63",
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
