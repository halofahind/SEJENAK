// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Feather";
import { SafeAreaView, StyleSheet } from "react-native";
// Screens
import SplashScreen from "./screens/Start/Splash";
import OnboardingScreen from "./screens/Start/OnBoarding";
import Login from "./screens/Login/Login";
import Daftar from "./screens/Login/Daftar";
import Setting from "./screens/profil/Setting";
import KenaliDiriScreen from "./screens/home/KenaliDiri";
import BerdamaiDenganPikiran from "./screens/home/DetailTopik/BerdamaiDenganPikiran";
import MainTabs from "./screens/Start/MainTabs";

import CustomTabBar from "./components/CurvedBottomTab";
import DetailKonseling from "./screens/konseling/DetailKonseling";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="DetailKonseling" component={DetailKonseling} />
          <Stack.Screen name="Daftar" component={Daftar} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="KenaliDiriScreen" component={KenaliDiriScreen} />
          <Stack.Screen
            name="BerdamaiDenganPikiran"
            component={BerdamaiDenganPikiran}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    color: "#ffffff",
    flex: 1,
  },
});
