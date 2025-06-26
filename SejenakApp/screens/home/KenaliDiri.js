import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const topikList = [
  {
    id: "1",
    title: "Berdamai dengan Kesalahan di Masa Lalu",
    image: require("../../assets/Home/1.png"),
  },
  {
    id: "2",
    title: "Berdamai dengan Pikiran",
    image: require("../../assets/Home/1.png"),
    navigateTo: "BerdamaiDenganPikiran",
  },
  {
    id: "3",
    title: "Bertumbuh dalam Duka",
    image: require("../../assets/Home/1.png"),
  },
  {
    id: "4",
    title: "It’s Okay Not To Be Okay",
    image: require("../../assets/Home/1.png"),
  },
];

export default function KenaliDiriScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Kenali Diri Lebih Baik</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Carousel */}
      <View style={styles.carousel}>
        <Image
          source={require("../../assets/Home/1.png")}
          style={styles.carouselImage}
        />
        <View style={styles.carouselTextBox}>
          <Text style={styles.carouselTitle}>Berdamai dengan Pikiran</Text>
          <Text style={styles.carouselDesc}>
            Tuliskan semua tentang dirimu agar kamu bisa menerima diri sendiri.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>11 Halaman</Text>
          </View>
        </View>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        <View style={[styles.dot, { backgroundColor: "#D84059" }]} />
        <View style={styles.dot} />
      </View>

      {/* Detail */}
      <Text style={styles.detailTitle}>Detail Topik</Text>
      <Text style={styles.detailDesc}>
        Kumpulan konten dari topik journal pilihanmu!
      </Text>

      <View style={styles.grid}>
        {topikList.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => {
              if (item.navigateTo) {
                navigation.navigate(item.navigateTo, { topik: item });
              }
            }}
          >
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  carousel: {
    backgroundColor: "#F8F1F1",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    marginBottom: 10,
  },
  carouselImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 12,
  },
  carouselTextBox: {
    flex: 1,
  },
  carouselTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  carouselDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#EF6A6A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  badgeText: {
    fontSize: 10,
    color: "#fff",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  detailDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 24,
  },
  card: {
    width: "47%",
    backgroundColor: "#F4F4F4",
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
});
