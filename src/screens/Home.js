import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import Header from '../components/Header';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const ITEM_SPACING = 10;
const FULL_ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING * 2;

const Home = ({ navigation }) => {
	const [featuredShows, setFeaturedShows] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const numberOfColumns = 2;

	useEffect(() => {
		fetch('https://api.tvmaze.com/shows')
			.then((res) => res.json())
			.then((data) => setFeaturedShows(data.slice(0, 10)));
	}, []);

	return (
		<View style={styles.container}>
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} />

			{searchQuery.length > 0 ? (
				// Search results view
				<View style={styles.resultsContainer}>
					<Text style={styles.header}>Results for "{searchQuery}"</Text>
					{searchLoading ? (
						<ActivityIndicator color='#1DB954' size='large' style={{ marginTop: 20 }} />
					) : (
						<FlatList
							key={`search-columns-${numberOfColumns}`}
							data={searchResults}
							numColumns={numberOfColumns}
							keyExtractor={(item) => item.id.toString()}
							contentContainerStyle={styles.listPadding}
							renderItem={({ item }) => (
								<Pressable style={styles.resultImageTouchable} onPress={() => navigation.navigate('Show Details', { showId: item.id })}>
									<Image style={styles.resultImage} source={{ uri: item.image?.original || item.image?.medium }} />
								</Pressable>
							)}
						/>
					)}
				</View>
			) : (
				// Normal home view
				<>
					<Text style={styles.header}>Featured Today</Text>
					<FlatList
						data={featuredShows}
						renderItem={({ item }) => (
							<Pressable onPress={() => navigation.navigate('Show Details', { showId: item.id })} style={styles.cardContainer}>
								<View style={styles.card}>
									<Image source={{ uri: item.image?.original || item.image?.medium }} style={styles.image} />
									<View style={styles.info}>
										<Text style={styles.title} numberOfLines={1}>
											{item.name}
										</Text>
										<Text style={styles.rating}>⭐ {item.rating?.average || 'N/A'}</Text>
									</View>
								</View>
							</Pressable>
						)}
						keyExtractor={(item) => item.id.toString()}
						horizontal={true}
						snapToInterval={FULL_ITEM_SIZE}
						decelerationRate='fast'
						snapToAlignment='center'
						contentContainerStyle={styles.listContent}
					/>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#000' },
	header: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
		marginLeft: 20,
		marginBottom: 15,
		marginTop: 110,
	},
	listContent: { paddingHorizontal: (width - FULL_ITEM_SIZE) / 2 },
	cardContainer: { width: FULL_ITEM_SIZE, paddingHorizontal: ITEM_SPACING },
	card: { backgroundColor: '#1e1e1e', borderRadius: 20, overflow: 'hidden', height: 350 },
	image: { width: '100%', height: '80%', resizeMode: 'cover' },
	info: { padding: 12 },
	title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
	rating: { color: '#aaa', fontSize: 14, marginTop: 4 },

	resultsContainer: { flex: 1 },
	listPadding: { paddingHorizontal: 10, paddingBottom: 100 },
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

export default Home;
