import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ValuationScreen from "../screens/ValuationScreen";
import MapScreen from "../screens/MapScreen";
import RiskScreen from "../screens/RiskScreen";
import FraudScreen from "../screens/FraudScreen";
import ReportScreen from "../screens/ReportScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "#1a237e" }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Valuation" component={ValuationScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Risk" component={RiskScreen} />
      <Tab.Screen name="Reports" component={ReportScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#1a237e" }, headerTintColor: "#fff" }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Fraud" component={FraudScreen} />
    </Stack.Navigator>
  );
}
