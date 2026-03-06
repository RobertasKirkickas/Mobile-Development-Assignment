import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ActorsScreen from '../../screens/Actors';
import ActorDetailsScreen from '../../screens/ActorDetails';
import ShowDetailsScreen from '../../screens/ShowDetails';

export default function ActorsNavigator() {
	const Stack = createStackNavigator();
	return (
		<Stack.Navigator style={styles.ActorsNavigator}>
			<Stack.Screen name='Actors Screen' component={ActorsScreen} options={{ headerShown: false }} />
			<Stack.Screen name='Actor Details' component={ActorDetailsScreen} />
			<Stack.Screen name='Show Details' component={ShowDetailsScreen} />
		</Stack.Navigator>
	);
}
const styles = StyleSheet.create({
	ActorsNavigator: {
		/* Styles here */
	},
});
