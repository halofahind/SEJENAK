import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from "../../components/CurvedBottomTab";

import Home from "../home/Home";
import Jurnalku from "../jurnalku/Jurnalku";
import Konseling from "../konseling/Konseling";
import Profil from "../profil/Profil";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
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
