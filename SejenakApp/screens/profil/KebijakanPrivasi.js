import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";
import { Icon } from "react-native-elements";

const KebijakanPrivasi = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  const openWhatsApp = () => {
    const nomorWA = "6282118028300";
    const pesan =
      "Hai, saya ingin bertanya tentang kebijakan privasi aplikasi ini";
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
          <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.introText}>
          Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
          menggunakan, dan melindungi informasi pribadi Anda saat menggunakan
          aplikasi kami.
        </Text>

        <Text style={styles.sectionTitle}>Informasi yang Kami Kumpulkan</Text>
        <Text style={styles.sectionText}>
          1. Data profil (nama, email, nomor telepon, dll) yang Anda berikan
          saat registrasi
        </Text>
        <Text style={styles.sectionText}>
          2. Data penggunaan aplikasi termasuk interaksi dan preferensi
        </Text>
        <Text style={styles.sectionText}>
          3. Foto profil yang Anda unggah (jika ada)
        </Text>

        <Text style={styles.sectionTitle}>Penggunaan Informasi</Text>
        <Text style={styles.sectionText}>
          1. Untuk menyediakan dan memelihara layanan kami
        </Text>
        <Text style={styles.sectionText}>
          2. Untuk memberi Anda dukungan pelanggan
        </Text>
        <Text style={styles.sectionText}>
          3. Untuk pengembangan dan peningkatan aplikasi
        </Text>
        <Text style={styles.sectionText}>
          4. Untuk mengirim notifikasi penting
        </Text>

        <Text style={styles.sectionTitle}>Perlindungan Data</Text>
        <Text style={styles.sectionText}>
          1. Kami menggunakan enkripsi untuk melindungi data sensitif
        </Text>
        <Text style={styles.sectionText}>
          2. Akses ke data Anda dibatasi hanya untuk keperluan layanan
        </Text>
        <Text style={styles.sectionText}>
          3. Kami menyimpan data Anda selama diperlukan untuk menyediakan
          layanan
        </Text>

        <Text style={styles.sectionTitle}>Berbagi Informasi</Text>
        <Text style={styles.sectionText}>
          Kami tidak akan menjual atau membagikan data pribadi Anda kepada pihak
          ketiga kecuali:
        </Text>
        <Text style={styles.sectionText}>1. Dengan persetujuan Anda</Text>
        <Text style={styles.sectionText}>
          2. Untuk memenuhi kewajiban hukum
        </Text>
        <Text style={styles.sectionText}>
          3. Untuk melindungi hak dan properti kami
        </Text>

        <Text style={styles.sectionTitle}>Hak Anda</Text>
        <Text style={styles.sectionText}>
          1. Anda dapat mengakses dan memperbarui data pribadi Anda melalui
          pengaturan profil
        </Text>
        <Text style={styles.sectionText}>
          2. Anda dapat meminta penghapusan akun dan data pribadi
        </Text>
        <Text style={styles.sectionText}>
          3. Anda dapat memilih untuk tidak menerima notifikasi
        </Text>

        <Text style={styles.sectionTitle}>Perubahan Kebijakan</Text>
        <Text style={styles.sectionText}>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
          Perubahan akan diberitahukan melalui aplikasi.
        </Text>

        <Text style={styles.sectionTitle}>Hubungi Kami</Text>
        <Text style={styles.sectionText}>
          Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini:
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

        <Text style={styles.lastUpdated}>
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
        </Text>
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
    backgroundColor: "#D7385E",
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
  introText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    lineHeight: 20,
    textAlign: "justify",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D7385E",
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
    marginBottom: 20,
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});

export default KebijakanPrivasi;
