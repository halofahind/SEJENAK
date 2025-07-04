import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

const API_BASE_URL = "http://192.168.43.40:8080";

const formatToDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatToYYYYMMDD = (dateString) => {
  const [dd, mm, yyyy] = dateString.split("/");
  return `${yyyy}-${mm}-${dd}`;
};

export default function DetailAkun({ route, navigation }) {
  const { data } = route.params;
  const [editMode, setEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    id: data.id,
    nama: data.nama,
    usrNim: data.usrNim,
    username: data.username,
    password: "",
    role: data.role,
    usrStatus: data.usrStatus,
    email: data.email,
    tanggalLahir: formatToDDMMYYYY(data.tanggalLahir),
    gender: data.gender,
    hobi: data.hobi,
    telepon: data.telepon,
    about: data.about,
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const updateData = { ...form };
      if (updateData.tanggalLahir.includes("/")) {
        updateData.tanggalLahir = formatToYYYYMMDD(updateData.tanggalLahir);
      }
      if (!updateData.password) delete updateData.password;

      const response = await fetch(`${API_BASE_URL}/pengguna`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Gagal update");
      Alert.alert("Sukses", "Data berhasil diperbarui");
      setEditMode(false);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = form.usrStatus === "Aktif" ? "Tidak Aktif" : "Aktif";
    Alert.alert("Konfirmasi", `Yakin ingin ubah status ke \"${newStatus}\"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya",
        onPress: async () => {
          try {
            const payload = {
              ...form,
              usrStatus: newStatus,
              password: "",
            };
            if (payload.tanggalLahir.includes("/")) {
              payload.tanggalLahir = formatToYYYYMMDD(payload.tanggalLahir);
            }

            const response = await fetch(`${API_BASE_URL}/pengguna`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Gagal mengubah status");
            Alert.alert("Berhasil", `Status diubah ke \"${newStatus}\"`);
            setForm({ ...form, usrStatus: newStatus });
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  const renderField = (label, key, isPassword = false) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      {editMode ? (
        <TextInput
          style={styles.input}
          value={form[key]}
          placeholder={isPassword ? "Kosongkan jika tidak diubah" : label}
          secureTextEntry={isPassword}
          onChangeText={(v) => handleChange(key, v)}
        />
      ) : (
        <Text style={styles.value}>
          {isPassword ? "••••••" : form[key] || "-"}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back-ios" size={24} color="#D6385E" />
      </TouchableOpacity>

      <Text style={styles.title}>Detail Akun</Text>

      <View style={styles.card}>
        {renderField("Nama Lengkap", "nama")}
        {renderField("NIM", "usrNim")}
        {renderField("Username", "username")}
        {renderField("Password", "password", true)}
        {renderField("Role", "role")}
        {renderField("Status", "usrStatus")}
        {renderField("Email", "email")}

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Tanggal Lahir</Text>
          {editMode ? (
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.input, { justifyContent: "center" }]}
            >
              <Text style={{ fontSize: 16, color: "#333" }}>
                {form.tanggalLahir || "Tanggal Lahir (DD/MM/YYYY)"}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.value}>{form.tanggalLahir || "-"}</Text>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={
              form.tanggalLahir && form.tanggalLahir.includes("/")
                ? new Date(formatToYYYYMMDD(form.tanggalLahir))
                : new Date()
            }
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const day = String(selectedDate.getDate()).padStart(2, "0");
                const month = String(selectedDate.getMonth() + 1).padStart(
                  2,
                  "0"
                );
                const year = selectedDate.getFullYear();
                const formatted = `${day}/${month}/${year}`;
                handleChange("tanggalLahir", formatted);
              }
            }}
          />
        )}

        {renderField("Hobi", "hobi")}
        {renderField("Telepon", "telepon")}

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.genderButtonContainer}>
            {["Laki-laki", "Perempuan"].map((g, i) => {
              const isActive = form.gender === g;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.genderButton,
                    isActive &&
                      (g === "Laki-laki"
                        ? styles.genderButtonLaki
                        : styles.genderButtonPerempuan),
                    !editMode && styles.genderButtonDisabled,
                  ]}
                  disabled={!editMode}
                  onPress={() => editMode && handleChange("gender", g)}
                >
                  <Icon
                    name={g === "Laki-laki" ? "male" : "female"}
                    size={18}
                    color={isActive ? "#fff" : "#555"}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      isActive && styles.genderButtonTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {renderField("Tentang Diri", "about")}

        <View style={styles.buttonContainer}>
          {editMode ? (
            <>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setEditMode(false)}
              >
                <Text style={[styles.buttonText, { color: "#000" }]}>
                  Batal
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setEditMode(true)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.editBtn,
                  {
                    backgroundColor:
                      form.usrStatus === "Aktif" ? "#bbb" : "#3cba54",
                  },
                ]}
                onPress={handleToggleStatus}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: form.usrStatus === "Aktif" ? "#000" : "#fff" },
                  ]}
                >
                  {form.usrStatus === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 50 },
  backButton: { marginBottom: 10, alignSelf: "flex-start" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D6385E",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  inputWrapper: { marginBottom: 14 },
  label: { fontSize: 14, color: "#444", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  value: {
    fontSize: 16,
    color: "#555",
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  editBtn: {
    flex: 0.48,
    backgroundColor: "#D6385E",
    padding: 12,
    borderRadius: 10,
  },
  saveBtn: {
    flex: 0.48,
    backgroundColor: "#3cba54",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  genderButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 4,
  },
  genderButtonLaki: { backgroundColor: "#2196F3", borderColor: "#2196F3" },
  genderButtonPerempuan: { backgroundColor: "#D6385E", borderColor: "#D6385E" },
  genderButtonText: { marginLeft: 6, fontSize: 14, color: "#555" },
  genderButtonTextActive: { color: "#fff", fontWeight: "bold" },
  genderButtonDisabled: { opacity: 0.6 },
});
