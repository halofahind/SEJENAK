import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL } from "../../utils/constants";

export default function JurnalDetail({ route, navigation }) {
  const { jurnal, isLanjutan, existingTransaksi, jenisjurnal } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Merah Muda dengan Gambar & Tombol Kembali */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/Home/1.png")}
          style={styles.headerImage}
        />
      </View>

      {/* Isi Konten */}
      <View style={styles.body}>
        <View style={styles.content}>
          <Text style={styles.title}>{jurnal.title}</Text>
          <Text style={styles.subtitle}>Journal – {jenisjurnal.title}</Text>

          <Text style={styles.sectionTitle}>Apa tujuan journal ini?</Text>
          <Text style={styles.text}>{jurnal.tujuan}</Text>

          <Text style={styles.sectionTitle}>Kenapa melakukan ini?</Text>
          <Text style={styles.text}>{jurnal.kenapa}</Text>
        </View>

        {/* Tombol Mulai */}
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            let transaksi = existingTransaksi;

            try {
              const userData = await AsyncStorage.getItem("userData");
              if (!userData) {
                console.error("User belum login.");
                return;
              }

              const parsedUser = JSON.parse(userData);
              const userId = parsedUser.id;

              if (!isLanjutan) {
                const response = await fetch(
                  `${API_BASE_URL}/transaksiJurnal`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      userId: userId,
                      jurnalId: parseInt(jurnal.id),
                      date: "",
                    }),
                  }
                );

                if (!response.ok) {
                  throw new Error("Gagal membuat transaksi jurnal");
                }

                transaksi = await response.json();
              }

              navigation.navigate("JurnalDetailPertanyaan", {
                jurnal,
                transaksi,
                isLanjutan,
                jenisjurnal,
              });
            } catch (error) {
              console.error("Gagal memproses transaksi jurnal:", error);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isLanjutan ? "Lanjutkan Journal" : "Mulai Journal"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#E9748F",
    height: 180,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },
  headerImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: -10,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#6C63FF",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
