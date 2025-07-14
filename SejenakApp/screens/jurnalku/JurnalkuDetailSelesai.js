import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL } from "../../utils/constants";
import axios from "axios";

export default function JurnalDetailSelesai({ route, navigation }) {
  const { jurnal } = route.params;
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [jawabanEdit, setJawabanEdit] = useState({});
  const scrollViewRef = useRef();
  const inputRefs = useRef({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/transaksiJurnalDetail?id=${jurnal.id}`)
      .then((response) => response.json())
      .then((data) => {
        setDetail(data);
        const initialJawaban = {};
        data.forEach((item) => {
          initialJawaban[item.id] = item.jawaban;
        });
        setJawabanEdit(initialJawaban);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jurnal detail:", error);
        setLoading(false);
      });
  }, [jurnal.id, refreshKey]);

  const handleSave = async () => {
    try {
      for (const item of detail) {
        if (item.jenis === "pertanyaan") {
          await axios.post(`${API_BASE_URL}/updateJawabanJurnal`, {
            id: item.id,
            jawaban: jawabanEdit[item.id],
          });
        }
      }
      setEditMode(false);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Gagal menyimpan jawaban:", error);
    }
  };

  const scrollToInput = (inputRef) => {
    setTimeout(() => {
      inputRef?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, y - 150),
            animated: true,
          });
        },
        (error) => {
          console.log("measureLayout error:", error);
        }
      );
    }, 100); // Slightly lower timeout = smoother
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/Home/1.png")}
          style={styles.headerImage}
        />
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>{jurnal.title}</Text>
            <Text style={styles.subtitle}>{jurnal.date}</Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#f87171"
                style={{ marginTop: 20 }}
              />
            ) : (
              detail.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.bullet}>•</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>{item.isi}</Text>
                    {item.jenis === "pertanyaan" &&
                      (editMode ? (
                        <TextInput
                          style={styles.input}
                          multiline
                          value={jawabanEdit[item.id]}
                          onChangeText={(text) =>
                            setJawabanEdit({
                              ...jawabanEdit,
                              [item.id]: text,
                            })
                          }
                          onFocus={() =>
                            scrollToInput(inputRefs.current[item.id])
                          }
                        />
                      ) : (
                        <Text style={styles.text}>{item.jawaban}</Text>
                      ))}
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={editMode ? handleSave : () => setEditMode(true)}
        >
          <Text style={styles.buttonText}>{editMode ? "Simpan" : "Edit"}</Text>
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
  header: {
    backgroundColor: "#E9748F",
    height: 180,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },
  headerImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: -10,
  },
  body: {
    paddingBottom: 0,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  bullet: {
    fontSize: 20,
    lineHeight: 22,
    marginRight: 8,
    color: "#1f2937",
    paddingTop: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
