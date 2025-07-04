// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Feather";
import { SafeAreaView, StyleSheet, Text } from "react-native";
// Screens
import SplashScreen from "./screens/Start/Splash";
import OnboardingScreen from "./screens/Start/OnBoarding";
import Login from "./screens/Login/Login";
import Daftar from "./screens/Login/Daftar";
import Setting from "./screens/profil/Setting";
import KenaliDiriScreen from "./screens/home/KenaliDiri";
import BerdamaiDenganPikiran from "./screens/home/DetailTopik/BerdamaiDenganPikiran";
import DetailKonseling from "./screens/konseling/DetailKonseling";
import TopikList from "./screens/konseling/TopikList";
import MainTabs from "./screens/Start/MainTabs";
import TopikForm from "./screens/konseling/TopikForm";
import Topik from "./screens/konseling/Topik";
import Pertanyaan1 from "./screens/home/Pertanyaan/Pertanyaan1";
import KelolaAkun from "./screens/profil/AkunSetting/KelolaAkun";
import GantiPassword from "./screens/profil/AkunSetting/GantiPassword";
import HapusAkun from "./screens/profil/AkunSetting/HapusAkun";
import AkunPersonal from "./screens/profil/AkunSetting/AkunPersonal";
import MoodSummary from "./screens/home/Mood/DetailMood/MoodSummary";
import MoodTracker from "./screens/home/Mood/MoodTracker";
import NextScreen from "./screens/home/Mood/NextScreen";
import Jurnal1 from "./screens/home/JurnalSelesai/Jurnal1";
import DetailAkun from "./screens/profil/Detail/DetailAkun";
import TambahAkun from "./screens/profil/TambahAkun";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Daftar" component={Daftar} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DetailKonseling" component={DetailKonseling} />
        <Stack.Screen name="Topik" component={Topik} />
        <Stack.Screen name="TopikList" component={TopikList} />
        <Stack.Screen name="KenaliDiriScreen" component={KenaliDiriScreen} />
        <Stack.Screen name="TopikForm" component={TopikForm} />

        <Stack.Screen
          name="BerdamaiDenganPikiran"
          component={BerdamaiDenganPikiran}
        />
        <Stack.Screen name="Pertanyaan1" component={Pertanyaan1} />
        <Stack.Screen name="KelolaAkun" component={KelolaAkun} />
        <Stack.Screen name="GantiPassword" component={GantiPassword} />
        <Stack.Screen name="HapusAkun" component={HapusAkun} />
        <Stack.Screen name="AkunPersonal" component={AkunPersonal} />
        <Stack.Screen name="MoodSummary" component={MoodSummary} />
        <Stack.Screen name="MoodTracker" component={MoodTracker} />
        <Stack.Screen name="NextScreen" component={NextScreen} />
        <Stack.Screen name="Jurnal1" component={Jurnal1} />
        <Stack.Screen name="DetailAkun" component={DetailAkun} />
        <Stack.Screen name="TambahAkun" component={TambahAkun} />

        {/* ✅ Ini yang penting */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
