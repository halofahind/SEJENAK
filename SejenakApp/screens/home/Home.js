import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function TopikJournal({ navigation }) {
  const topiks = [
    {
      id: "1",
      title: "Kenali Diri Lebih Baik",
      image: require("../../assets/Home/1.png"),
    },
    {
      id: "2",
      title: "Menjalin Relasi",
      image: require("../../assets/Home/1.png"),
    },
    {
      id: "3",
      title: "Cerita Keseharian",
      image: require("../../assets/Home/1.png"),
    },
    {
      id: "4",
      title: "Tingkatkan Potensi Diri",
      image: require("../../assets/Home/1.png"),
    },
    {
      id: "5",
      title: "Membangun Keberanian",
      image: require("../../assets/Home/1.png"),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Quotes hari ini</Text>
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>
          “Hari ini bukan tentang seberapa cepat kamu sampai, tapi seberapa
          tulus kamu melangkah.”
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Topik Journal</Text>
      <Text style={styles.subTitle}>Pilih salah satu topik dan mulai!</Text>

      <View style={styles.topikWrapper}>
        {topiks.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: "#EF6A6A",
                width: item.fullWidth ? "100%" : "48%",
              },
            ]}
            onPress={() =>
              navigation.navigate(item.navigateTo, { topik: item })
            }>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#e8e8e8",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
    color: "#444",
  },
  subTitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  quoteBox: {
    backgroundColor: "#FCD6D9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 13,
    color: "#444",
    fontStyle: "italic",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  topikWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "47%",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  cardText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
