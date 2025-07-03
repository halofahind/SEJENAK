import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TopikForm = ({ navigation, route }) => {
  const { topik, mode, title } = route.params;
  const isEditMode = mode === "edit";
  const [namaTopik, setNamaTopik] = useState("");
  const [pesanPertama, setPesanPertama] = useState("");
  const [pesanTerakhir, setPesanTerakhir] = useState("");

  const [formData, setFormData] = useState({
    tpk_nama: namaTopik || "",
    tpk_pesan_pertama: pesanPertama || "",
    tpk_pesan_terakhir: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = "http://10.1.47.159:8080"; // Ganti dengan URL API Anda

  useEffect(() => {
    setFormData({
      tpk_nama: namaTopik,
      tpk_pesan_pertama: pesanPertama,
      tpk_pesan_terakhir: pesanTerakhir,
    });
  }, [namaTopik, pesanPertama, pesanTerakhir]);

  const validateForm = () => {
    const newErrors = {};

    if (!namaTopik.trim()) {
      // newErrors.tpk_nama = "Nama topik tidak boleh kosong";
      newErrors.tpk_pesan_pertama = "Pesan Pertama tidak boleh kosong";
      newErrors.tpk_pesan_terakhir = "Pesan Terakhir tidak boleh kosong";
    } else if (formData.tpk_nama.trim().length < 3) {
      newErrors.tpk_nama = "Nama topik minimal 3 karakter";
    }
    if (!pesanPertama.trim()) {
      newErrors.tpk_nama = "Nama topik tidak boleh kosong";
      newErrors.tpk_pesan_pertama = "Pesan Pertama tidak boleh kosong";
      newErrors.tpk_pesan_terakhir = "Pesan Terakhir tidak boleh kosong";
    } else if (formData.tpk_nama.trim().length < 3) {
      newErrors.tpk_nama = "Nama topik minimal 3 karakter";
    }

    if (!pesanTerakhir.trim()) {
      newErrors.tpk_nama = "Nama topik tidak boleh kosong";
      newErrors.tpk_pesan_pertama = "Pesan Pertama tidak boleh kosong";
      newErrors.tpk_pesan_terakhir = "Pesan Terakhir tidak boleh kosong";
    } else if (formData.tpk_nama.trim().length < 3) {
      newErrors.tpk_nama = "Nama topik minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const topikData = {
        nama: namaTopik || "",
        pesanPertama: pesanPertama || "",
        pesanTerakhir: pesanTerakhir || "",
      };

      const response = await fetch(API_BASE_URL + "/topik", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(topikData),
      });

      const responseData = await response.json();

      if (response.ok) {
        const successMessage = isEditMode
          ? "Topik berhasil diperbarui"
          : "Topik berhasil ditambahkan";

        Alert.alert("Berhasil", successMessage, [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        throw new Error("Failed to save topik");
      }
    } catch (error) {
      console.error("Error saving topik:", error);
      const errorMessage = isEditMode
        ? "Gagal memperbarui topik"
        : "Gagal menambahkan topik";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        "Batalkan Perubahan",
        "Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang.",
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

  const hasUnsavedChanges = () => {
    if (!isEditMode) {
      return (
        formData.tpk_nama.trim() ||
        formData.tpk_pesan_pertama.trim() ||
        formData.tpk_pesan_terakhir.trim()
      );
    }

    return (
      formData.tpk_nama !== (topik?.tpk_nama || "") ||
      formData.tpk_pesan_pertama !== (topik?.tpk_pesan_pertama || "") ||
      formData.tpk_pesan_terakhir !== (topik?.tpk_pesan_terakhir || "")
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditMode ? "Edit Topik" : "Tambah Topik Baru"}
            </Text>
            <Text style={styles.subtitle}>
              {isEditMode
                ? "Perbarui informasi topik konseling"
                : "Buat topik konseling baru untuk pengguna"}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nama Topik <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.tpk_nama && styles.inputError]}
                value={namaTopik}
                onChangeText={setNamaTopik}
                placeholder="Contoh: Keluarga, Pasangan, Pertemanan"
                placeholderTextColor="#999"
                maxLength={100}
              />
              {errors.tpk_nama && (
                <Text style={styles.errorText}>{errors.tpk_nama}</Text>
              )}
              <Text style={styles.charCount}>{formData.length}/100</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pesan Pembuka</Text>
              <Text style={styles.labelDesc}>
                Pesan yang akan ditampilkan saat memulai konseling dengan topik
                ini
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={pesanPertama}
                onChangeText={setPesanPertama}
                placeholder="Masukkan pesan pembuka yang ramah dan mendukung..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.charCount}>
                {formData.tpk_pesan_pertama.length}/500
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pesan Penutup</Text>
              <Text style={styles.labelDesc}>
                Pesan yang akan ditampilkan di akhir sesi konseling
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={pesanTerakhir}
                onChangeText={setPesanTerakhir}
                placeholder="Masukkan pesan penutup yang memberikan harapan..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.charCount}>
                {formData.tpk_pesan_terakhir.length}/500
              </Text>
            </View>

            {isEditMode && (
              <View style={styles.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#2196F3"
                />
                <Text style={styles.infoText}>
                  Topik ini telah dibuat pada{" "}
                  {new Date(topik?.tpk_created_date).toLocaleDateString(
                    "id-ID"
                  )}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isEditMode ? "#4CAF50" : "#e91e63" },
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {isEditMode ? "Perbarui" : "Simpan"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  labelDesc: {
    fontSize: 13,
    color: "#777",
    marginBottom: 8,
    lineHeight: 18,
  },
  required: {
    color: "#e91e63",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "white",
    color: "#333",
  },
  inputError: {
    borderColor: "#e91e63",
    backgroundColor: "#fff5f5",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#e91e63",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1976D2",
    marginLeft: 8,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});

export default TopikForm;
