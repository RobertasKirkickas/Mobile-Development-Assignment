import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ShowsScreen from '../../screens/Shows';
import ShowDetailsScreen from '../../screens/ShowDetails';
import ActorDetailsScreen from '../../screens/ActorDetails';

export default function ShowsNavigator() {
	const Stack = createStackNavigator();
	return (
		<Stack.Navigator style={styles.ShowsNavigator}>
			<Stack.Screen name='Shows Screen' component={ShowsScreen} options={{ headerShown: false }} />
			<Stack.Screen name='Show Details' component={ShowDetailsScreen} />
			<Stack.Screen name='Actor Details' component={ActorDetailsScreen} />
		</Stack.Navigator>
	);
}
const styles = StyleSheet.create({
	ShowsNavigator: {
		/* Styles here */
	},
});
