import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../utils/constants";
export default function GantiPassword({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Harap isi semua field");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Password baru tidak cocok");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Ambil data user dari AsyncStorage
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) throw new Error("Data pengguna tidak ditemukan");

      const parsedData = JSON.parse(userData);

      // 2. Verifikasi password lama (opsi frontend)
      if (parsedData.password !== currentPassword) {
        throw new Error("Password lama tidak sesuai");
      }

      const payload = {
        id: parsedData.id,
        role: parsedData.role,
        nama: parsedData.nama,
        username: parsedData.username,
        password: newPassword,
        currentPassword: currentPassword,
        tanggalLahir: parsedData.tanggalLahir,
        email: parsedData.email,
        telepon: parsedData.telepon,
        gender: parsedData.gender,
        hobi: parsedData.hobi || null,
        tentang: parsedData.tentang || null,
        profilPic: parsedData.profilePic || null,
      };

      // 3. Kirim ke endpoint yang sama dengan edit profil
      const response = await fetch(`${API_BASE_URL}/pengguna`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengubah password");
      }

      // 4. Update data di AsyncStorage
      const updatedUserData = {
        ...parsedData,
        password: newPassword,
      };
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

      Alert.alert("Berhasil", "Password berhasil diperbarui", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Gagal mengubah password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ganti Password</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password Saat Ini</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password saat ini"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor="#999"
            />
            <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password Baru</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password baru (min. 8 karakter)"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#999"
            />
            <Icon
              name="lock-outline"
              size={20}
              color="#888"
              style={styles.inputIcon}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Konfirmasi Password Baru</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Tulis ulang password baru"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#999"
            />
            <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Simpan Perubahan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#e91e63",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 45,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputIcon: {
    position: "absolute",
    left: 15,
    top: 12,
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: "#e91e63",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#c0c0c0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
