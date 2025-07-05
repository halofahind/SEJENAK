import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

export default function AddMotivasiScreen({ navigation }) {
  const [motivasi, setMotivasi] = useState("");

  const handleSubmit = async () => {
    if (motivasi.trim() === "") {
      Alert.alert("Oops", "Motivasi tidak boleh kosong.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.53.121:8080/motivasi/add", {
        motivasiText: motivasi,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Berhasil", "Motivasi berhasil ditambahkan.");
        setMotivasi("");
        navigation.goBack();
      } else {
        throw new Error("Gagal simpan motivasi");
      }
    } catch (error) {
      console.error("Gagal menambahkan motivasi:", error.message);
      Alert.alert("Error", "Gagal menambahkan motivasi. Pastikan server aktif dan IP benar.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D7385E" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Motivasi</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Tulis Motivasi</Text>
        <TextInput
          style={styles.input}
          multiline
          value={motivasi}
          onChangeText={setMotivasi}
          placeholder="Contoh: Jangan takut gagal, takutlah untuk tidak mencoba."
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Simpan Motivasi</Text>
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
    backgroundColor: "#D7385E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 35,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D7385E",
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#D7385E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});