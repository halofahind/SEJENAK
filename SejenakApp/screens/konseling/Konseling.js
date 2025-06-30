import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatList({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(stored);
      setUserData(parsed);

      // Sementara hardcoded, nanti bisa dari API
      setUsers([
        { username: "admin001", display: "Admin Konseling" },
        { username: "admin002", display: "Admin Akademik" },
      ]);
    };

    load();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DetailKonseling", {
          userData,
          targetUsername: item.username,
          targetDisplay: item.display,
        })
      }>
      <Text style={styles.name}>{item.display}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    color: "#333",
  },
});
