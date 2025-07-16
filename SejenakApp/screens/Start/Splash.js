import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const SPLASH_LOGO = require("../../assets/Splash/Sejenak.png");

export default function SplashScreen() {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  // Bubble data
  const bubbles = useRef(
    Array.from({ length: 8 }).map(() => ({
      x: Math.random() * width,
      y: new Animated.Value(Math.random() * height),
      size: 30 + Math.random() * 50,
      duration: 4000 + Math.random() * 2000,
    }))
  ).current;

  useEffect(() => {
    // Main animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 1000,
          delay: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace("OnBoarding");
    });

    // Dot animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bubble animation
    bubbles.forEach((bubble) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubble.y, {
            toValue: bubble.y._value + 25,
            duration: bubble.duration,
            useNativeDriver: true,
          }),
          Animated.timing(bubble.y, {
            toValue: bubble.y._value,
            duration: bubble.duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return () => {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      textAnim.setValue(0);
      dotAnim.setValue(0);
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#D6385E" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Background bubbles */}
        <View style={styles.background}>
          {bubbles.map((bubble, index) => (
            <Animated.View
              key={index}
              style={[
                styles.bubble,
                {
                  width: bubble.size,
                  height: bubble.size,
                  left: bubble.x,
                  transform: [{ translateY: bubble.y }],
                },
              ]}
            />
          ))}
        </View>

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image source={SPLASH_LOGO} style={styles.logo} />
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

        {/* Slogan */}
        <Animated.Text
          style={[
            styles.slogan,
            {
              opacity: textAnim,
              transform: [
                {
                  translateY: textAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          "Membuat waktu berhenti, walau hanya sejenak."
        </Animated.Text>

        {/* Loading dots */}
        <Animated.View style={styles.loadingIndicator}>
          {[0, 1, 2].map((i) => {
            const scale = dotAnim.interpolate({
              inputRange: [0, 1],
              outputRange: i === 0 ? [1, 0.3] : i === 1 ? [0.3, 1] : [1, 0.3],
            });

            return (
              <Animated.View
                key={i}
                style={[styles.loadingDot, { transform: [{ scale }] }]}
              />
            );
          })}
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
    zIndex: 0,
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
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
    zIndex: 1,
  },
  slogan: {
    color: "white",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 25,
    paddingHorizontal: 40,
    lineHeight: 30,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 2,
    // Untuk custom font, contoh:
    // fontFamily: 'PlayfairDisplay-Italic',
  },
  loadingIndicator: {
    position: "absolute",
    bottom: 80,
    flexDirection: "row",
    zIndex: 2,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginHorizontal: 5,
  },
});
