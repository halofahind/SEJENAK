import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Feather";

import CustomTabBar from "./components/CurvedBottomTab";
import Home from "./screens/home/Home";
import Jurnalku from "./screens/jurnalku/Jurnalku";
import Konseling from "./screens/konseling/Konseling";
import Profil from "./screens/profil/Profil";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
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
          headerShown: false,
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
          headerShown: false,
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
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={Profil}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="user"
              size={24}
              color={focused ? "#D84059" : "#aaa"}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };
    checkLaunch();
  }, []);

  if (isFirstLaunch === null) return null; // bisa return <Splash /> atau loading

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
