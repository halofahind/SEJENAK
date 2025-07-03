import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation = useNavigation();

  // Animasi references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      // Phase 1: Background fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      // Phase 2: Logo entrance dengan subtle scale dan fade
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),

      // Phase 3: Hold untuk menampilkan logo
      Animated.delay(1500),

      // Phase 4: Subtle fade out
      Animated.timing(logoOpacity, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start(() => {
      setTimeout(() => {
        navigation.replace("Onboarding");
      }, 200);
    });

    return () => {
      animationSequence.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <Animated.View style={[styles.background, { opacity: fadeAnim }]}>
        <View style={styles.gradientOverlay} />
      </Animated.View>

      {/* Logo container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }, { translateY: slideUpAnim }],
          },
        ]}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/Splash/Sejenak.png")}
            style={styles.logo}
          />
        </View>
      </Animated.View>

      {/* Simple bottom indicator */}
      <Animated.View
        style={[styles.bottomIndicator, { opacity: logoOpacity }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6385E",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#D6385E",
  },
  gradientOverlay: {
    flex: 1,
    background:
      "linear-gradient(135deg, #D6385E 0%, #E91E63 50%, #AD1457 100%)",
    backgroundColor: "#D6385E",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#AD1457",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  bottomIndicator: {
    position: "absolute",
    bottom: 80,
    width: 50,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 2,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});
