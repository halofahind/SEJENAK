// utils/SessionManager.js
import { AppState, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

let timeoutTimer = null;
let appStateListener = null;

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 menit

const SessionManager = {
  start(navigation) {
    clearTimeout(timeoutTimer);

    const handleTimeout = async () => {
      Alert.alert("Sesi Berakhir", "Silakan login kembali.");
      await AsyncStorage.removeItem("userData");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    };

    const resetTimer = () => {
      clearTimeout(timeoutTimer);
      timeoutTimer = setTimeout(handleTimeout, SESSION_TIMEOUT);
    };

    resetTimer(); // mulai timer pertama

    appStateListener = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background") {
        resetTimer();
      }
    });
  },

  stop() {
    clearTimeout(timeoutTimer);
    if (appStateListener) appStateListener.remove();
  },
};

export default SessionManager;
