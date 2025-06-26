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

export default function BerdamaiDenganPikiran({ navigation }) {
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
          source={require("../../../assets/Home/1.png")}
          style={styles.headerImage}
        />
      </View>

      {/* Isi Konten */}
      <View style={styles.body}>
        <View style={styles.content}>
          <Text style={styles.title}>Berdamai dengan Pikiran</Text>
          <Text style={styles.subtitle}>Journal – 11 Halaman</Text>

          <Text style={styles.sectionTitle}>Apa tujuan journal ini?</Text>
          <Text style={styles.text}>
            Kamu dapat menulis segala masalah yang kamu hadapi dan yang masih
            mengganggu pikiranmu
          </Text>

          <Text style={styles.sectionTitle}>Kenapa melakukan ini?</Text>
          <Text style={styles.text}>
            Dengan menuliskan pikiranmu, kamu dapat memahami dirimu lebih dalam,
            membantu melepaskan beban yang mengganggu, dan menemukan ketenangan
            di dalam prosesnya.
          </Text>
        </View>

        {/* Tombol Mulai */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HalamanJurnal")}
        >
          <Text style={styles.buttonText}>Mulai Journal</Text>
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
