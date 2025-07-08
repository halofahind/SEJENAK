import React, { useState, useEffect, use } from "react";
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
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../utils/constants";
import DateTimePicker from "@react-native-community/datetimepicker";

import * as FileSystem from "expo-file-system";

export default function ProfilEdit({ navigation }) {
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState({
    id: "",
    role: "",
    nim: "",
    name: "",
    username: "",
    password: "",
    tanggalLahir: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    hobi: "",
    tentang: "",
    profilePic: "",
    status: "",
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
          let formattedDob = "";
          if (parsedData.tanggalLahir) {
            const dateObj = new Date(parsedData.tanggalLahir);
            formattedDob = dateObj.toLocaleDateString("id-ID");
          }

          // PERBAIKAN UTAMA DI SINI:
          let profilePicSource;
          if (parsedData.usrFoto) {
            // Jika usrFoto ada, formatkan sebagai object {uri}
            const fullUrl = parsedData.usrFoto.includes("http")
              ? parsedData.usrFoto
              : `${API_BASE_URL}/uploads/${parsedData.usrFoto}`;
            profilePicSource = { uri: fullUrl };
          } else if (parsedData.profilePic) {
            // Handle fallback ke profilePic jika ada
            profilePicSource =
              typeof parsedData.profilePic === "string"
                ? { uri: parsedData.profilePic }
                : parsedData.profilePic;
          } else {
            // Default image
            profilePicSource = require("../../assets/Profil/Profil.png");
          }

          console.log("Loaded profile pic:", profilePicSource); // Debugging

          setUser({
            ...parsedData,
            name: parsedData.nama || "",
            nim: parsedData.usrNim || "",
            phone: parsedData.telepon || "",
            address: parsedData.alamat || "",
            tentang: parsedData.about || "",
            profilePic: profilePicSource,
          });
          setDob(formattedDob); // Set state dob dengan format tampilan
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
      const filename = imageUri.split("/").pop();
      const fileType = `image/${filename.split(".").pop()}`;

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: fileType,
      });

      const response = await fetch(`${API_BASE_URL}/upload/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const text = await response.text();
      console.log("Response dari upload:", text);

      const responseData = JSON.parse(text);

      if (!response.ok) {
        throw new Error(responseData.message || "Gagal mengupload gambar");
      }

      const cleanUrl = `${API_BASE_URL}/${responseData.filePath}`.replace(
        /([^:]\/)\/+/g,
        "$1"
      );

      return cleanUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let profilePicUrl = user.profilePic;
      // Handle existing photo (could be string URL or object)
      if (typeof profilePicUrl === "object" && profilePicUrl.uri) {
        // Case 1: New local photo (needs upload)
        if (!profilePicUrl.uri.includes(API_BASE_URL)) {
          const uploadedUrl = await uploadImageToServer(profilePicUrl.uri);
          const fileNameOnly = uploadedUrl.split("/").pop();
          profilePicUrl = fileNameOnly;
        }
        // Case 2: Existing server photo (extract filename)
        else {
          profilePicUrl = profilePicUrl.uri.split("/").pop();
        }
      }
      // Case 3: Already just a filename string
      else if (
        typeof profilePicUrl === "string" &&
        profilePicUrl.includes("/")
      ) {
        profilePicUrl = profilePicUrl.split("/").pop();
      }

      // Buat data yang akan dikirim
      const userDataToSend = {
        id: user.id,
        role: user.role,
        nama: user.name,
        usrNim: user.nim,
        username: user.username,
        password: user.password,
        tanggalLahir: user.tanggalLahir,
        email: user.email,
        telepon: user.phone,
        gender: user.gender,
        hobi: user.hobi || null,
        about: user.tentang || null,
        usrFoto: profilePicUrl,
      };

      const response = await fetch(`${API_BASE_URL}/pengguna`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataToSend),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      // Simpan ke lokal (AsyncStorage)
      if (response.ok) {
        const updatedUserData = {
          ...userDataToSend,
          profilePic: `${API_BASE_URL}/uploads/${profilePicUrl}`,
        };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
        navigation.goBack();
      } else {
        throw new Error(await response.text());
      }
    } catch (err) {
      console.error("Gagal simpan profil:", err);
      Alert.alert("Error", err.message || "Gagal simpan profil");
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
      // Konversi ke string dan pastikan tidak null/undefined
      const uri = imageUri ? String(imageUri) : null;

      if (!uri) {
        throw new Error("URI gambar tidak valid");
      }

      setUser((prev) => ({
        ...prev,
        profilePic: { uri },
      }));
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <TouchableOpacity
                onPress={showImagePickerOptions}
                style={styles.profileImageContainer}>
                <Image
                  source={
                    // Handle semua kemungkinan format:
                    // 1. Object dengan uri (hasil dari image picker)
                    // 2. String URL (dari server)
                    // 3. Default require
                    user.profilePic && user.profilePic.uri
                      ? { uri: user.profilePic.uri }
                      : typeof user.profilePic === "string"
                      ? { uri: user.profilePic }
                      : user.profilePic
                  }
                  style={styles.profileImage}
                  onError={(e) =>
                    console.log("Gagal memuat gambar:", e.nativeEvent.error)
                  }
                  defaultSource={require("../../assets/Profil/Profil.png")}
                />
                <View style={styles.cameraIcon}>
                  <Icon name="camera" size={20} color="#fff" />
                </View>
                {isLoading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
                )}
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
            <Text style={styles.label}>NIM</Text>
            <TextInput
              style={styles.input}
              value={user.nim}
              onChangeText={(text) => setUser({ ...user, nim: text })}
              placeholder="Masukkan NIM"
            />
          </View>
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
            <Text style={styles.label}>Tanggal Lahir</Text>
            <TouchableOpacity
              onPress={() => !isLoading && setShowDatePicker(true)}
              style={styles.input}
              disabled={isLoading}>
              <Text style={{ color: dob ? "#333" : "#999" }}>
                {dob || "Pilih tanggal lahir (DD/MM/YYYY)"}
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={
                user.tanggalLahir ? new Date(user.tanggalLahir) : new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  // Format untuk tampilan
                  const formattedDate =
                    selectedDate.toLocaleDateString("id-ID");
                  // Format untuk disimpan (YYYY-MM-DD)
                  const isoDate = selectedDate.toISOString().split("T")[0];

                  setDob(formattedDate);
                  setUser((prev) => ({
                    ...prev,
                    tanggalLahir: isoDate,
                  }));
                }
              }}
            />
          )}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    paddingBottom: 100, // Memberi ruang untuk keyboard
  },
  formContainer: {
    padding: 20,
    paddingBottom: 50, // Ruang tambahan di bawah form
  },
  multilineInput: {
    minHeight: 100,
    maxHeight: 150, // Batas maksimal tinggi
    textAlignVertical: "top",
    paddingTop: 10, // Padding atas untuk textarea
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
