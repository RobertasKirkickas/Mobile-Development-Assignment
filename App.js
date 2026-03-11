import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

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
							return <Ionicons name={iconName} size={30} color={color} />;
						},

						tabBarActiveTintColor: '#1DB954',
						tabBarInactiveTintColor: '#ffffff',

						tabBarBackground: () => (
							<View style={{ flex: 1, overflow: 'hidden' }}>
								{Platform.OS === 'ios' ? (
									// iOS - blur effect
									<BlurView tint='dark' intensity={80} style={StyleSheet.absoluteFill} />
								) : (
									// Android - semi-transparent view
									<View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20, 20, 20, 0.95)' }]} />
								)}
							</View>
						),
						tabBarStyle: {
							backgroundColor: 'transparent',
							borderTopWidth: 0,
							position: 'absolute',
							elevation: 0,

							// If Android height of tab navbar (85), for iOS/other 70
							height: Platform.OS === 'android' ? 85 : 70,
							paddingBottom: Platform.OS === 'android' ? 15 : 10,

							// Subtle border on Android to separate tab bar from content
							borderTopColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
							borderTopWidth: Platform.OS === 'android' ? 0.5 : 0,
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
		background: '#1A1A1A',
		card: '#1A1A1A',
		text: '#ffffff',
		primary: '#1DB954',
	},
};
