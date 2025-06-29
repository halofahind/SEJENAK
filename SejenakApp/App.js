// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Feather";

// Screens
import SplashScreen from "./screens/Start/Splash";
import OnboardingScreen from "./screens/Start/OnBoarding";
import Login from "./screens/Login/Login";
import Daftar from "./screens/Login/Daftar";
import Setting from "./screens/profil/Setting";
import Home from "./screens/home/Home";
import Jurnalku from "./screens/jurnalku/Jurnalku";
import Konseling from "./screens/konseling/Konseling";
import Profil from "./screens/profil/Profil";
import KenaliDiriScreen from "./screens/home/KenaliDiri"; 
import BerdamaiDenganPikiran from "./screens/home/DetailTopik/BerdamaiDenganPikiran";
import BerdamaiDenganMasaLalu from "./screens/home/DetailTopik/BerdamaiDenganMasaLalu";
import Pertanyaan1 from "./screens/home/Pertanyaan/Pertanyaan1";
import Jurnal1 from "./screens/home/JurnalSelesai/Jurnal1";

import CustomTabBar from "./components/CurvedBottomTab";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
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
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Daftar" component={Daftar} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="KenaliDiriScreen" component={KenaliDiriScreen} />
        <Stack.Screen
          name="BerdamaiDenganPikiran"
          component={BerdamaiDenganPikiran}
        />
        <Stack.Screen
          name="BerdamaiDenganMasaLalu"
          component={BerdamaiDenganMasaLalu}
        />
        <Stack.Screen name="Pertanyaan1" component={Pertanyaan1} />
        <Stack.Screen name="Jurnal1" component={Jurnal1} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
