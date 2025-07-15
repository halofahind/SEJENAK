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
import { API_BASE_URL } from "../../utils/constants";
import { useTranslation } from "react-i18next";
const TopikForm = ({ navigation, route }) => {
  const { topik, mode, title } = route.params;
  const isEditMode = mode === "edit";
  const { t } = useTranslation();
  // State initialization - sesuaikan dengan struktur
  const [namaTopik, setNamaTopik] = useState(
    mode === "edit" ? topik.tpk_nama || topik.nama || "" : ""
  );
  const [pesanPertama, setPesanPertama] = useState(
    mode === "edit" ? topik.tpk_pesan_pertama || topik.pesanPertama || "" : ""
  );
  const [pesanTerakhir, setPesanTerakhir] = useState(
    mode === "edit" ? topik.tpk_pesan_terakhir || topik.pesanTerakhir || "" : ""
  );
  const [formData, setFormData] = useState({
    tpk_nama: namaTopik || "",
    tpk_pesan_pertama: pesanPertama || "",
    tpk_pesan_terakhir: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      tpk_nama: namaTopik,
      tpk_pesan_pertama: pesanPertama,
      tpk_pesan_terakhir: pesanTerakhir,
    });
  }, [namaTopik, pesanPertama, pesanTerakhir]);

  const validateForm = () => {
    const newErrors = {};

    // Validate namaTopik
    if (!namaTopik.trim()) {
      newErrors.namaTopik = t("TopicNameRequiredError");
    } else if (namaTopik.trim().length < 3) {
      newErrors.namaTopik = t("TopicNameMinLengthError");
    }

    // Validate pesanPertama
    if (!pesanPertama.trim()) {
      newErrors.pesanPertama = t("FirstMessageRequiredError");
    } else if (pesanPertama.trim().length < 10) {
      newErrors.pesanPertama = t("FirstMessageMinLengthError");
    }

    // Validate pesanTerakhir
    if (!pesanTerakhir.trim()) {
      newErrors.pesanTerakhir = t("LastMessageRequiredError");
    } else if (pesanTerakhir.trim().length < 10) {
      newErrors.pesanTerakhir = t("LastMessageMinLengthError");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = isEditMode
        ? `${API_BASE_URL}/topik/${topik.tpk_id}`
        : `${API_BASE_URL}/topik`;

      const method = isEditMode ? "PUT" : "POST";

      const topikData = {
        nama: namaTopik,
        pesanPertama: pesanPertama,
        pesanTerakhir: pesanTerakhir,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topikData),
      });

      if (response.ok) {
        Alert.alert("Berhasil", "Topik berhasil diperbarui", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack(); // Kembali ke previous screen
              if (route.params?.onRefresh) {
                route.params.onRefresh(); // Panggil callback refresh jika ada
              }
            },
          },
        ]);
      }
    } catch (error) {
      // Error handling
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
              {isEditMode
                ? t("TopicManageEditTitle")
                : t("TopicManageAddTitle")}
            </Text>
            <Text style={styles.subtitle}>
              {isEditMode
                ? t("TopicManageAddSubTitle")
                : t("TopicManageEditSubTitle")}
            </Text>
          </View>

          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t("TopicNameLb")} <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.namaTopik && styles.inputError]}
                value={namaTopik}
                onChangeText={setNamaTopik}
                placeholder={t("TopicNamePh")}
                placeholderTextColor="#999"
                maxLength={100}
              />
              {errors.namaTopik && (
                <Text style={styles.errorText}>{errors.namaTopik}</Text>
              )}
              <Text style={styles.charCount}>{namaTopik.length}/100</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("TopicMessageOpenLb")}</Text>
              <Text style={styles.labelDesc}>{t("TopicMessageOpenSubLb")}</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.pesanPertama && styles.inputError,
                ]}
                value={pesanPertama}
                onChangeText={setPesanPertama}
                placeholder={t("TopicMessageOpenPh")}
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              {errors.pesanPertama && (
                <Text style={styles.errorText}>{errors.pesanPertama}</Text>
              )}
              <Text style={styles.charCount}>{pesanPertama.length}/500</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t("TopicMessageCloseLb")}</Text>
              <Text style={styles.labelDesc}>
                {t("TopicMessageCloseSubLb")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.pesanTerakhir && styles.inputError,
                ]}
                value={pesanTerakhir}
                onChangeText={setPesanTerakhir}
                placeholder={t("TopicMessageClosePh")}
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              {errors.pesanTerakhir && (
                <Text style={styles.errorText}>{errors.pesanTerakhir}</Text>
              )}
              <Text style={styles.charCount}>{pesanTerakhir.length}/500</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>{t("CancelBtn")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isEditMode ? "#4CAF50" : "#D7385E" },
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
                  {isEditMode ? t("UpdateBtn") : t("SaveBtn")}
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
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 40,
    backgroundColor: "#D7385E",
    padding: 15,
    borderBottomRightRadius: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  inputGroup: {
    padding: 20,
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
    color: "#D7385E",
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
    borderColor: "#D7385E",
    backgroundColor: "#fff5f5",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#D7385E",
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
