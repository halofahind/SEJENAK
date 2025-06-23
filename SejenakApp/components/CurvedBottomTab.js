import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const TAB_COUNT = 4;
const tabWidth = width / TAB_COUNT;
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function CustomTabBar({ state, descriptors, navigation }) {
  const activeX = useSharedValue(getX(state.index));

  useEffect(() => {
    activeX.value = withTiming(getX(state.index), { duration: 100 });
  }, [state.index]);

  const animatedProps = useAnimatedProps(() => {
    "worklet";
    const x = activeX.value;
    const R = 70; // Lebar lengkung
    const H = 35; // Tinggi lengkung

    const d = `
      M0,0
      H${x - R}
      C${x - R / 2},0 ${x - R / 2},${H} ${x},${H}
      C${x + R / 2},${H} ${x + R / 2},0 ${x + R},0
      H${width}
      V100
      H0
      Z
    `;

    return { d };
  });

  return (
    <View style={styles.wrapper}>
      <Svg width={width} height={100} style={StyleSheet.absoluteFill}>
        <AnimatedPath animatedProps={animatedProps} fill="#ffffff" />
      </Svg>

      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };
          // return (
          //   <TouchableOpacity
          //     key={route.key}
          //     onPress={onPress}
          //     activeOpacity={1}
          //     style={styles.tabButton}>
          //     <View style={styles.iconArea}>
          //       {isFocused && (
          //         <View style={styles.placeholderWrapper}>
          //           <Text style={styles.placeholderText}>{route.name}</Text>
          //         </View>
          //       )}
          //       <View
          //         style={[
          //           styles.iconWrapper,
          //           isFocused && styles.activeIconWrapper,
          //         ]}>
          //         {options.tabBarIcon({
          //           focused: isFocused,
          //           color: isFocused ? "#000" : "#aaa",
          //           size: 24,
          //         })}
          //       </View>
          //     </View>
          //   </TouchableOpacity>
          // );
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={1}
              style={styles.tabButton}>
              <View style={styles.iconArea}>
                <View
                  style={[
                    styles.iconWrapper,
                    isFocused && styles.activeIconWrapper,
                  ]}>
                  {options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? "#000" : "#aaa",
                    size: 24,
                  })}
                </View>

                <Text
                  style={{
                    top: 10,
                    fontSize: 12,
                    color: isFocused ? "#D84059" : "#aaa",
                  }}>
                  {route.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getX(index) {
  return tabWidth * index + tabWidth / 2;
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 100,
    paddingBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    width: 60,
    height: 60,
    position: "absolute",
    top: -70,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    justifyContent: "center",
    alignItems: "center",
  },
  iconArea: {
    alignItems: "center",
  },

  placeholderWrapper: {
    position: "absolute",
    top: 10, // atau kamu bisa adjust ± sesuai selera
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D84059",
  },
});
