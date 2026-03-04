import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, Pressable, Text } from 'react-native';
import Header from '../components/Header';

export default function ShowsScreen({ navigation }) {
	const [searchQuery, setSearchQuery] = useState('');
	const [allShows, setAllShows] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const numberOfColumns = 2;

	useEffect(() => {
		const getTheShows = async () => {
			try {
				// Fetch the list of shows
				const response = await fetch('https://api.tvmaze.com/shows');
				const shows = await response.json();
				setAllShows(shows); // Set the array of shows in the state
				setLoading(false);
			} catch (error) {
				console.error('Error while fetching:', error);
				setLoading(false);
			}
		};
		getTheShows();
	}, []); // Runs the function when the page loads

	// Determine which data to show in the grid
	const dataToDisplay = searchQuery.trim() ? searchResults : allShows;

	return (
		<View style={styles.ShowsScreen}>
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} />

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color='#1DB954' />
				</View>
			) : (
				<View style={styles.resultsContainer}>
					<Text style={styles.sectionHeader}>{searchQuery.trim() ? `Results for "${searchQuery}"` : 'Browse All Shows'}</Text>

					<FlatList
						key={`shows-grid-${numberOfColumns}`}
						data={dataToDisplay}
						numColumns={numberOfColumns}
						keyExtractor={(item) => item.id.toString()}
						contentContainerStyle={styles.listPadding}
						renderItem={({ item }) => (
							<Pressable style={styles.resultImageTouchable} onPress={() => navigation.navigate('Show Details', { showId: item.id })}>
								<Image style={styles.resultImage} source={{ uri: item.image?.medium || item.image?.original }} />
							</Pressable>
						)}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	ShowsScreen: {
		flex: 1,
		backgroundColor: '#000',
	},
	resultsContainer: {
		flex: 1,
		marginTop: 110,
	},
	sectionHeader: {
		color: '#fff',
		fontSize: 20,
		fontWeight: 'bold',
		marginLeft: 18,
		marginBottom: 10,
	},
	listPadding: {
		paddingHorizontal: 10,
		paddingBottom: 100,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	resultImage: {
		flex: 1,
		height: 250,
		borderRadius: 10,
		backgroundColor: '#1a1a1a',
	},
	resultImageTouchable: {
		flex: 1,
		margin: 8,
	},
});
