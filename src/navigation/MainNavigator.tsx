import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BookingsIcon, HomeIcon, ProfileIcon, TripsIcon, WalletIcon } from "../components/NavIcons";
import { BankDetailsScreen } from "../screens/main/BankDetailsScreen";
import { ChatWithSupportScreen } from "../screens/main/ChatWithSupportScreen";
import { ContactUsScreen } from "../screens/main/ContactUsScreen";
import { CreateTripScreen } from "../screens/main/CreateTripScreen";
import { EarningsScreen } from "../screens/main/EarningsScreen";
import { EmergencyContactsScreen } from "../screens/main/EmergencyContactsScreen";
import { FAQsScreen } from "../screens/main/FAQsScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { NotificationsScreen } from "../screens/main/NotificationsScreen";
import { PassengerRequestsScreen } from "../screens/main/PassengerRequestsScreen";
import { PreferencesScreen } from "../screens/main/PreferencesScreen";
import { ProfileDetailsScreen } from "../screens/main/ProfileDetailsScreen";
import { ReferralsScreen } from "../screens/main/ReferralsScreen";
import { ReportProblemScreen } from "../screens/main/ReportProblemScreen";
import { SettingsScreen } from "../screens/main/SettingsScreen";
import { TwoFactorAuthScreen } from "../screens/main/TwoFactorAuthScreen";
import { VehiclesScreen } from "../screens/main/VehiclesScreen";
import { colors } from "../theme/colors";
import { MainStackParamList, MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#1C398E",
      tabBarInactiveTintColor: "#868C98",
      tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopColor: "#E2E8F0",
        paddingTop: 8,
        paddingBottom: 12,
        height: 82,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 2,
      },
      tabBarIcon: ({ focused }) => {
        if (route.name === "HomeTab") {
          return <HomeIcon focused={focused} size={24} />;
        } else if (route.name === "TripsTab") {
          return <TripsIcon focused={focused} size={24} />;
        } else if (route.name === "BookingsTab") {
          return <BookingsIcon focused={focused} size={24} />;
        } else if (route.name === "WalletTab") {
          return <WalletIcon focused={focused} size={24} />;
        } else if (route.name === "ProfileTab") {
          return <ProfileIcon focused={focused} size={24} />;
        }
        return <HomeIcon focused={focused} size={24} />;
      },
    })}
  >
    <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
    <Tab.Screen name="TripsTab" component={CreateTripScreen} options={{ tabBarLabel: "Trips" }} />
    <Tab.Screen name="BookingsTab" component={PassengerRequestsScreen} options={{ tabBarLabel: "Bookings" }} />
    <Tab.Screen name="WalletTab" component={EarningsScreen} options={{ tabBarLabel: "Wallet" }} />
    <Tab.Screen name="ProfileTab" component={SettingsScreen} options={{ tabBarLabel: "Profile" }} />
  </Tab.Navigator>
);

export const MainNavigator = () => (
  <Stack.Navigator
    initialRouteName="MainTabs"
    screenOptions={{
      headerTintColor: colors.primary,
      headerTitleStyle: { fontWeight: "700", color: colors.text },
      headerBackTitle: "Back",
    }}
  >
    <Stack.Screen
      name="MainTabs"
      component={MainTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProfileDetails"
      component={ProfileDetailsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EmergencyContacts"
      component={EmergencyContactsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ReportProblem"
      component={ReportProblemScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TwoFactorAuth"
      component={TwoFactorAuthScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ContactUs"
      component={ContactUsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ChatWithSupport"
      component={ChatWithSupportScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Vehicles"
      component={VehiclesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="BankDetails"
      component={BankDetailsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Preferences"
      component={PreferencesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Referrals"
      component={ReferralsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="FAQs"
      component={FAQsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateTrip"
      component={CreateTripScreen}
      options={{ title: "Post a Trip" }}
    />
    <Stack.Screen
      name="PassengerRequests"
      component={PassengerRequestsScreen}
      options={{ title: "Ride Requests" }}
    />
    <Stack.Screen
      name="Earnings"
      component={EarningsScreen}
      options={{ title: "Earnings & Payouts" }}
    />
  </Stack.Navigator>
);
