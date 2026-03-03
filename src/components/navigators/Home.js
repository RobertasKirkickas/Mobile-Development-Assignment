import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/Home';
import ShowsScreen from '../../screens/Shows';
import ShowDetailsScreen from '../../screens/ShowDetails';

export default function HomeNavigator() {
	const Stack = createStackNavigator();

	return (
		<Stack.Navigator style={styles.HomeNavigator}>
			<Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false }} />
			<Stack.Screen name='ShowsScreen' component={ShowsScreen} options={{ headerShown: false }} />
			<Stack.Screen name='Show Details' component={ShowDetailsScreen}/>
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	HomeNavigator: {
		/* Styles here */
	},
});
