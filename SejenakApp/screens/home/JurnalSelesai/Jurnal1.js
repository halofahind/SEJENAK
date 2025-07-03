import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function Jurnal1({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Journal Selesai</Text>

      <Image
        source={require("../../../assets/Jurnalku/2.png")}
        style={styles.image}
      />

      <Text style={styles.title}>
        Hebat Nama! Kamu Berhasil{"\n"}Menyelesaikan Journal Ini!
      </Text>
      <Text style={styles.description}>
        Perjalanan ini mungkin tidak mudah, tapi kamu telah{"\n"} memilih untuk
        hadir, merasakan, dan memahami dirimu{"\n"} sendiri.
      </Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.primaryText}>Oke, Selesai</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => console.log("Review Journal")}
        >
          <Text style={styles.secondaryText}>Review Journal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 200,
  },
  image: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  buttonGroup: {
    marginTop: "auto", // mendorong ke bawah
    alignItems: "center",
    marginBottom: 40, // jarak dari bawah layar
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 16,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 50,
  },
  secondaryText: {
    color: "#6C63FF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
