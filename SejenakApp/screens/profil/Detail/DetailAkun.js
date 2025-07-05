import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { API_BASE_URL } from "../../../utils/constants";

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

  const handleToggleStatus = async () => {
    const newStatus = form.usrStatus === "Aktif" ? "Tidak Aktif" : "Aktif";
    Alert.alert("Konfirmasi", `Ubah status ke "${newStatus}"?`, [
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
            Alert.alert("Berhasil", `Status diubah ke "${newStatus}"`);
            navigation.goBack();
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
      <Text style={styles.value}>
        {isPassword ? "••••••" : form[key] || "-"}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={24} color="#D6385E" />
        </TouchableOpacity>
        <Text style={styles.title}>Detail Akun</Text>
      </View>

      <View style={styles.card}>
        {renderField("Nama Lengkap", "nama")}
        {renderField("NIM", "usrNim")}
        {renderField("Username", "username")}
        {renderField("Password", "password", true)}
        {renderField("Role", "role")}
        {renderField("Status", "usrStatus")}
        {renderField("Email", "email")}
        {renderField("Tanggal Lahir", "tanggalLahir")}
        {renderField("Hobi", "hobi")}
        {renderField("Telepon", "telepon")}

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.genderButtonContainer}>
            {["Laki-laki", "Perempuan"].map((g, i) => {
              const isActive = form.gender === g;
              return (
                <View
                  key={i}
                  style={[
                    styles.genderButton,
                    isActive &&
                      (g === "Laki-laki"
                        ? styles.genderButtonLaki
                        : styles.genderButtonPerempuan),
                  ]}
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
                </View>
              );
            })}
          </View>
        </View>

        {renderField("Tentang Diri", "about")}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.editBtn,
              {
                backgroundColor:
                  form.usrStatus === "Aktif" ? "#bbb" : "#D6385E",
              },
            ]}
            onPress={handleToggleStatus}
          >
            <Text
              style={[
                styles.buttonText,
                { color: form.usrStatus === "Aktif" ? "#fff" : "#fff" },
              ]}
            >
              {form.usrStatus === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D6385E",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  inputWrapper: { marginBottom: 14 },
  label: { fontSize: 14, color: "#444", marginBottom: 4 },
  value: {
    fontSize: 16,
    color: "#555",
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  editBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 280,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
  genderButtonPerempuan: {
    backgroundColor: "#D6385E",
    borderColor: "#D6385E",
  },
  genderButtonText: { marginLeft: 6, fontSize: 14, color: "#555" },
  genderButtonTextActive: { color: "#fff", fontWeight: "bold" },
});
