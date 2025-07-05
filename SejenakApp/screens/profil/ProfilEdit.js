import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../utils/constants";
import * as FileSystem from "expo-file-system";

export default function ProfilEdit({ navigation }) {
  const [user, setUser] = useState({
    id: "",
    role: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    hobi: "",
    tentang: "",
    profilePic: require("../../assets/Home/1.png"),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUser({
            id: parsedData.id || "",
            role: parsedData.role || "",
            name: parsedData.nama || "",
            username: parsedData.username || "",
            email: parsedData.email || "",
            phone: parsedData.telepon || "",
            gender: parsedData.gender || "",
            address: parsedData.alamat || "",
            hobi: parsedData.hobi || "",
            tentang: parsedData.tentang || "",
            profilePic: parsedData.profilePic
              ? { uri: parsedData.profilePic }
              : require("../../assets/Home/1.png"),
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const uploadImageToServer = async (imageUri) => {
    try {
      setIsLoading(true);

      const fileInfo = await FileSystem.getInfoAsync(imageUri);

      if (!fileInfo.exists) {
        throw new Error("File tidak ditemukan");
      }

      const filename = imageUri.split("/").pop();
      const fileType = `image/${filename.split(".").pop()}`;

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: fileType,
      });

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Gagal mengupload gambar");
      }

      return responseData.path; // Path gambar di server
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // Validasi wajib
      if (!user.name || !user.email || !user.phone) {
        throw new Error("Nama, email, dan nomor telepon harus diisi");
      }

      // Siapkan data untuk dikirim ke API
      const userData = {
        id: user.id,
        role: user.role,
        nama: user.name,
        username: user.username,
        email: user.email,
        telepon: user.phone,
        gender: user.gender,
        alamat: user.address,
        hobi: user.hobi || null,
        tentang: user.tentang || null,
      };

      // Upload foto jika ada perubahan (uri baru yang belum diupload)
      if (user.profilePic.uri && !user.profilePic.uri.includes(API_BASE_URL)) {
        const fotoProfil = await uploadImageToServer(user.profilePic.uri);
        userData.usrFoto = fotoProfil;
      }

      const response = await fetch(`${API_BASE_URL}/pengguna`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer`,
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            responseData.error ||
            "Gagal memperbarui profil"
        );
      }

      // Update local storage
      const updatedUserData = {
        ...JSON.parse(await AsyncStorage.getItem("userData")),
        ...userData,
        profilePic: userData.usrFoto
          ? `${API_BASE_URL}/${userData.usrFoto}`
          : user.profilePic.uri || user.profilePic,
      };

      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

      Alert.alert("Sukses", "Profil berhasil diperbarui");
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Gagal menyimpan perubahan profil");
    } finally {
      setIsSaving(false);
    }
  };

  const showImagePickerOptions = async () => {
    Alert.alert(
      "Ubah Foto Profil",
      "Pilih sumber foto:",
      [
        {
          text: "Kamera",
          onPress: () => takePhotoFromCamera(),
        },
        {
          text: "Galeri",
          onPress: () => pickImageFromGallery(),
        },
        {
          text: "Batal",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const takePhotoFromCamera = async () => {
    // Request permission for camera
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.status !== "granted") {
      Alert.alert(
        "Izin diperlukan",
        "Izin kamera diperlukan untuk mengambil foto"
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    // Request permission for media library
    const galleryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (galleryPermission.status !== "granted") {
      Alert.alert(
        "Izin diperlukan",
        "Izin galeri diperlukan untuk memilih foto"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  const handleImageSelected = async (imageUri) => {
    try {
      // Tampilkan gambar terlebih dahulu sebelum upload
      setUser({
        ...user,
        profilePic: { uri: imageUri },
      });
    } catch (error) {
      console.error("Error handling image:", error);
      Alert.alert("Error", "Gagal memproses gambar");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={showImagePickerOptions}>
              <Image
                source={
                  typeof user.profilePic === "string"
                    ? { uri: user.profilePic }
                    : user.profilePic
                }
                style={styles.profileImage}
              />
              <View style={styles.cameraIcon}>
                <Icon name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.nameText}>Edit Profil</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            placeholder="Masukkan nama lengkap"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
            placeholder="Masukkan username"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            placeholder="Masukkan email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
            placeholder="Masukkan nomor telepon"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                user.gender === "Laki-laki" && styles.genderSelected,
              ]}
              onPress={() => setUser({ ...user, gender: "Laki-laki" })}>
              <Text
                style={[
                  styles.genderText,
                  user.gender === "Laki-laki" && styles.genderTextSelected,
                ]}>
                Laki-laki
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                user.gender === "Perempuan" && styles.genderSelected,
              ]}
              onPress={() => setUser({ ...user, gender: "Perempuan" })}>
              <Text
                style={[
                  styles.genderText,
                  user.gender === "Perempuan" && styles.genderTextSelected,
                ]}>
                Perempuan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={user.address}
            onChangeText={(text) => setUser({ ...user, address: text })}
            placeholder="Masukkan alamat lengkap"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hobi</Text>
          <TextInput
            style={styles.input}
            value={user.hobi}
            onChangeText={(text) => setUser({ ...user, hobi: text })}
            placeholder="Masukkan hobi Anda"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tentang Saya</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={user.tentang}
            onChangeText={(text) => setUser({ ...user, tentang: text })}
            placeholder="Ceritakan tentang diri Anda"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#e91e63",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerContent: {
    position: "relative",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginRight: 15,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#e91e63",
    borderRadius: 15,
    padding: 5,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
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
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  genderButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: "#e91e63",
  },
  genderText: {
    fontSize: 16,
    color: "#333",
  },
  genderTextSelected: {
    color: "#fff",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: "#e91e63",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#c0c0c0",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
