import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UpdateMotivasiScreen({ route, navigation }) {
  const { item } = route.params;

  const [motivasiText, setMotivasiText] = useState(item?.motivasiText || "");
  const [status, setStatus] = useState(item?.status || "Aktif");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasChanged = () => motivasiText !== item?.motivasiText;

  const validate = () => {
    if (!motivasiText.trim()) {
      setError("Motivasi tidak boleh kosong");
      return false;
    }
    setError("");
    return true;
  };

  const isDisabled = status !== "Aktif" && status !== 1;

  const handleUpdate = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://192.168.1.7:8080/motivasi/update/${item.motivasiId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivasiText }),
        }
      );

      if (res.ok) {
        Alert.alert("Berhasil", "Motivasi berhasil diperbarui", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Gagal", "Terjadi kesalahan saat memperbarui.");
      }
    } catch (err) {
      Alert.alert("Error", "Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanged()) {
      Alert.alert(
        "Batalkan Perubahan",
        "Perubahan belum disimpan. Yakin ingin membatalkan?",
        [
          { text: "Lanjut Edit", style: "cancel" },
          {
            text: "Ya, Batalkan",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Motivasi</Text>
            <Text style={styles.subtitle}>
              Perbarui teks motivasi pengguna
            </Text>
          </View>

          {/* Form */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Motivasi <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              value={motivasiText}
              onChangeText={setMotivasiText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={255}
              placeholder="Tulis motivasi di sini..."
              placeholderTextColor="#999"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Text style={styles.charCount}>{motivasiText.length}/255</Text>
          </View>
        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || isDisabled) && styles.submitButtonDisabled,
            ]}
            onPress={handleUpdate}
            disabled={loading || isDisabled}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Perbarui</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 120 },
  header: {
    backgroundColor: "#D7385E",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomRightRadius: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
  },
  inputGroup: { padding: 20 },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  required: {
    color: "#e91e63",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#333",
  },
  inputError: {
    borderColor: "#e91e63",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    color: "#e91e63",
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
