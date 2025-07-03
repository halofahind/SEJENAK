import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SessionManager from "../../utils/SessionManager"; // pastikan path-nya benar

export default function Profil({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileUri, setProfileUri] = useState(null);
  const [user, setUser] = useState({
    name: "Alfian Ramdhan",
    email: "alfianramdhan003@gmail.com",
    phone: "082196787525",
    gender: "Laki laki",
    address: "Bandung",
    profilePic: require("../../assets/Home/1.png"),
  });

  // Request permission
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Izin akses galeri diperlukan untuk mengubah foto profil.");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileUri(result.assets[0].uri);
    }
  };

  const handleSetting = () => {
    navigation.navigate("Setting");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Berhasil", "Profil berhasil diperbarui.");
  };

  const handleLogout = () => {
    Alert.alert("Keluar", "Yakin ingin keluar dari aplikasi?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          console.log("Keluar ditekan");
          try {
            await AsyncStorage.removeItem("userData");
            console.log("UserData dihapus");

            SessionManager.stop?.();
            console.log("Session stop");

            navigation.replace("Login");
          } catch (e) {
            console.log("Logout error:", e);
          }
        },
      },
    ]);
  };

  const handleChange = (key, value) => {
    setUser({ ...user, [key]: value });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingIcon} onPress={handleSetting}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.profileWrapper}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={profileUri ? { uri: profileUri } : user.profilePic}
              style={styles.profileImage}
            />
            <View style={styles.cameraIcon}>
              <Icon name="photo-camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.hiText}>Hi, {user.name}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={user.name}
          onChangeText={(text) => handleChange("name", text)}
          editable={isEditing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => handleChange("email", text)}
          editable={isEditing}
        />

        <Text style={styles.label}>No Telephone/Hp</Text>
        <TextInput
          style={styles.input}
          value={user.phone}
          onChangeText={(text) => handleChange("phone", text)}
          editable={isEditing}
        />

        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          value={user.gender}
          onChangeText={(text) => handleChange("gender", text)}
          editable={isEditing}
        />

        <Text style={styles.label}>Alamat</Text>
        <TextInput
          style={styles.input}
          value={user.address}
          onChangeText={(text) => handleChange("address", text)}
          editable={isEditing}
        />

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon
            name="logout"
            size={20}
            color="#D33"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#e91e63",
    alignItems: "center",
    paddingVertical: 40,
    paddingTop: 60,
    position: "relative",
  },
  settingIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    marginTop: 6,
  },
  profileWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -2,
    backgroundColor: "#EF6A6A",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
  hiText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF6A6A",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#36B37E",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  editText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  logoutText: {
    color: "#D33",
    fontSize: 15,
    fontWeight: "bold",
  },
});
