import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  RefreshControl,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KebijakanPrivasi from "./KebijakanPrivasi";
import i18n from "../../locales/i18n";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../utils/constants";

export default function Profil({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  // BAHASA
  const { t } = useTranslation();
  const changeLanguage = async (lng) => {
    Alert.alert(t("Ganti Bahasa"), t("Anda Yakin Ingin Mengubah Bahasa?"), [
      {
        text: t("cancel"),
        style: "cancel",
        onPress: () => {},
      },
      {
        text: t("confirm"),
        onPress: async () => {
          try {
            await i18n.changeLanguage(lng);
            setCurrentLanguage(lng);
            await AsyncStorage.setItem("appLanguage", lng);

            // Force re-render dengan mengubah state
            setLanguageModalVisible(false);

            // Tampilkan alert perlu restart
            Alert.alert(
              t("Mulai Ulang Aplikasi"),
              t("Aplikasi Akan Dimulai Ulang Sekarang?"),
              [
                {
                  text: t("later"),
                  style: "cancel",
                },
                {
                  text: t("restart_now"),
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Splash" }],
                    });
                  },
                },
              ]
            );
          } catch (error) {
            console.error("Gagal mengganti bahasa:", error);
            Alert.alert("Error", t("language_change_failed"));
          }
        },
      },
    ]);
  };
  const refreshProfile = async () => {
    setRefreshing(true);
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);

        let profilePicSource;
        if (parsedData.usrFoto) {
          // Tambahkan timestamp untuk menghindari cache
          profilePicSource = {
            uri: `${API_BASE_URL}/uploads/${
              parsedData.usrFoto
            }?${new Date().getTime()}`,
          };
        } else if (parsedData.profilePic) {
          profilePicSource = { uri: parsedData.profilePic };
        } else {
          profilePicSource = require("../../assets/Profil/Profil.png");
        }

        setUser({
          name: parsedData.nama || "",
          username: parsedData.username || "",
          email: parsedData.email || "",
          phone: parsedData.telepon || "",
          gender: parsedData.gender || "",
          address: parsedData.alamat || "",
          profilePic: profilePicSource,
        });
      }
    } catch (error) {
      console.error("Gagal merefresh profil:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Refresh otomatis saat screen focus
  useFocusEffect(
    React.useCallback(() => {
      refreshProfile();
    }, [])
  );

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    profilePic: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);

          // Perbaikan utama di sini:
          let profilePicSource;
          if (parsedData.usrFoto) {
            // Jika ada usrFoto, gunakan sebagai URI
            profilePicSource = {
              uri: `${API_BASE_URL}/uploads/${parsedData.usrFoto}`,
            };
          } else if (parsedData.profilePic) {
            // Jika ada profilePic (alternatif)
            profilePicSource = { uri: parsedData.profilePic };
          } else {
            // Default image
            profilePicSource = require("../../assets/Profil/Profil.png");
          }

          setUser({
            name: parsedData.nama || "",
            username: parsedData.username || "",
            email: parsedData.email || "",
            phone: parsedData.telepon || "",
            gender: parsedData.gender || "",
            address: parsedData.alamat || "",
            profilePic: profilePicSource,
          });

          console.log("profilePic dari parsedData:", parsedData.usrFoto);
          console.log(
            "FULL URL IMAGE:",
            `${API_BASE_URL}/uploads/${parsedData.usrFoto}`
          );
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    navigation.navigate("ProfilEdit");
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
      title: t("ProfilMenuManageAcc"),
      icon: "user",
      type: "font-awesome",
      onPress: () => {
        navigation.navigate("KelolaAkun");
      },
    },
    {
      title: t("ProfilMenuPassChange"),
      icon: "lock",
      type: "font-awesome",
      onPress: () => {
        navigation.navigate("GantiPassword");
      },
    },
    {
      title: t("ProfilMenuSK"),
      icon: "book",
      type: "font-awesome",
      onPress: () => {
        navigation.navigate("SyaratKetentuan");
      },
    },
    {
      title: t("ProfilMenuPrivacy"),
      icon: "shield",
      type: "font-awesome",
      onPress: () => {
        navigation.navigate(KebijakanPrivasi);
      },
    },
    {
      title: t("ProfilMenuCallMe"),
      icon: "whatsapp",
      type: "font-awesome",
      onPress: () => {
        const nomorWA = "6282118028300";
        const pesan =
          "Hai, Aku sedang mengalami kendala. Bisakah kamu membantuku?";
        const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(
          pesan
        )}`;

        Linking.openURL(url).catch((err) =>
          console.error("Gagal membuka WhatsApp", err)
        );
      },
    },
    {
      title: t("ProfileMenuLangChange"),
      icon: "language",
      type: "font-awesome",
      onPress: () => setLanguageModalVisible(true),
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshProfile}
          colors={["#e91e63"]}
          tintColor="#e91e63"
        />
      }>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <Image source={user.profilePic} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.nameText}>Hi, {user.name || "User"}</Text>
              <View style={styles.infoRow}>
                <Icon name="gamepad" type="font-awesome" color="#fff" />
                <Text style={styles.infoText}>
                  {user.hobi || "Hobi Belum Di isi"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="circle-info" type="font-awesome" color="#fff" />
                <Text style={styles.infoText}>
                  {user.hobi || "Tentang Belum Di isi"}
                </Text>
              </View>
              {/* <View style={styles.infoRow}>
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
              </View> */}
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Icon name="edit" size={16} color="#e91e63" />
            <Text style={styles.editButtonText}>{t("ProfilEditBtn")}</Text>
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
          <Text style={styles.logoutText}>{t("ProfilLogOutBtn")}</Text>
        </TouchableOpacity>
      </View>
      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Pilih Bahasa</Text>

            {["id", "en"].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageButton,
                  currentLanguage === lang && styles.selectedLanguage,
                ]}
                onPress={() => changeLanguage(lang)}>
                <Text style={styles.languageText}>
                  {lang === "id" ? "Bahasa Indonesia" : "English"}
                </Text>
                {currentLanguage === lang && (
                  <Icon name="check" color="#e91e63" size={20} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.modalCloseText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  languageButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedLanguage: {
    backgroundColor: "#f8f8f8",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#e91e63",
    fontSize: 16,
    fontWeight: "500",
  },
});
