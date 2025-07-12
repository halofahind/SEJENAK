import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { API_BASE_URL } from "../../utils/constants";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

const imageMap = {
  "1.png": require("../../assets/Home/1.png"),
  "2.png": require("../../assets/Home/2.png"),
  "3.png": require("../../assets/Home/3.png"),
  "4.png": require("../../assets/Home/4.png"),
  "5.png": require("../../assets/Home/5.png"),
};

export default function DaftarJurnal({ route, navigation }) {
  const { jenisjurnal } = route.params;
  const [carouselData, setCarouselData] = useState([]);
  const [topikList, setTopikList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressData, setProgressData] = useState({});
  const flatListRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({ role: "user" });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const jurnalRes = await fetch(
            `${API_BASE_URL}/jurnalAktif?id=${jenisjurnal.id}`
          );
          const jurnalData = await jurnalRes.json();

          const mappedData = jurnalData.map((item) => ({
            id: item.id.toString(),
            idJenis: item.jjlId,
            title: item.judul,
            desc: item.desc,
            tujuan: item.tujuan,
            kenapa: item.kenapa,
            penutup: item.penutup,
            image: imageMap[item.foto], // ✅ sudah aman
            pages: `${Math.floor(Math.random() * 10 + 2)} Halaman`,
          }));

          setCarouselData(mappedData);
          setTopikList(mappedData);

          const userData = await AsyncStorage.getItem("userData");
          if (!userData) return;
          setUser(userData);

          const { id: userId } = JSON.parse(userData);

          const trxRes = await fetch(
            `${API_BASE_URL}/transaksiJurnal?id=${userId}`
          );
          const trxData = await trxRes.json();

          let progressMap = {};

          for (let trx of trxData) {
            if (trx.status === "Belum Selesai") {
              const detailRes = await fetch(
                `${API_BASE_URL}/transaksiJurnalDetail?id=${trx.id}`
              );
              const detailData = await detailRes.json();

              const total = detailData.length;
              const answered = detailData.filter(
                (d) => d.jawaban !== null
              ).length;
              const progress = total === 0 ? 0 : answered / total;

              progressMap[trx.jurnalId] = {
                progress,
                transaksi: trx,
                total,
                answered,
              };
            }
          }

          setProgressData(progressMap);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [jenisjurnal.id])
  );

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (width - 60));
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "MainTabs",
                  state: {
                    routes: [{ name: t("MainTabsHome") }],
                  },
                },
              ],
            })
          }
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{jenisjurnal.title}</Text>
        {user?.role === "admin" ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ListJurnal", { jenisjurnal: jenisjurnal })
            }
          >
            <Icon name="edit" size={28} color="#444" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 28 }} />
        )}
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

        <Text style={styles.detailTitle}>Detail Topik Jurnal</Text>
        <Text style={styles.detailDesc}>
          Kumpulan konten dari topik journal pilihanmu!
        </Text>

        <View style={styles.grid}>
          {topikList.map((item) => {
            const progressEntry = progressData[item.id];

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("JurnalDetail", {
                    jurnal: item,
                    isLanjutan: !!progressEntry,
                    existingTransaksi: progressEntry?.transaksi || null,
                    jenisjurnal: jenisjurnal,
                  })
                }
              >
                <Image source={item.image} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.title}</Text>

                {progressEntry && (
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.round(
                              progressEntry.progress * 100
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {`${progressEntry.answered}/${
                        progressEntry.total
                      } (${Math.round(progressEntry.progress * 100)}%)`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 20,
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
    marginBottom: 6,
  },
  progressBarContainer: {
    marginTop: 8,
    alignItems: "center",
  },

  progressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },

  progressBarFill: {
    height: 6,
    backgroundColor: "#E9748F",
  },

  progressText: {
    fontSize: 10,
    color: "#444",
    marginTop: 4,
  },
});
