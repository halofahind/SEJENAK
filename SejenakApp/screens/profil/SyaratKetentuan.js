import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";
import { Icon } from "react-native-elements";

const SyaratKetentuan = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const openWhatsApp = () => {
    const nomorWA = "6282118028300";
    const pesan =
      "Hai, saya ingin bertanya tentang syarat dan ketentuan aplikasi ini";
    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

    Linking.openURL(url).catch((err) =>
      console.error("Gagal membuka WhatsApp", err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon
            name="arrow-left"
            type="font-awesome"
            color="#fff"
            size={20}
            onPress={handleBack}
            containerStyle={styles.backButton}
          />
          <Text style={styles.headerTitle}>Syarat & Ketentuan</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Penggunaan Aplikasi</Text>
        <Text style={styles.sectionText}>
          1. Dengan menggunakan aplikasi ini, Anda setuju untuk mematuhi semua
          syarat dan ketentuan yang berlaku.
        </Text>
        <Text style={styles.sectionText}>
          2. Aplikasi ini ditujukan untuk penggunaan pribadi dan non-komersial.
        </Text>

        <Text style={styles.sectionTitle}>Akun Pengguna</Text>
        <Text style={styles.sectionText}>
          1. Anda bertanggung jawab penuh atas kerahasiaan informasi akun Anda.
        </Text>
        <Text style={styles.sectionText}>
          2. Kami berhak menangguhkan atau menutup akun yang melanggar
          ketentuan.
        </Text>

        <Text style={styles.sectionTitle}>Konten</Text>
        <Text style={styles.sectionText}>
          1. Anda dilarang mengunggah konten yang melanggar hak cipta,
          mengandung SARA, atau tidak senonoh.
        </Text>
        <Text style={styles.sectionText}>
          2. Kami berhak menghapus konten yang dianggap tidak pantas tanpa
          pemberitahuan.
        </Text>

        <Text style={styles.sectionTitle}>Privasi</Text>
        <Text style={styles.sectionText}>
          1. Data pribadi Anda akan dilindungi sesuai dengan Kebijakan Privasi
          kami.
        </Text>
        <Text style={styles.sectionText}>
          2. Kami tidak akan menjual atau membagikan data Anda kepada pihak
          ketiga tanpa izin.
        </Text>

        <Text style={styles.sectionTitle}>Perubahan Ketentuan</Text>
        <Text style={styles.sectionText}>
          Kami dapat mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan
          akan diberitahukan melalui aplikasi.
        </Text>

        <Text style={styles.sectionTitle}>Hubungi Kami</Text>
        <Text style={styles.sectionText}>
          Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan
          hubungi kami:
        </Text>
        <View style={styles.contactButton}>
          <Icon
            name="whatsapp"
            type="font-awesome"
            color="#fff"
            size={16}
            onPress={openWhatsApp}
          />
          <Text style={styles.contactText} onPress={openWhatsApp}>
            Hubungi via WhatsApp
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#e91e63",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  headerContent: {
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
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e91e63",
    marginTop: 15,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
});

export default SyaratKetentuan;
