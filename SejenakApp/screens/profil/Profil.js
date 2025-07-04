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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profil({ navigation }) {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    profilePic: require("../../assets/Home/1.png"),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUser({
            name: parsedData.nama || "",
            username: parsedData.username || "",
            email: parsedData.email || "",
            phone: parsedData.telepon || "",
            gender: parsedData.gender || "",
            address: parsedData.alamat || "",
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

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Gallery permission denied");
      }
    })();
  }, []);

  const handleSetting = () => {
    navigation.navigate("Setting");
  };
  const handleLogout = async () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari aplikasi?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userData");
              navigation.replace("Login");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert(
                "Error",
                "Terjadi kesalahan saat keluar. Silakan coba lagi.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };
  const menuItems = [
    {
      title: "Kelola Akun Pengguna",
      icon: "user",
      type: "font-awesome",
      onPress: () => {
        navigation.replace("KelolaAkun");
      },
    },
    {
      title: "Ganti Password",
      icon: "key",
      type: "font-awesome",
      onPress: () => {},
    },
    {
      title: "Hapus Akun",
      icon: "trash",
      type: "font-awesome",
      onPress: () => {},
    },
  ];

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
            <Image source={user.profilePic} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.nameText}>Hi, {user.name || "User"}</Text>
              <View style={styles.infoRow}>
                <Icon name="id-card" type="font-awesome" color="#fff" />
                <Text style={styles.infoText}>{user.username}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="phone" type="font-awesome" color="#fff" />
                <Text style={styles.infoText}>{user.phone || "-"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon
                  name="envelope"
                  type="font-awesome"
                  size={16}
                  color="#fff"
                />
                <Text style={styles.infoText}>{user.email || "-"}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleSetting}>
            <Icon name="edit" size={16} color="#e91e63" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Section */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}>
            <Icon name={item.icon} type={item.type} color="#e91e63" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Keluar</Text>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
    opacity: 0.9,
  },
  editButton: {
    position: "static",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    width: 90,
  },
  editButtonText: {
    color: "#e91e63",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoutButton: {
    backgroundColor: "#e91e63",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 25,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
