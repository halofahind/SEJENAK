// screens/OnboardingScreen.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    key: "slide1",
    title: "Kenali Dirimu\nLebih Dalam",
    text: "Kami tahu dunia kampus bisa melelahkan. Di sini, kamu bisa meluangkan waktu untuk memahami perasaan, pikiran, dan kebutuhanmu—tanpa penilaian.",
    image: require("../assets/OnBoarding/o4.png"),
    backgroundColor: "#D84059",
  },
  {
    key: "slide2",
    title: "Kamu tidak\nsendirian",
    text: "Aplikasi ini hadir sebagai teman perjalanan mentalmu. Dari journaling, hingga akses bantuan profesional—semua dalam satu ruang yang aman dan rahasia.",
    image: require("../assets/OnBoarding/o3.png"),
    backgroundColor: "#FFFFFF",
    isWhite: true,
  },
  {
    key: "slide3",
    title: "Ambil Napas\nSejenak",
    text: "Waktunya memberi ruang untuk dirimu sendiri. Mulailah perjalanan menuju kesehatan mental yang lebih baik—satu langkah kecil, satu hari sejenak.",
    image: require("../assets/OnBoarding/o1.png"),
    backgroundColor: "#D84059",
  },
  {
    key: "slide4",
    title: "Selamat Datang di,\nSejenak",
    text: "Ini ruang amanmu untuk merasa, merenung, dan berkembang. Tak perlu sempurna—cukup jadi dirimu, satu langkah sejenak demi sejenak.",
    image: require("../assets/OnBoarding/o2.png"),
    backgroundColor: "#D84059",
    isLast: true,
  },
];

export default function OnboardingScreen({ navigation, onComplete }) {
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      // Fallback navigation method
      navigation.replace("Main");
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const _renderItem = ({ item, index }) => {
    const isWhite = item.isWhite;
    const textColor = isWhite ? "#D84059" : "#FFFFFF";
    const skipTextColor = isWhite ? "#D84059" : "#FFFFFF";

    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <StatusBar
          barStyle={isWhite ? "dark-content" : "light-content"}
          backgroundColor={item.backgroundColor}
        />

        {/* Skip Button - Hide on last slide */}
        {!item.isLast && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={[styles.skipText, { color: skipTextColor }]}>
              Lewati
            </Text>
          </TouchableOpacity>
        )}

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
          <Text style={[styles.text, { color: textColor }]}>{item.text}</Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Custom Dots */}
          <View style={styles.pagination}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === index ? textColor : textColor + "33",
                    width: i === index ? 24 : 8,
                    height: 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Next/Get Started Button - Only show on last slide */}
          {item.isLast && (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: textColor }]}
              onPress={handleComplete}>
              <Text
                style={[
                  styles.nextButtonText,
                  { color: item.backgroundColor },
                ]}>
                GET STARTED
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const _renderNextButton = () => null;
  const _renderDoneButton = () => null;
  const _renderPrevButton = () => null;

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      showDoneButton={false}
      showNextButton={false}
      showPrevButton={false}
      renderNextButton={_renderNextButton}
      renderDoneButton={_renderDoneButton}
      renderPrevButton={_renderPrevButton}
      dotStyle={{ display: "none" }}
      activeDotStyle={{ display: "none" }}
      onDone={handleComplete}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 24,
    padding: 8,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  image: {
    width: 280,
    height: 280,
    maxWidth: "100%",
    maxHeight: "100%",
  },
  textContainer: {
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 38,
    marginBottom: 20,
    textAlign: "left",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "left",
  },
  bottomSection: {
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  dot: {
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
