import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Animated } from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Kenali Dirimu\nLebih Dalam",
    desc: "Kami tahu dunia kampus bisa melelahkan. Di sini, kamu bisa meluangkan waktu untuk memahami perasaan, pikiran, dan kebutuhanmu tanpa penilaian.",
    image: require("../../assets/OnBoarding/KenaliDirimuLebihDalam.png"),
  },
  {
    id: "2",
    title: "Kamu tidak\nsendirian",
    desc: "Aplikasi ini hadir sebagai teman perjalanan mentamu. Dari journaling, hingga akses bantuan profesional semua dalam satu ruang yang aman dan rahasia.",
    image: require("../../assets/OnBoarding/KamuTidakSendirian.png"),
  },
  {
    id: "3",
    title: "Ambil Napas\nSejenak",
    desc: "Waktunya memberi ruang untuk dirimu sendiri. Mulailah perjalanan menuju kesehatan mental yang lebih baik satu langkah kecil, satu hari sejenak.",
    image: require("../../assets/OnBoarding/AmbilNapasSejenak.png"),
  },
  {
    id: "4",
    title: "Selamat Datang di,\nSejenak",
    desc: "Ini ruang amanmu untuk merasa, merenung, dan berkembang. Tak perlu sempurna ukup jadi dirimu, satu langkah sejenak demi sejenak.",
    image: require("../../assets/OnBoarding/SelamatDatang.png"),
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentSlide + 1 });
    } else {
      navigation.replace("Login");
    }
  };

  const handleSkip = () => navigation.replace("Login");

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const titleOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });

    const imageOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });

    const descOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });

    const isEven = index % 2 === 0;

    const titleColor =
      currentSlide === 3 ? "#fff" : isEven ? "#fff" : "#D6385E";
    const descColor = isEven ? "#D6385E" : "#fff"; // bisa bedakan lagi kalau mau

    return (
      <View style={[styles.slide]}>
        {/* Title dengan animasi */}
        <Animated.Text
          style={[styles.title, { color: titleColor, opacity: titleOpacity }]}
        >
          {item.title}
        </Animated.Text>

        {/* Gambar dengan animasi */}
        <Animated.Image
          source={item.image}
          style={[
            styles.image,
            {
              opacity: imageOpacity,
            },
          ]}
        />

        {/* Deskripsi dengan animasi */}
        <Animated.Text
          style={[styles.desc, { color: descColor, opacity: descOpacity }]}
        >
          {item.desc}
        </Animated.Text>
      </View>
    );
  };

  const isEven = currentSlide % 2 === 0;
  const circleColor = isEven ? "#fff" : "#D6385E";
  const buttonColor =
    currentSlide === 3 ? "#D6385E" : isEven ? "#fff" : "#D6385E";
  const buttonBgColor =
    currentSlide === 3 ? "#fff" : isEven ? "#D6385E" : "#fff";
  const backgroundColor =
    currentSlide === 3 ? "#D6385E" : isEven ? "#D6385E" : "#fff";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Background Circle - Fixed */}
      <View style={[styles.circle, { backgroundColor: circleColor }]} />

      {/* Skip Button - Fixed */}
      <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
        <Text style={[styles.skipText, , { color: buttonColor }]}>Lewati</Text>
      </TouchableOpacity>

      {/* FlatList */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
            listener: (e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentSlide(index);
            },
          }
        )}
        scrollEventThrottle={16}
      />

      {/* Indicator - Fixed */}
      <View style={styles.indicatorWrapper}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 35, 8],
            extrapolate: "clamp",
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.indicator,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: buttonBgColor,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Next Button - Fixed */}
      <TouchableOpacity
        onPress={handleNext}
        style={[styles.nextButton, { backgroundColor: buttonBgColor }]}
      >
        <Text style={[styles.nextText, { color: buttonColor }]}>
          {currentSlide === slides.length - 1 ? "AYO MULAI" : "SELANJUTNYA"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6385E",
  },
  slide: {
    width,
    padding: 20,
    paddingBottom: 130,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: "contain",
    marginBottom: 10,
    marginTop: 300,
    zIndex: 999,
  },
  title: {
    position: "absolute",
    top: 90,
    left: 20,
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    textAlign: "left",
    marginBottom: 15,
  },
  desc: {
    fontSize: 15,
    color: "#5E5E5D",
    textAlign: "center",
    marginHorizontal: 30,
    marginBottom: 80,
    fontWeight: "600",
  },
  circle: {
    position: "absolute",
    bottom: -100,
    left: -50,
    width: 507,
    height: 500,
    backgroundColor: "#fff",
    borderRadius: 250,
    zIndex: 0,
  },
  indicatorWrapper: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    flexDirection: "row",
    zIndex: 999,
  },
  indicator: {
    height: 8,
    width: 8,
    backgroundColor: "#D6385E",
    margin: 4,
    borderRadius: 4,
    opacity: 0.4,
  },
  nextButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#D6385E",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 100,
    zIndex: 999,
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  skipBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 999,
  },
  skipText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
