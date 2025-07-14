import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function JurnalPenutup({ route, navigation }) {
  const { jurnal, transaksi } = route.params;

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem("userData");

        if (userString) {
          const user = JSON.parse(userString);
          console.log(user.nama);
          setUserName(user.nama);
        }
      } catch (e) {
        console.log("Gagal mengambil data:", e);
      }
    };

    getUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "MainTabs",
              state: {
                routes: [{ name: "Jurnalku" }],
              },
            },
          ],
        });
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Journal Selesai</Text>
      <View style={styles.contentCenter}>
        <Image
          source={require("../../assets/Jurnalku/2.png")}
          style={styles.image}
        />

        <Text style={styles.title}>
          Hebat {userName}! Kamu Berhasil Menyelesaikan Journal Ini!
        </Text>
        <Text style={styles.description}>{jurnal?.penutup}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "MainTabs",
                  state: {
                    routes: [{ name: "Jurnalku" }],
                  },
                },
              ],
            })
          }
        >
          <Text style={styles.primaryText}>Terima Kasih, Diriku</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("JurnalkuDetailSelesai", { jurnal: jurnal })
          }
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
    paddingTop: 70,
    paddingHorizontal: 24,
  },
  contentCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    paddingTop: 20,
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
    paddingHorizontal: 20,
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
    alignItems: "center",
    width: "80%",
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
    alignItems: "center",
    width: "80%",
  },
  secondaryText: {
    color: "#6C63FF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
