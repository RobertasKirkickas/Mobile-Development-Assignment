import React, { useState, useEffect, useCallback, memo } from 'react';
import { StyleSheet, View, ActivityIndicator, FlatList, Image, Pressable, Text, ScrollView } from 'react-native';
import Header from '../components/Header';
import NoImage from '../media/images/no-img.jpg';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Science-Fiction', 'Thriller'];

// Memoized component to prevent unnecessary re-renders
const ShowCard = memo(({ item, onPress, NoImage }) => {
	return (
		<Pressable style={styles.resultImageTouchable} onPress={() => onPress(item.id)}>
			<Image style={styles.resultImage} resizeMode='cover' source={item.image ? { uri: item.image.original || item.image.medium } : NoImage} />
		</Pressable>
	);
});

export default function ShowsScreen({ navigation }) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedGenre, setSelectedGenre] = useState('');
	const [allShows, setAllShows] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const numberOfColumns = 2;

	// Use useCallback to keep the function reference stable
	const handlePress = useCallback(
		(showId) => {
			navigation.navigate('Show Details', { showId });
		},
		[navigation],
	);

	const renderItem = useCallback(({ item }) => <ShowCard item={item} onPress={handlePress} NoImage={NoImage} />, [handlePress]);

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

	// Filter shows based on search query and selected genre
	const dataToDisplay = (searchQuery.trim() ? searchResults : allShows).filter((show) => {
		if (!selectedGenre) return true;
		return show.genres?.includes(selectedGenre);
	});

	const GenreList = () => (
		<View>
			<Text style={styles.sectionHeader}>{selectedGenre ? selectedGenre : searchQuery.trim() ? `Search results for '${searchQuery}'` : 'Browse All Shows'}</Text>

			<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreContainer}>
				{/* Resets selection */}
				<Pressable onPress={() => setSelectedGenre('')} style={[styles.genreButton, !selectedGenre && styles.activeButton]}>
					<Text style={styles.genreText}>All</Text>
				</Pressable>

				{GENRES.map((genre) => (
					<Pressable key={genre} onPress={() => setSelectedGenre(genre)} style={[styles.genreButton, selectedGenre === genre && styles.activeButton]}>
						<Text style={styles.genreText}>{genre}</Text>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);

	return (
		<View style={styles.ShowsScreen}>
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} />

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size='large' color='#1DB954' />
				</View>
			) : (
				<View style={styles.resultsContainer}>
					<FlatList
						ListHeaderComponent={<GenreList />}
						key={`shows-grid-${numberOfColumns}`}
						data={dataToDisplay}
						numColumns={numberOfColumns}
						keyExtractor={(item) => item.id.toString()}
						contentContainerStyle={styles.listPadding}
						renderItem={renderItem}
						removeClippedSubviews={true} // Unmounts components off-screen
						initialNumToRender={10} // Render 10 items initially
						maxToRenderPerBatch={10} // Render 10 items per scroll
						windowSize={5} // Keep only 5 pages of data in memory
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	ShowsScreen: {
		flex: 1,
	},
	resultsContainer: {
		flex: 1,
	},
	sectionHeader: {
		color: '#fff',
		fontSize: 26,
		fontWeight: '900',
		marginLeft: 15,
		marginBottom: 15,
	},
	listPadding: {
		paddingHorizontal: 10,
		paddingBottom: 100,
		paddingTop: 110,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	resultImage: {
		flex: 1,
		width: '100%',
		height: 250,
		borderRadius: 10,
		backgroundColor: '#1a1a1a',
	},
	resultImageTouchable: {
		flex: 1,
		margin: 8,
	},
	genreContainer: {
		marginBottom: 20,
		paddingLeft: 10,
	},
	genreButton: {
		backgroundColor: '#1a1a1a',
		paddingHorizontal: 18,
		paddingVertical: 10,
		borderRadius: 25,
		marginRight: 10,
		borderWidth: 1,
		borderColor: '#333',
	},
	activeButton: {
		borderColor: '#1DB954',
		backgroundColor: 'rgba(29, 185, 84, 0.1)',
	},
	genreText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: 'bold',
	},
});
