import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profil({ navigation }) {
  const [user, setUser] = useState({
    name: "",
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
        <TouchableOpacity
          style={styles.settingIcon}
          onPress={handleSetting}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Icon name="settings" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.profileWrapper}>
          <Image source={user.profilePic} style={styles.profileImage} />
        </View>

        <Text style={styles.hiText}>Hai, {user.name || "-"}</Text>
      </View>

      {/* Profile Info Section */}
      <View style={styles.infoContainer}>
        {/* Name Field */}
        <View style={styles.infoItem}>
          <Icon name="person" size={22} color="#e91e63" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
        </View>

        {/* Email Field */}
        <View style={styles.infoItem}>
          <Icon name="email" size={22} color="#e91e63" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        </View>

        {/* Phone Field */}
        <View style={styles.infoItem}>
          <Icon name="phone" size={22} color="#e91e63" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>No. Telepon</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </View>
        </View>

        {/* Gender Field */}
        <View style={styles.infoItem}>
          <Icon name="people" size={22} color="#e91e63" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Jenis Kelamin</Text>
            <Text style={styles.value}>{user.gender || "-"}</Text>
          </View>
        </View>

        {/* Address Field */}
        <View style={styles.infoItem}>
          <Icon
            name="location-on"
            size={22}
            color="#e91e63"
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.value}>{user.address || "-"}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#D6385E",
    alignItems: "center",
    paddingVertical: 30,
    paddingTop: 50,
    position: "relative",
  },
  settingIcon: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  profileWrapper: {
    marginBottom: 15,
    left: -130,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  hiText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  icon: {
    marginRight: 15,
    width: 24,
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 3,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
