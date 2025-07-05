// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SafeAreaView, StyleSheet } from "react-native";
// Screens
import SplashScreen from "./screens/Start/Splash";
import OnboardingScreen from "./screens/Start/OnBoarding";
// import Login from "./screens/Login/Login";
import Daftar from "./screens/Login/Daftar";
import Setting from "./screens/profil/Setting";
import MainTabs from "./screens/Start/MainTabs";
import KenaliDiriScreen from "./screens/home/KenaliDiri";
import BerdamaiDenganPikiran from "./screens/home/DetailTopik/BerdamaiDenganPikiran";
import MotivasiScreen from "./screens/home/Motivasi/Motivasi";
import AddMotivasiScreen from "./screens/home/Motivasi/AddMotivasi";
import UpdateMotivasiScreen from "./screens/home/Motivasi/UpdateMotivasi";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* ✅ Tambahkan ini */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
          {/* <Stack.Screen name="Login" component={Login} /> */}
          <Stack.Screen name="Daftar" component={Daftar} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="KenaliDiriScreen" component={KenaliDiriScreen} />
          <Stack.Screen
            name="BerdamaiDenganPikiran"
            component={BerdamaiDenganPikiran}
          />
          <Stack.Screen name="MotivasiScreen" component={MotivasiScreen} />
          <Stack.Screen name="AddMotivasi" component={AddMotivasiScreen} />
          <Stack.Screen name="UpdateMotivasi" component={UpdateMotivasiScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    color: "#ffffff",
    flex: 1,
  },
});
