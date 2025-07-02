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

// Constants for animation durations and values
const ANIMATION_DURATIONS = {
  FADE: 600,
  LOGO: 1200,
  TEXT: 1000,
  EXIT: 800,
  PULSE: 2000,
  GLOW: 3000,
  WAVE: 6000,
  FLOAT: 3500,
};

const SPLASH_LOGO = require("../../assets/Splash/Sejenak.png");

export default function SplashScreen() {
  const navigation = useNavigation();

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(120)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimations = () => {
      // Start all animations
      Animated.loop(createPulseAnimation()).start();
      Animated.loop(createGlowAnimation()).start();
      Animated.loop(createWaveAnimation()).start();
      Animated.loop(createFloatAnimation()).start();
      startMainAnimationSequence();
    };

    const startMainAnimationSequence = () => {
      Animated.sequence([
        createFadeInAnimation(),
        createLogoEntranceAnimation(),
        createTextEntranceAnimation(),
        Animated.delay(2200),
        createExitAnimation(),
      ]).start(() => {
        setTimeout(() => {
          navigation.replace("OnBoarding");
        }, 150);
      });
    };

    startAnimations();

    return () => {
      // Cleanup animations
      Animated.loop(createPulseAnimation()).stop();
      Animated.loop(createGlowAnimation()).stop();
      Animated.loop(createWaveAnimation()).stop();
      Animated.loop(createFloatAnimation()).stop();
    };
  }, [navigation]);

  const createPulseAnimation = () => {
    return Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.08,
        duration: ANIMATION_DURATIONS.PULSE,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.PULSE,
        useNativeDriver: true,
      }),
    ]);
  };

  const createGlowAnimation = () => {
    return Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.GLOW,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.2,
        duration: ANIMATION_DURATIONS.GLOW,
        useNativeDriver: true,
      }),
    ]);
  };

  const createWaveAnimation = () => {
    return Animated.timing(waveAnim, {
      toValue: 1,
      duration: ANIMATION_DURATIONS.WAVE,
      useNativeDriver: true,
    });
  };

  const createFloatAnimation = () => {
    return Animated.sequence([
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.FLOAT,
        useNativeDriver: true,
      }),
      Animated.timing(floatAnim, {
        toValue: 0,
        duration: ANIMATION_DURATIONS.FLOAT,
        useNativeDriver: true,
      }),
    ]);
  };

  const createFadeInAnimation = () => {
    return Animated.timing(fadeAnim, {
      toValue: 1,
      duration: ANIMATION_DURATIONS.FADE,
      useNativeDriver: true,
    });
  };

  const createLogoEntranceAnimation = () => {
    return Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.LOGO,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]);
  };

  const createTextEntranceAnimation = () => {
    return Animated.parallel([
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.TEXT,
        useNativeDriver: true,
      }),
      Animated.spring(textSlideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);
  };

  const createExitAnimation = () => {
    return Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATIONS.EXIT,
        useNativeDriver: true,
      }),
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATIONS.EXIT,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATIONS.EXIT,
        useNativeDriver: true,
      }),
    ]);
  };

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-15deg", "0deg"],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const waveTransform = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 360],
  });

  const floatTransform = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 15],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#D6385E" />
      <View style={styles.container}>
        {/* Dynamic Animated Background */}
        <Animated.View style={[styles.background, { opacity: fadeAnim }]}>
          <View style={styles.gradientOverlay} />

          {/* Floating Bubbles */}
          {[...Array(12)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.floatingBubble,
                {
                  left: `${8 + index * 8}%`,
                  top: `${10 + (index % 5) * 18}%`,
                  width: 15 + (index % 4) * 8,
                  height: 15 + (index % 4) * 8,
                  borderRadius: (15 + (index % 4) * 8) / 2,
                  transform: [
                    {
                      translateY: Animated.multiply(
                        floatTransform,
                        (index % 2 === 0 ? 1 : -1) * (0.5 + (index % 3) * 0.3)
                      ),
                    },
                    {
                      scale: Animated.multiply(
                        pulseAnim,
                        0.7 + (index % 3) * 0.2
                      ),
                    },
                    {
                      rotate: `${index * 30}deg`,
                    },
                  ],
                  opacity: Animated.multiply(
                    logoOpacity,
                    0.3 + (index % 3) * 0.2
                  ),
                },
              ]}
            />
          ))}

          {/* Wave Circles */}
          {[...Array(4)].map((_, index) => (
            <Animated.View
              key={`wave-${index}`}
              style={[
                styles.waveCircle,
                {
                  width: 200 + index * 150,
                  height: 200 + index * 150,
                  borderRadius: (200 + index * 150) / 2,
                  transform: [
                    {
                      rotate: `${
                        waveTransform * (index % 2 === 0 ? 1 : -1)
                      }deg`,
                    },
                    {
                      scale: Animated.multiply(pulseAnim, 0.8 + index * 0.1),
                    },
                  ],
                  opacity: Animated.multiply(glowOpacity, 0.1 - index * 0.02),
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Logo with Magical Effects */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: Animated.multiply(logoScale, pulseAnim) },
                  { translateY: Animated.add(slideUpAnim, floatTransform) },
                  { rotate: logoRotateInterpolate },
                ],
              },
            ]}
          >
            {/* Multiple Glow Layers */}
            <Animated.View
              style={[
                styles.glowLayer1,
                {
                  opacity: glowOpacity,
                  transform: [{ scale: Animated.multiply(pulseAnim, 1.2) }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.glowLayer2,
                {
                  opacity: Animated.multiply(glowOpacity, 0.7),
                  transform: [{ scale: Animated.multiply(pulseAnim, 1.5) }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.glowLayer3,
                {
                  opacity: Animated.multiply(glowOpacity, 0.4),
                  transform: [{ scale: Animated.multiply(pulseAnim, 2) }],
                },
              ]}
            />

            {/* Logo Image */}
            <Animated.View
              style={[
                styles.logoImageContainer,
                {
                  transform: [{ rotate: `${waveTransform * 0.1}deg` }],
                },
              ]}
            >
              <Image source={SPLASH_LOGO} style={styles.logo} />
            </Animated.View>
          </Animated.View>

          {/* App Name with Elegant Typography */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textFadeAnim,
                transform: [{ translateY: textSlideAnim }],
              },
            ]}
          ></Animated.View>
        </View>

        {/* Elegant Bottom Indicator */}
        <Animated.View
          style={[
            styles.bottomIndicatorContainer,
            {
              opacity: logoOpacity,
            },
          ]}
        >
          {[...Array(3)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.bottomDot,
                {
                  transform: [
                    {
                      scale: Animated.multiply(
                        pulseAnim,
                        1 + (index === 1 ? 0.3 : 0.1)
                      ),
                    },
                  ],
                  opacity: 0.8 - index * 0.2,
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Floating Accent Elements */}
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={`accent-${index}`}
            style={[
              styles.accentElement,
              {
                top: `${15 + index * 15}%`,
                left: index % 2 === 0 ? "10%" : "85%",
                transform: [
                  {
                    translateY: Animated.multiply(
                      floatTransform,
                      index % 2 === 0 ? 1 : -1
                    ),
                  },
                  {
                    rotate: `${
                      waveTransform * (index % 2 === 0 ? 0.5 : -0.5)
                    }deg`,
                  },
                  {
                    scale: Animated.multiply(
                      pulseAnim,
                      0.6 + (index % 3) * 0.2
                    ),
                  },
                ],
                opacity: Animated.multiply(fadeAnim, 0.4),
              },
            ]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6385E",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
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
    backgroundColor: "#D6385E",
    position: "relative",
  },
  floatingBubble: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  waveCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -100,
    marginLeft: -100,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "transparent",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  glowLayer1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 25,
  },
  glowLayer2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(233, 30, 99, 0.2)",
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  glowLayer3: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(173, 20, 87, 0.05)",
    shadowColor: "#AD1457",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 60,
    elevation: 15,
  },
  logoImageContainer: {
    zIndex: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 25,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  appName: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 3,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.95)",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.5,
    fontStyle: "italic",
  },
  bottomIndicatorContainer: {
    position: "absolute",
    bottom: 120,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 8,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 12,
  },
  accentElement: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
});
