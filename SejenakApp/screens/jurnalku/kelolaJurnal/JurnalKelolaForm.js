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
import { API_BASE_URL } from "../../../utils/constants";
import Ionicons from "react-native-vector-icons/Ionicons";

const JurnalKelolaForm = ({ navigation, route }) => {
  const { jenisjurnal, journal = {}, mode, title } = route.params || {};
  const isEditMode = mode === "edit";
  const [details, setDetails] = useState([{ jenis: "", isi: "" }]);
  const isDisabled = journal?.status === "Tidak Aktif";

  const [formData, setFormData] = useState({
    jjlId: jenisjurnal.id || "",
    judul: "",
    desc: "",
    tujuan: "",
    kenapa: "",
    penutup: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/jurnaldetailsaktif?id=${journal.id}`
        );
        if (response.ok) {
          const data = await response.json();
          const activeDetails = data
            .filter((item) => item.status === "Aktif")
            .map((item) => ({
              id: item.id,
              jenis: item.jenis || "",
              isi: item.isi || "",
              placeHolder: item.placeHolder || "",
            }));
          setDetails(
            activeDetails.length > 0
              ? activeDetails
              : [{ jenis: "", isi: "", id: 0 }]
          );
        } else {
          console.warn("Gagal mengambil detail jurnal");
        }
      } catch (err) {
        console.error("Error fetch detail jurnal:", err);
      }
    };

    if (isEditMode) {
      setFormData({
        jjlId: journal.jjlId || "",
        judul: journal?.judul || "",
        desc: journal?.desc || "",
        tujuan: journal?.tujuan || "",
        kenapa: journal?.kenapa || "",
        penutup: journal?.penutup || "",
      });

      fetchDetails();
    }
  }, [journal]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDetailChange = (index, key, value) => {
    const newDetails = [...details];
    newDetails[index][key] = value;
    setDetails(newDetails);
  };

  const handleAddDetail = () => {
    setDetails((prev) => [
      ...prev,
      { isi: "", jenis: "pertanyaan", placeHolder: "" },
    ]);
  };

  const handleRemoveDetail = (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.judul.trim()) {
      newErrors.judul = "Judul wajib diisi.";
      valid = false;
    }

    if (!formData.desc.trim()) {
      newErrors.desc = "Deskripsi wajib diisi.";
      valid = false;
    }

    if (!formData.tujuan.trim()) {
      newErrors.tujuan = "Tujuan wajib diisi.";
      valid = false;
    }

    if (!formData.kenapa.trim()) {
      newErrors.kenapa = "Alasan wajib diisi.";
      valid = false;
    }

    if (!formData.penutup.trim()) {
      newErrors.penutup = "Penutup wajib diisi.";
      valid = false;
    }

    for (let i = 0; i < details.length; i++) {
      const item = details[i];
      if (!item.isi.trim()) {
        Alert.alert(`Detail ${i + 1}`, "Isi tidak boleh kosong.");
        valid = false;
        break;
      }
      if (item.jenis === "pertanyaan" && !item.placeHolder.trim()) {
        Alert.alert(
          `Detail ${i + 1}`,
          "Placeholder untuk pertanyaan wajib diisi."
        );
        valid = false;
        break;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const url = isEditMode
        ? `${API_BASE_URL}/jurnal/${journal.id}`
        : `${API_BASE_URL}/jurnal`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      console.log(responseData);

      if (response.ok) {
        const jurnalId = isEditMode ? journal.id : responseData.id;

        const detailResponse = await fetch(
          `${API_BASE_URL}/saveOrUpdateDetail/${jurnalId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
          }
        );

        if (detailResponse.ok) {
          Alert.alert("Berhasil", "Jurnal dan detail berhasil disimpan", [
            {
              text: "OK",
              onPress: () => {
                navigation.goBack();
                if (route.params?.onRefresh) route.params.onRefresh();
              },
            },
          ]);
        } else {
          Alert.alert("Gagal", "Detail jurnal gagal disimpan.");
        }
      } else {
        Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan jurnal.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!isEditMode) {
      return Object.values(formData).some((val) => val.trim());
    }

    if (!isDisabled) {
      return (
        formData.judul !== (journal?.judul || "") ||
        formData.desc !== (journal?.desc || "") ||
        formData.tujuan !== (journal?.tujuan || "") ||
        formData.kenapa !== (journal?.kenapa || "") ||
        formData.penutup !== (journal?.penutup || "")
      );
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        "Batalkan Perubahan",
        "Apakah Anda yakin ingin membatalkan? Perubahan belum disimpan akan hilang.",
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditMode ? "Edit Jurnal" : "Tambah Jurnal Baru"}
          </Text>
          <Text style={styles.subtitle}>
            {isEditMode
              ? "Perbarui catatan jurnal pribadi Anda"
              : "Buat catatan jurnal untuk refleksi diri"}
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Judul <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.judul && styles.inputError]}
              value={formData.judul}
              onChangeText={(text) => handleChange("judul", text)}
              placeholder="Masukkan judul jurnal"
              maxLength={50}
              editable={!isDisabled}
            />
            {errors.judul && (
              <Text style={styles.errorText}>{errors.judul}</Text>
            )}
            <Text style={styles.charCount}>{formData.judul.length}/50</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Deskripsi <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.desc && styles.inputError,
              ]}
              value={formData.desc}
              onChangeText={(text) => handleChange("desc", text)}
              placeholder="Deskripsi singkat jurnal"
              multiline
              numberOfLines={3}
              maxLength={100}
              textAlignVertical="top"
              editable={!isDisabled}
            />
            {errors.desc && <Text style={styles.errorText}>{errors.desc}</Text>}
            <Text style={styles.charCount}>{formData.desc.length}/100</Text>
          </View>

          {["tujuan", "kenapa", "penutup"].map((key) => (
            <View style={styles.inputGroup} key={key}>
              <Text style={styles.label}>
                {key === "tujuan"
                  ? "Tujuan dibuatnya jurnal"
                  : key === "kenapa"
                  ? "Kenapa jurnal ini penting"
                  : "Penutup"}
                <Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors[key] && styles.inputError,
                ]}
                value={formData[key]}
                onChangeText={(text) => handleChange(key, text)}
                placeholder={
                  key === "tujuan"
                    ? "Contoh: Saya ingin lebih sehat secara mental..."
                    : key === "kenapa"
                    ? "Contoh: Karena saya merasa stres akhir-akhir ini..."
                    : "Tuliskan refleksi akhir atau harapan ke depan..."
                }
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
                editable={!isDisabled}
              />
              {errors[key] && (
                <Text style={styles.errorText}>{errors[key]}</Text>
              )}
              <Text style={styles.charCount}>{formData[key].length}/500</Text>
            </View>
          ))}

          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.label, { marginTop: 20 }]}>Detail Jurnal</Text>

            {details.map((item, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 20,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  backgroundColor: "#fafafa",
                  position: "relative",
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  Detail {index + 1}
                </Text>

                <TextInput
                  style={[styles.input, { marginTop: 10 }]}
                  placeholder="Isi"
                  value={item.isi}
                  multiline
                  onChangeText={(text) =>
                    handleDetailChange(index, "isi", text)
                  }
                  editable={!isDisabled}
                />

                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  {["pertanyaan", "kutipan"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handleDetailChange(index, "jenis", option)}
                      value={item.jenis}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10,
                        marginRight: 20,
                        marginTop: 20,
                      }}
                      disabled={isDisabled}
                    >
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#D7385E",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 8,
                        }}
                      >
                        {item.jenis === option && (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              borderRadius: 5,
                              backgroundColor: "#D7385E",
                            }}
                          />
                        )}
                      </View>
                      <Text style={{ color: "#333", fontSize: 14 }}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {item.jenis === "pertanyaan" && (
                  <TextInput
                    style={[styles.input, { marginTop: 10 }]}
                    placeholder="Tulis placeholder pertanyaan"
                    value={item.placeHolder}
                    onChangeText={(text) =>
                      handleDetailChange(index, "placeHolder", text)
                    }
                    editable={!isDisabled}
                    multiline
                  />
                )}

                {/* Delete Icon */}
                {details.length > 1 && !isDisabled && (
                  <TouchableOpacity
                    onPress={() => handleRemoveDetail(index)}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                    }}
                    disabled={!isDisabled}
                  >
                    <Ionicons name="close-circle" size={22} color="#D7385E" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {!isDisabled && (
              <TouchableOpacity
                onPress={handleAddDetail}
                style={{
                  marginTop: 10,
                  padding: 12,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#D7385E", fontWeight: "600" }}>
                  + Tambah Detail
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>

          {!isDisabled && (
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: isEditMode ? "#4CAF50" : "#D7385E" },
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isEditMode ? "Perbarui" : "Simpan"}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  keyboardAvoid: { flex: 1 },
  scrollContainer: { paddingBottom: 100 },
  header: {
    paddingTop: 60,
    backgroundColor: "#D7385E",
    padding: 20,
    borderBottomRightRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  inputGroup: { paddingHorizontal: 20, paddingVertical: 5 },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 15,
  },
  required: { color: "#D7385E" },
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

export default JurnalKelolaForm;
