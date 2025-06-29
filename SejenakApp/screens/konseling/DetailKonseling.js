import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DetailKonseling({ route }) {
  const { user } = route.params;
  const [messages, setMessages] = useState([
    { id: "1", text: "Halo, selamat datang!", sender: "admin" },
    { id: "2", text: "Saya butuh bantuan.", sender: "me" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    const newMsg = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
    };
    setMessages((prev) => [newMsg, ...prev]);
    setInput("");
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.sender === "me" ? styles.right : styles.left,
      ]}>
      <Text style={styles.msgText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header dengan foto profil */}
      <View style={styles.header}>
        <Image source={user.photo} style={styles.headerAvatar} />
        <Text style={styles.headerTitle}>{user.name}</Text>
      </View>

      {/* List pesan */}
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        style={{ flex: 1 }}
      />

      {/* Input pesan */}
      <View style={styles.inputRow}>
        <TouchableOpacity>
          <Ionicons name="happy-outline" size={24} color="gray" />
        </TouchableOpacity>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ketik pesan..."
          style={styles.input}
        />

        <TouchableOpacity onPress={() => alert("Fitur kirim gambar dummy")}>
          <Ionicons name="image-outline" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007bff",
  },
  headerAvatar: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  bubble: {
    margin: 8,
    padding: 10,
    maxWidth: "75%",
    borderRadius: 10,
  },
  left: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  right: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
  },
  msgText: { color: "#000" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendBtn: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 10,
  },
});
