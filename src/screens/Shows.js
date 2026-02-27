import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Pressable } from 'react-native';
import SearchForm from '../components/SearchForm';

export default function ShowsScreen({ navigation }) {
	const [searchQuery, setSearchQuery] = useState('');
	const numberOfColumns = 2;
	const [allShows, setAllShows] = useState([]);
	const [searchResults, setSearchResults] = useState([]);

	useEffect(() => {
		const getTheShows = async () => {
			try {
				// Fetch the list of shows
				const response = await fetch('https://api.tvmaze.com/shows');
				const shows = await response.json();

				// Set the array of shows in the state
				setAllShows(shows);
			} catch (error) {
				console.error('Error while fetching:', error); // If error, then output to console
			}
		};

		getTheShows();
	}, []); // Runs the function when the page loads

	return (
		<View style={styles.ShowsScreen}>
			<SearchForm searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} />
			{(searchQuery.trim() ? searchResults : allShows) && (searchQuery.trim() ? searchResults : allShows).length > 0 ? (
				<View style={styles.resultsContainer}>
					<FlatList
						key={`shows-columns-${numberOfColumns}`}
						data={searchQuery.trim() ? searchResults : allShows}
						numColumns={numberOfColumns}
						style={{ margin: 10, marginBottom: 100 }}
						renderItem={({ item }) => (
							<Pressable
								style={styles.resultImageTouchable}
								onPress={() => {
									navigation.navigate('Show Details', {
										showId: item.id,
									});
								}}
							>
								<Image style={styles.resultImage} source={{ uri: item.image?.medium || item.image?.original }} />
							</Pressable>
						)}
					/>
				</View>
			) : (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color='#000' />
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	ShowsScreen: {
		/* styles here */
	},
	loadingContainer: {
		height: '100%',
		justifyContent: 'center',
	},
	resultImage: {
		flex: 1,
		height: 200,
	},
	resultImageTouchable: {
		flex: 1,
		margin: 10,
		height: 200,
	},
});
