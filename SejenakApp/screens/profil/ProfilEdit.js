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
    password: "",
    tanggalLahir: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    hobi: "",
    tentang: "",
    profilePic: "",
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
            password: parsedData.password || "",
            tanggalLahir: parsedData.tanggalLahir || "",
            email: parsedData.email || "",
            phone: parsedData.telepon || "",
            gender: parsedData.gender || "",
            address: parsedData.alamat || "",
            hobi: parsedData.hobi || "",
            tentang: parsedData.about || "", // Perhatikan ini "about"
            profilePic: parsedData.usrFoto
              ? { uri: parsedData.usrFoto }
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
      // Upload seperti biasa
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

      // Pakai response.text() dulu biar tahu apa isi response-nya
      const text = await response.text();
      console.log("Response dari upload:", text);

      const responseData = JSON.parse(text);

      if (!response.ok) {
        throw new Error(responseData.message || "Gagal mengupload gambar");
      }

      return `${API_BASE_URL}/${responseData.filePath}`; // ← return string (full URL)
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // const handleSave = async () => {
  //   setIsSaving(true);
  //   try {
  //     const userData = {
  //       id: user.id,
  //       role: user.role,
  //       nama: user.name,
  //       username: user.username,
  //       password: user.password,
  //       tanggalLahir: user.tanggalLahir,
  //       email: user.email,
  //       telepon: user.phone,
  //       gender: user.gender,
  //       alamat: user.address,
  //       hobi: user.hobi || null,
  //       tentang: user.tentang || null,
  //       profilPic: user.profilePic || null,
  //     };

  //     // ⬇ Upload foto jika masih lokal
  //     if (user.profilePic?.uri && !user.profilePic.uri.includes(API_BASE_URL)) {
  //       try {
  //         const fotoProfilUrl = await uploadImageToServer(user.profilePic.uri);
  //         userData.profilPic = fotoProfilUrl; // SIMPAN SEBAGAI STRING URL
  //       } catch (uploadError) {
  //         console.error("Gagal upload foto:", uploadError);
  //       }
  //     } else if (user.profilePic?.uri) {
  //       // Kalau sudah URL sebelumnya, ambil string-nya saja
  //       userData.profilPic = user.fotoProfilUrl;
  //     }

  //     // Kirim data ke backend
  //     const response = await fetch(`${API_BASE_URL}/pengguna`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(userData),
  //     });

  //     if (!response.ok) {
  //       const errText = await response.text();
  //       throw new Error(errText);
  //     }

  //     // Simpan juga ke AsyncStorage dalam bentuk string
  //     await AsyncStorage.setItem("userData", JSON.stringify(userData));
  //     Alert.alert("Sukses", "Profil berhasil diperbarui");
  //     navigation.goBack();
  //   } catch (err) {
  //     console.error("Gagal simpan profil:", err);
  //     Alert.alert("Error", err.message || "Gagal simpan profil");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Buat salinan data user yang akan dikirim
      let userDataToSend = {
        id: user.id,
        role: user.role,
        nama: user.name,
        username: user.username,
        password: user.password,
        tanggalLahir: user.tanggalLahir,
        email: user.email,
        telepon: user.phone,
        gender: user.gender,
        hobi: user.hobi || null,
        tentang: user.tentang || null,
        profilPic: null, // Akan diisi nanti
      };

      // Handle upload foto jika diperlukan
      let profilePicUrl = user.profilePic;

      if (typeof profilePicUrl === "object" && profilePicUrl.uri) {
        // Jika foto baru (masih lokal)
        if (!profilePicUrl.uri.includes(API_BASE_URL)) {
          try {
            const uploadedUrl = await uploadImageToServer(profilePicUrl.uri);
            profilePicUrl = uploadedUrl;

            // Update state dengan URL baru
            setUser((prev) => ({
              ...prev,
              profilePic: uploadedUrl,
            }));
          } catch (uploadError) {
            console.error("Gagal upload foto:", uploadError);
            // Tetap lanjut tanpa foto jika upload gagal
            profilePicUrl = null;
          }
        } else {
          // Jika sudah URL, ambil string-nya saja
          profilePicUrl = profilePicUrl.uri;
        }
      }

      // Set URL foto ke data yang akan dikirim
      userDataToSend.profilPic = profilePicUrl;

      // Kirim data ke backend
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

      // Simpan ke AsyncStorage
      const updatedUserData = {
        ...userDataToSend,
        profilePic: profilePicUrl, // Pastikan penamaannya konsisten
      };
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

      Alert.alert("Sukses", "Profil berhasil diperbarui");
      navigation.goBack();
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
  const getImageSource = (profilePic) => {
    // Default image jika tidak ada
    if (!profilePic) return require("../../assets/Home/1.png");

    // Jika berupa string langsung (URI)
    if (typeof profilePic === "string") {
      // Pastikan string yang valid
      return { uri: String(profilePic) };
    }

    // Jika berupa object dengan properti uri
    if (profilePic.uri) {
      return { uri: String(profilePic.uri) };
    }

    // Jika berupa require local image
    return profilePic;
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
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <TouchableOpacity
              onPress={showImagePickerOptions}
              style={styles.profileImageContainer}>
              <Image
                source={
                  typeof user.profilePic === "string"
                    ? { uri: user.profilePic }
                    : user.profilePic.uri
                    ? { uri: user.profilePic.uri }
                    : user.profilePic
                }
                style={styles.profileImage}
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
