import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from "../../components/CurvedBottomTab";
import Home from "../home/Home";
import Jurnalku from "../jurnalku/Jurnalku";
import Konseling from "../konseling/Konseling";
import Profil from "../profil/Profil";
import { useTranslation } from "react-i18next";
import "../../locales/i18n";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { t, i18n } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name={t("MainTabsHome")}
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
        name={t("MainTabsJournal")}
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
        name={t("MainTabsCounseling")}
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
        name={t("MainTabsProfil")}
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
