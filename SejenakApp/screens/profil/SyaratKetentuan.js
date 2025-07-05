import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const SyaratKetentuan = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Syarat dan Ketentuan</Text>

      <Text style={styles.paragraph}>
        Selamat datang di Aplikasi Kami. Dengan menggunakan aplikasi ini, Anda
        setuju dengan syarat dan ketentuan yang berlaku.
      </Text>

      <Text style={styles.heading}>1. Penggunaan Aplikasi</Text>
      <Text style={styles.paragraph}>
        Aplikasi ini hanya boleh digunakan untuk tujuan yang sah sesuai dengan
        hukum yang berlaku di Indonesia.
      </Text>

      <Text style={styles.heading}>2. Data dan Privasi</Text>
      <Text style={styles.paragraph}>
        Kami menghargai privasi Anda dan tidak akan menyalahgunakan data pribadi
        Anda untuk tujuan komersial tanpa izin.
      </Text>

      <Text style={styles.heading}>3. Perubahan Ketentuan</Text>
      <Text style={styles.paragraph}>
        Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan
        akan diberitahukan melalui aplikasi.
      </Text>

      <Text style={styles.paragraph}>
        Dengan menggunakan aplikasi ini, Anda menyetujui seluruh syarat dan
        ketentuan yang tercantum.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  paragraph: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "justify",
  },
});

export default SyaratKetentuan;
