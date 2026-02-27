import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function HomeScreen({ navigation }) {
	return (
		<View style={styles.HomeScreen}>
			<Pressable onPress={() => navigation.navigate('Shows')}>
				<Text>Shows</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	HomeScreen: {
		padding: 20,
	},
});
