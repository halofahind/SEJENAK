import React, { useState, useEffect, useCallback } from "react";
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
  SafeAreaView,
  StatusBar,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import KebijakanPrivasi from "./KebijakanPrivasi";
import i18n from "../../locales/i18n";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../utils/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import Iconf from "react-native-vector-icons/FontAwesome";
import Tanaman from "../../assets/Profil/tanaman.png";

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
            uri: `${API_BASE_URL}/uploads/foto-profil/${
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
          hobi: parsedData.hobi || "",
          about: parsedData.about || "",
          phone: parsedData.telepon || "",
          gender: parsedData.gender || "",
          address: parsedData.alamat || "",
          hobi: parsedData.hobi || "",
          tentang: parsedData.tentang || "",
          profilePic: profilePicSource,
          role: parsedData.role || "user",
        });
      }
    } catch (error) {
      console.error("Gagal merefresh profil:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [])
  );

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    hobi: "",
    phone: "",
    gender: "",
    about: "",
    profilePic: "",
    role: "user",
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
            profilePicSource = {
              uri: `${API_BASE_URL}/uploads/foto-profil/${parsedData.usrFoto}`,
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
            hobi: parsedData.hobi || "",
            phone: parsedData.telepon || "",
            gender: parsedData.gender || "",
            address: parsedData.alamat || "",
            hobi: parsedData.hobi || "",
            tentang: parsedData.tentang || "",
            profilePic: profilePicSource,
            role: parsedData.user || "user",
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
    ...(user?.role === "admin"
      ? [
          {
            title: t("ProfilMenuManageAcc"),
            icon: "person-outline",
            onPress: () => {
              navigation.navigate("KelolaAkun");
            },
          },
        ]
      : []),
    {
      title: t("ProfilMenuPassChange"),
      icon: "lock",
      onPress: () => {
        navigation.navigate("GantiPassword");
      },
    },
    {
      title: t("ProfilMenuSK"),
      icon: "book",
      onPress: () => {
        navigation.navigate("SyaratKetentuan");
      },
    },
    {
      title: t("ProfilMenuPrivacy"),
      icon: "shield",
      onPress: () => {
        navigation.navigate(KebijakanPrivasi);
      },
    },
    {
      title: t("ProfilMenuCallMe"),
      icon: "whatsapp",
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
      onPress: () => setLanguageModalVisible(true),
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D7385E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={Tanaman}
          style={styles.decorativeImage}
          resizeMode="contain"
        />
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <Image source={user.profilePic} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.nameText}>{user.name || "User"}</Text>
              <View style={styles.infoRow}>
                <Icon
                  name="gamepad"
                  type="font-awesome"
                  color="#fff"
                  size={20}
                />
                <Text style={styles.infoText}>
                  {user.hobi || "Hobi Belum Di isi"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon
                  name="info-outline"
                  type="font-awesome"
                  color="#fff"
                  size={20}
                />
                <Text style={styles.infoText}>
                  {user.tentang || "Tentang Belum Di isi"}
                </Text>
              </View>

              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Icon name="edit" size={16} color="#D7385E" />
                <Text style={styles.editButtonText}>{t("ProfilEditBtn")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     onRefresh={refreshProfile}
      //     colors={["#D7385E"]}
      //     tintColor="#D7385E"
      //   />
      // }
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Icon
                name={item.icon}
                size={24}
                type={item.type}
                color="#5E5E5D"
              />
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#fff" />
            <Text style={styles.logoutText}>{t("ProfilLogOutBtn")}</Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={languageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
        >
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
                  onPress={() => changeLanguage(lang)}
                >
                  <Text style={styles.languageText}>
                    {lang === "id" ? "Bahasa Indonesia" : "English"}
                  </Text>
                  {currentLanguage === lang && (
                    <Icon name="check" color="#D7385E" size={20} />
                  )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setLanguageModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
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
  decorativeImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
  },

  header: {
    backgroundColor: "#D7385E",
    paddingTop: 70,
    paddingBottom: 25,
    paddingHorizontal: 10,
  },
  headerContent: {
    position: "relative",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#fff",
    marginRight: 0,
    left: 10,
  },
  userInfo: {
    flex: 1,
    left: 30,
  },
  nameText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
    marginRight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
    opacity: 0.9,
  },
  editButton: {
    position: "static",
    top: 25,
    right: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    width: 90,
    left: 30,
  },
  editButtonText: {
    color: "#D7385E",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    textAlign: "left",
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutContainer: {
    paddingHorizontal: 20,
    zIndex: 10,
  },
  primaryButton: {
    backgroundColor: "#D7385E",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    flexDirection: "row",
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
    color: "#D7385E",
    fontSize: 16,
    fontWeight: "500",
  },
});
