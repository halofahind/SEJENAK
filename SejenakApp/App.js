import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Feather";
import CustomTabBar from "./components/CurvedBottomTab";
import Home from "./screens/home/Home";
import Jurnalku from "./screens/jurnalku/Jurnalku";
import Konseling from "./screens/konseling/Konseling";
import Profil from "./screens/profil/Profil";
import Login from "./screens/Login/Login";
import Daftar from "./screens/Login/Daftar";
import Setting from "./screens/profil/Setting";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
              name="user"
              size={24}
              color={focused ? "#D84059" : "#aaa"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Daftar" component={Daftar} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
