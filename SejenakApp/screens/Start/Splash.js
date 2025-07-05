import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const SPLASH_LOGO = require("../../assets/Splash/Sejenak.png");

export default function SplashScreen() {
  const navigation = useNavigation();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence animations
    Animated.sequence([
      // Fade in background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Logo scale and fade in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Wait for 1 second
      Animated.delay(1000),
      // Fade out everything
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace("OnBoarding");
    });

    // Cleanup
    return () => {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    };
  }, [navigation]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#D6385E" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Background with subtle gradient */}
        <View style={styles.background} />

        {/* Logo with smooth scaling and fade */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Image source={SPLASH_LOGO} style={styles.logo} />

          {/* Subtle glow effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: opacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              },
            ]}
          />
        </Animated.View>

        {/* Loading indicator */}
        <Animated.View
          style={[styles.loadingIndicator, { opacity: opacityAnim }]}>
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
          <View style={styles.loadingDot} />
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6385E",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#D6385E",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    zIndex: 10,
  },
  glowEffect: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  loadingIndicator: {
    position: "absolute",
    bottom: 80,
    flexDirection: "row",
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 5,
  },
});
