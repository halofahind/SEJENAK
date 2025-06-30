import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function DetailAkun({ route }) {
  const { data } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail Akun</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="person" size={24} color="#D6385E" />
          <Text style={styles.label}>Nama</Text>
        </View>
        <Text style={styles.value}>{data.nama}</Text>

        <View style={styles.row}>
          <MaterialIcons name="account-circle" size={24} color="#D6385E" />
          <Text style={styles.label}>Username</Text>
        </View>
        <Text style={styles.value}>{data.username}</Text>

        <View style={styles.row}>
          <MaterialIcons name="verified-user" size={24} color="#D6385E" />
          <Text style={styles.label}>Role</Text>
        </View>
        <Text style={styles.value}>{data.role}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D6385E",
    marginTop: 50,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
    marginLeft: 32,
  },
});
