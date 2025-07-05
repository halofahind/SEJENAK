import React, { useEffect, useRef, useState } from "react";
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
import { API_BASE_URL } from "../../utils/constants";

const { width } = Dimensions.get("window");

export default function DaftarJurnal({ route, navigation }) {
  const { jenisjurnal } = route.params;
  const [carouselData, setCarouselData] = useState([]);
  const [topikList, setTopikList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/jurnalAktif?id=${jenisjurnal.id}`)
      .then((res) => res.json())
      .then((data) => {
        const mappedData = data.map((item, index) => ({
          id: item.id.toString(),
          title: item.judul,
          desc: item.kenapa,
          image: require("../../assets/Home/1.png"),
          pages: `${Math.floor(Math.random() * 10 + 2)} Halaman`,
          navigateTo: "BerdamaiDenganPikiran",
        }));

        setCarouselData(mappedData);
        setTopikList(mappedData); // Jika memang semua item juga dipakai untuk Topik
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
        <Text style={styles.title}>{jenisjurnal.title}</Text>
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
      <Text style={styles.detailTitle}>Detail Topik Jurnal</Text>
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
