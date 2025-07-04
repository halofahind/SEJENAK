import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

const API_BASE_URL = "http://192.168.43.40:8080";

export default function TambahAkun({ navigation }) {
  const [form, setForm] = useState({
    nama: "",
    usrNim: "",
    username: "",
    password: "",
    role: "",
    usrStatus: "",
    tanggalLahir: "",
    gender: "",
    hobi: "",
    telepon: "",
    email: "",
    about: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Validasi input wajib
    const requiredFields = [
      "nama",
      "usrNim",
      "username",
      "password",
      "role",
      "usrStatus",
      "tanggalLahir",
      "gender",
      "email",
    ];

    const emptyFields = requiredFields.filter((key) => !form[key]);

    if (emptyFields.length > 0) {
      Alert.alert("Validasi", "Harap lengkapi semua field yang wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = { ...form };
      const [day, month, year] = payload.tanggalLahir.split("/");
      payload.tanggalLahir = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      const response = await fetch(`${API_BASE_URL}/pengguna`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan pengguna");
      }

      Alert.alert("Sukses", "Pengguna berhasil ditambahkan");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Gagal", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: keyboardHeight > 0 ? 100 : 50,
          minHeight: screenHeight * 0.9,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContent}>
          {/* Tombol kembali */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back-ios" size={24} color="#D6385E" />
          </TouchableOpacity>

          <Text style={styles.registerTitle}>Tambah Pengguna</Text>

          {[
            { icon: "mail-outline", placeholder: "Email", key: "email", keyboardType: "email-address" },
            { icon: "person-outline", placeholder: "Username", key: "username" },
            { icon: "badge", placeholder: "NIM", key: "usrNim" },
            { icon: "person-outline", placeholder: "Nama Lengkap", key: "nama" },
            { icon: "lock-outline", placeholder: "Password", key: "password", secure: true },
            { icon: "verified-user", placeholder: "Role (Admin / Mahasiswa)", key: "role" },
            { icon: "check-circle", placeholder: "Status (Aktif / Tidak Aktif)", key: "usrStatus" },
            { icon: "phone", placeholder: "Nomor Telepon", key: "telepon", keyboardType: "phone-pad" },
            { icon: "sports-tennis", placeholder: "Hobi", key: "hobi" },
            { icon: "info", placeholder: "Tentang Diri", key: "about", multiline: true },
          ].map((field, i) => (
            <View style={styles.inputWrapper} key={i}>
              <Icon name={field.icon} size={20} color="#333" />
              <TextInput
                style={[styles.input, field.multiline && { height: 100 }]}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChangeText={(v) => handleChange(field.key, v)}
                keyboardType={field.keyboardType}
                secureTextEntry={field.secure}
                editable={!isLoading}
                multiline={field.multiline}
                numberOfLines={field.multiline ? 4 : 1}
              />
            </View>
          ))}

          {/* Tanggal Lahir */}
          <View style={styles.inputWrapper}>
            <Icon name="calendar-today" size={20} color="#333" />
            <TouchableOpacity
              onPress={() => !isLoading && setShowDatePicker(true)}
              style={{ flex: 1 }}
            >
              <Text
                style={[styles.input, !form.tanggalLahir && { color: "#999" }]}
              >
                {form.tanggalLahir || "Tanggal Lahir (DD/MM/YYYY)"}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={(e, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const day = String(selectedDate.getDate()).padStart(2, "0");
                  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                  const year = selectedDate.getFullYear();
                  const formattedDate = `${day}/${month}/${year}`;
                  handleChange("tanggalLahir", formattedDate);
                }
              }}
            />
          )}

          {/* Gender */}
          <View style={styles.genderButtonContainer}>
            {["Laki-laki", "Perempuan"].map((g, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.genderButton,
                  form.gender === g &&
                    (g === "Laki-laki"
                      ? styles.genderButtonLaki
                      : styles.genderButtonPerempuan),
                ]}
                onPress={() => handleChange("gender", g)}
              >
                <Icon
                  name={g === "Laki-laki" ? "male" : "female"}
                  size={18}
                  color={form.gender === g ? "#fff" : "#555"}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    form.gender === g && styles.genderButtonTextActive,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              isLoading && styles.registerButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Simpan</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  innerContent: {
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  registerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#D6385E",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E3E3E3",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#D6385E",
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 30,
    marginTop: 16,
    marginBottom: 20,
    elevation: 5,
  },
  registerButtonDisabled: {
    backgroundColor: "#999",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  genderButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  genderButtonLaki: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  genderButtonPerempuan: {
    backgroundColor: "#D6385E",
    borderColor: "#D6385E",
  },
  genderButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
  },
  genderButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
