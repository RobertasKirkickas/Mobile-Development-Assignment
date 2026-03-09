import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigators
import HomeNavigator from './src/components/navigators/Home';
import ShowsNavigator from './src/components/navigators/Shows';
import ActorsNavigator from './src/components/navigators/Actors';

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer theme={BgTheme}>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;
							if (route.name === 'Home') {
								iconName = focused ? 'home' : 'home-outline';
							} else if (route.name === 'Shows') {
								iconName = focused ? 'play-circle' : 'play-circle-outline';
							} else if (route.name === 'Actors') {
								iconName = focused ? 'people' : 'people-outline';
							}
							return <Ionicons name={iconName} size={size} color={color} />;
						},
						tabBarActiveTintColor: '#1DB954',
						tabBarInactiveTintColor: '#888888',
						tabBarStyle: {
							backgroundColor: '#121212',
							borderTopWidth: 0,
							height: 60,
							paddingBottom: 10,
						},
						headerShown: false,
					})}
				>
					<Tab.Screen name='Home' component={HomeNavigator} />
					<Tab.Screen name='Shows' component={ShowsNavigator} />
					<Tab.Screen name='Actors' component={ActorsNavigator} />
				</Tab.Navigator>
				<StatusBar style='light' />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const BgTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: '#000000',
		card: '#121212',
		text: '#ffffff',
		primary: '#ffffff',
	},
};
