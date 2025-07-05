import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL } from "../../../utils/constants";

export default function UpdateMotivasiScreen({ route, navigation }) {
  const { item } = route.params;
  const [updatedText, setUpdatedText] = useState(item?.motivasiText || "");

  const handleUpdate = async () => {
    if (updatedText.trim() === "") {
      Alert.alert("Oops", "Motivasi tidak boleh kosong.");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/motivasi/update/${item.motivasiId}`, {
        motivasiText: updatedText,
      });

      Alert.alert("Berhasil", "Motivasi berhasil diperbarui.");
      navigation.goBack();
    } catch (error) {
      console.error("Gagal update:", error.message);
      Alert.alert("Error", "Gagal memperbarui motivasi.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D7385E" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Motivasi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Tulis Motivasi Baru</Text>
        <TextInput
          style={styles.input}
          multiline
          value={updatedText}
          onChangeText={setUpdatedText}
          placeholder="Edit motivasi di sini..."
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Simpan Perubahan</Text>
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
    backgroundColor: "#D7385E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 35,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D7385E",
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#D7385E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
