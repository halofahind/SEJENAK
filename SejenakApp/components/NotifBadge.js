import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

const API_URL = "http://192.168.43.40:8080/api/notifikasi"; // Sesuaikan endpoint

const NotifBadge = ({ navigation }) => {
  const [jumlahNotifBaru, setJumlahNotifBaru] = useState(0);

  const fetchNotifikasiBaru = async () => {
    try {
      const res = await axios.get(API_URL);
      const notifBaru = res.data.filter((item) => item.status === "baru");
      setJumlahNotifBaru(notifBaru.length);
    } catch (error) {
      console.log("Gagal ambil notifikasi:", error);
    }
  };

  useEffect(() => {
    fetchNotifikasiBaru();
    const interval = setInterval(fetchNotifikasiBaru, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Notifikasi")}
      style={styles.notifWrapper}
    >
      <Icon name="notifications-none" size={28} color="#444" />
      {jumlahNotifBaru > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{jumlahNotifBaru}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notifWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 18,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default NotifBadge;
