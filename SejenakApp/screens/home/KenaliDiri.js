import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const carouselData = [
  {
    id: "1",
    title: "Berdamai dengan Pikiran",
    desc: "Tuliskan semua tentang dirimu agar kamu bisa menerima diri sendiri.",
    image: require("../../assets/Home/1.png"),
    pages: "11 Halaman",
  },
  {
    id: "2",
    title: "Menerima Diri Sendiri",
    desc: "Mengenal kelebihan dan kekuranganmu adalah kekuatan.",
    image: require("../../assets/Home/1.png"),
    pages: "7 Halaman",
  },
  {
    id: "3",
    title: "Menerima Diri Sendiri",
    desc: "Mengenal kelebihan dan kekuranganmu adalah kekuatan.",
    image: require("../../assets/Home/1.png"),
    pages: "2 Halaman",
  },
];

const topikList = [
  {
    id: "1",
    title: "Berdamai dengan Kesalahan di Masa Lalu",
    image: require("../../assets/Home/1.png"),
    navigateTo: "BerdamaiDenganMasaLalu"
  },
  {
    id: "2",
    title: "Berdamai dengan Pikira qn",
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (width - 60));
    setCurrentIndex(index);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Kenali Diri Lebih Baik</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={carouselData}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.carousel}>
            <Image source={item.image} style={styles.carouselImage} />
            <View style={styles.carouselTextBox}>
              <Text style={styles.carouselTitle}>{item.title}</Text>
              <Text style={styles.carouselDesc}>{item.desc}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.pages}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Dot Indicator */}
      <View style={styles.dots}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: currentIndex === index ? "#D84059" : "#ccc",
              },
            ]}
          />
        ))}
      </View>

      {/* Detail Section */}
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
    paddingBottom: 40,
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
    marginRight: 12,
    width: width - 60,
  },
  carouselImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 12,
  },
  carouselTextBox: {
    flex: 1,
    justifyContent: "center",
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
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 30,
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
    textAlign: "center",
  },
});
