// App.js
import React, { useEffect } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Notifikasi
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Screens - Start
import SplashScreen from "./screens/Start/Splash";
import OnboardingScreen from "./screens/Start/OnBoarding";
import MainTabs from "./screens/Start/MainTabs";

// Screens - Login & Profil
import Login from "./screens/Login/Login";
import Daftar from "./screens/Login/Daftar";
import Setting from "./screens/profil/Setting";
import KelolaAkun from "./screens/profil/AkunSetting/KelolaAkun";
import GantiPassword from "./screens/profil/AkunSetting/GantiPassword";
import HapusAkun from "./screens/profil/AkunSetting/HapusAkun";
import AkunPersonal from "./screens/profil/AkunSetting/AkunPersonal";
import DetailAkun from "./screens/profil/Detail/DetailAkun";
import TambahAkun from "./screens/profil/TambahAkun";
import NotifikasiScreen from "./screens/home/NotifikasiScreen";

// Screens - Home
import BerdamaiDenganPikiran from "./screens/home/DetailTopik/BerdamaiDenganPikiran";
import MotivasiScreen from "./screens/home/Motivasi/Motivasi";
import AddMotivasiScreen from "./screens/home/Motivasi/AddMotivasi";
import UpdateMotivasiScreen from "./screens/home/Motivasi/UpdateMotivasi";
import Pertanyaan1 from "./screens/home/Pertanyaan/Pertanyaan1";
import MoodSummary from "./screens/home/Mood/DetailMood/MoodSummary";
import MoodTracker from "./screens/home/Mood/MoodTracker";
import NextScreen from "./screens/home/Mood/NextScreen";
import Jurnal1 from "./screens/home/JurnalSelesai/Jurnal1";

// Screens - Konseling
import Konseling from "./screens/konseling/Konseling";
import DetailKonseling from "./screens/konseling/DetailKonseling";
import Topik from "./screens/konseling/Topik";
import TopikList from "./screens/konseling/TopikList";
import TopikForm from "./screens/konseling/TopikForm";

// Screens - Jurnalku
import DaftarJurnal from "./screens/jurnalku/DaftarJurnal";

// Stack navigator
const Stack = createNativeStackNavigator();

// Notifikasi Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    await registerForPushNotificationsAsync();
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Ingatkan Jurnal Harian",
        body: "Yuk, isi jurnal harianmu sekarang!",
      },
      trigger: {
        seconds: 3600,
        repeats: true,
      },
    });
  };

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Gagal mendapatkan izin notifikasi!");
      }
    } else {
      Alert.alert("Notifikasi hanya bisa di perangkat fisik.");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          {/* Start */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="OnBoarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Daftar" component={Daftar} />
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* Home */}
          <Stack.Screen
            name="BerdamaiDenganPikiran"
            component={BerdamaiDenganPikiran}
          />
          <Stack.Screen name="MotivasiScreen" component={MotivasiScreen} />
          <Stack.Screen name="AddMotivasi" component={AddMotivasiScreen} />
          <Stack.Screen
            name="UpdateMotivasi"
            component={UpdateMotivasiScreen}
          />
          <Stack.Screen name="Pertanyaan1" component={Pertanyaan1} />
          <Stack.Screen name="MoodSummary" component={MoodSummary} />
          <Stack.Screen name="MoodTracker" component={MoodTracker} />
          <Stack.Screen name="NextScreen" component={NextScreen} />
          <Stack.Screen name="Jurnal1" component={Jurnal1} />
          <Stack.Screen name="NotifikasiScreen" component={NotifikasiScreen} />

          {/* Konseling */}
          <Stack.Screen name="Konseling" component={Konseling} />
          <Stack.Screen name="DetailKonseling" component={DetailKonseling} />
          <Stack.Screen name="Topik" component={Topik} />
          <Stack.Screen name="TopikList" component={TopikList} />
          <Stack.Screen name="TopikForm" component={TopikForm} />

          {/* Profil */}
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="KelolaAkun" component={KelolaAkun} />
          <Stack.Screen name="GantiPassword" component={GantiPassword} />
          <Stack.Screen name="HapusAkun" component={HapusAkun} />
          <Stack.Screen name="AkunPersonal" component={AkunPersonal} />
          <Stack.Screen name="DetailAkun" component={DetailAkun} />
          <Stack.Screen name="TambahAkun" component={TambahAkun} />

          {/* Jurnal */}
          <Stack.Screen name="DaftarJurnal" component={DaftarJurnal} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#ffffff",
  },
});
