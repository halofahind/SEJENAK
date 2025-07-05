import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from "../../components/CurvedBottomTab";
import { useEffect } from "react";
import Home from "../home/Home";
import Jurnalku from "../jurnalku/Jurnalku";
import Konseling from "../konseling/Konseling";
import Profil from "../profil/Profil";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert("Keluar", "Yakin ingin keluar dari aplikasi?", [
  //       { text: "Batal", style: "cancel" },
  //       { text: "Keluar", onPress: () => BackHandler.exitApp() },
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove(); // ← ini yang benar
  // }, []);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? "#D84059" : "#aaa"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Jurnalku"
        component={Jurnalku}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book"
              size={24}
              color={focused ? "#D84059" : "#aaa"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Konseling"
        component={Konseling}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="send"
              size={24}
              color={focused ? "#D84059" : "#aaa"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={Profil}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={24}
              color={focused ? "#D84059" : "#aaa"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
