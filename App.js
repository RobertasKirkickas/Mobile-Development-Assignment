import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeNavigator from './src/components/navigators/Home';
import ShowsNavigator from './src/components/navigators/Shows';

export default function App() {
	const Drawer = createDrawerNavigator();
	return (
		<NavigationContainer style={styles.container}>
			<Drawer.Navigator>
				<Drawer.Screen name='Home' component={HomeNavigator} options={{ title: 'Home' }} />
				<Drawer.Screen name='Shows' component={ShowsNavigator} options={{ title: 'Shows' }} />
			</Drawer.Navigator>
			<StatusBar style='auto' hidden={true} />
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {},
});
