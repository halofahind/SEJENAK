import React from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const users = [
  {
    id: "1",
    name: "Admin Konseling",
    photo: require("../../assets/OnBoarding/AmbilNapasSejenak.png"),
    lastMessage: "Silakan konsultasi kapan saja.",
  },
  {
    id: "2",
    name: "Admin Akademik",
    photo: require("../../assets/OnBoarding/KamuTidakSendirian.png"),
    lastMessage: "Halo, ada yang bisa dibantu?",
  },
];

export default function Konseling({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("DetailKonseling", { user: item })}>
      <Image source={item.photo} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.last}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  name: { fontWeight: "bold", fontSize: 16 },
  last: { color: "#777", marginTop: 4 },
});
