import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Navigators
import HomeNavigator from './src/components/navigators/Home';
import ShowsNavigator from './src/components/navigators/Shows';

// Placeholder for search
const SearchPlaceholder = () => <View style={{ flex: 1, backgroundColor: '#000' }} />;

const Tab = createBottomTabNavigator();

const BgTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#121212',
    text: '#ffffff',
    primary: '#ffffff', // Color of the active icon
  },
};

export default function App() {
  return (
    <NavigationContainer theme={BgTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // This function determines which icon to show for each tab
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Shows') {
              iconName = focused ? 'play-circle' : 'play-circle-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1DB954',
          tabBarInactiveTintColor: '#888888',
		  paddingBottom: 10,
          tabBarStyle: {
            backgroundColor: '#121212', // Navbar background color
            borderTopWidth: 0,          
            height: 60,
            paddingBottom: 10,
          },
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#ffffff',
        })}
      >
        <Tab.Screen name="Home" component={HomeNavigator} />
        <Tab.Screen name="Shows" component={ShowsNavigator} />
        <Tab.Screen name="Search" component={SearchPlaceholder} />
      </Tab.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}