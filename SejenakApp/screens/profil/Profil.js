import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Profil({ navigation }) {
  const user = {
    name: "Alfian Ramdhan",
    email: "alfianramdhan003@gmail.com",
    phone: "082196787525",
    gender: "Laki laki",
    address: "Bandung",
    profilePic: require("../../assets/Home/1.png"),
  };

  const handleSetting = () => {
    alert("Pengaturan belum tersedia.");
  };

  const handleEdit = () => {
    alert("Fitur Edit Profil belum tersedia.");
  };

  const handleLogout = () => {
    Alert.alert("Keluar", "Yakin ingin keluar dari aplikasi?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: () => navigation.replace("Login"),
      },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header pink */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingIcon} onPress={handleSetting}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={user.profilePic} style={styles.profileImage} />
        <Text style={styles.hiText}>Hi, {user.name}</Text>
      </View>

      {/* Info Box */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} value={user.name} editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={user.email} editable={false} />

        <Text style={styles.label}>No Telephone/Hp</Text>
        <TextInput style={styles.input} value={user.phone} editable={false} />

        <Text style={styles.label}>Gender</Text>
        <TextInput style={styles.input} value={user.gender} editable={false} />

        <Text style={styles.label}>Alamat</Text>
        <TextInput style={styles.input} value={user.address} editable={false} />

        {/* Tombol Edit */}
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Icon name="edit" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.editText}>Edit Profil</Text>
        </TouchableOpacity>

        {/* Tombol Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon
            name="logout"
            size={20}
            color="#D33"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F28B8B",
    alignItems: "center",
    paddingVertical: 40,
    paddingTop: 60,
    position: "relative",
  },
  settingIcon: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  hiText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF6A6A",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  editText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  logoutText: {
    color: "#D33",
    fontSize: 15,
    fontWeight: "bold",
  },
});
