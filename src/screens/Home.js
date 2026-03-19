import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import NoImage from '../media/images/no-img.jpg';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const ITEM_SPACING = 10;
const FULL_ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING * 2;

const Home = ({ navigation }) => {
	const [featuredShows, setFeaturedShows] = useState([]);
	const [moreShows, setMoreShows] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const numberOfColumns = 2;

	// Greeting based on time of day
	const getGreeting = () => {
		const hours = new Date().getHours();
		if (hours < 12) return 'Good Morning';
		if (hours < 18) return 'Good Afternoon';
		return 'Good Evening';
	};

	useEffect(() => {
		fetch('https://api.tvmaze.com/shows')
			.then((res) => res.json())
			.then((data) => {
				// Shuffle the whole list
				const shuffled = data.sort(() => Math.random() - 0.5);

				// Pick the first 10 for featured (carousel)
				setFeaturedShows(shuffled.slice(0, 10));

				// Pick the next 20 for the "More for You" section
				setMoreShows(shuffled.slice(10, 31));
			})
			.catch((err) => console.error('Fetch error:', err));
	}, []);

	const renderSearchItem = ({ item }) => (
		<Pressable style={styles.resultImageTouchable} onPress={() => navigation.navigate('Show Details', { showId: item.id })}>
			<Image style={styles.resultImage} source={item.image ? { uri: item.image.original || item.image.medium } : NoImage} />
		</Pressable>
	);

	const renderFeaturedItem = ({ item }) => (
		<Pressable onPress={() => navigation.navigate('Show Details', { showId: item.id })} style={styles.cardContainer}>
			<View style={styles.card}>
				<Image style={styles.image} source={item.image ? { uri: item.image.original || item.image.medium } : NoImage} />
				<LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)']} locations={[0.6, 0.8, 1]} style={StyleSheet.absoluteFill} />
				<View style={styles.info}>
					<View style={styles.genreBadge}>
						<Text style={styles.genreBadgeText}>{item.genres?.[0] || 'Must Watch'}</Text>
					</View>
					<Text style={styles.title} numberOfLines={1}>
						{item.name}
					</Text>

					<Text style={styles.rating}>⭐ {item.rating?.average || 'N/A'}</Text>
				</View>
			</View>
		</Pressable>
	);

	const renderMoreShowItem = ({ item }) => (
		<Pressable style={styles.moreShowsItem} onPress={() => navigation.navigate('Show Details', { showId: item.id })}>
			<Image source={item.image ? { uri: item.image.original || item.image.medium } : NoImage} style={styles.moreShowsImage} />
		</Pressable>
	);

	return (
		<View style={styles.container}>
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} />

			{searchQuery.length > 0 ? (
				searchLoading ? (
					<View style={styles.loadingContainer}>
						<Text style={styles.header}>Results for "{searchQuery}"</Text>
						<ActivityIndicator color='#1DB954' size='large' style={{ marginTop: 20 }} />
					</View>
				) : (
					<FlatList
						key={`search-columns-${numberOfColumns}`}
						data={searchResults}
						numColumns={numberOfColumns}
						keyExtractor={(item) => item.id.toString()}
						renderItem={renderSearchItem}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.listPadding}
						ListHeaderComponent={<Text style={styles.header}>Results for "{searchQuery}"</Text>}
					/>
				)
			) : (
				<FlatList
					data={moreShows}
					numColumns={3}
					key='more-shows-columns-3'
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderMoreShowItem}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.moreShowsListPadding}
					columnWrapperStyle={styles.moreShowsColumn}
					ListHeaderComponent={
						<>
							<View style={styles.welcomeSection}>
								<Text style={styles.greetingText}>{getGreeting()},</Text>
								<Text style={styles.subGreetingText}>What are we discovering today?</Text>
							</View>
							<Text style={styles.header}>Featured Today</Text>
							<FlatList
								data={featuredShows}
								renderItem={renderFeaturedItem}
								keyExtractor={(item) => item.id.toString()}
								horizontal={true}
								snapToInterval={FULL_ITEM_SIZE}
								decelerationRate='fast'
								snapToAlignment='center'
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={styles.listContent}
							/>
							<Text style={styles.header}>More for You</Text>
						</>
					}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
		marginLeft: 20,
		marginBottom: 15,
		marginTop: 30,
	},
	welcomeSection: {
		marginTop: 120,
		marginLeft: 20,
		marginBottom: 10,
	},
	greetingText: {
		color: '#fff',
		fontSize: 28,
		fontWeight: '900',
		letterSpacing: -0.5,
	},
	subGreetingText: {
		color: '#888',
		fontSize: 16,
		fontWeight: '500',
		marginTop: 2,
	},
	genreBadge: {
		backgroundColor: '#E50914',
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 5,
		alignSelf: 'flex-start',
		marginBottom: 8,
	},
	genreBadgeText: {
		color: '#fff',
		fontSize: 10,
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},

	// Featured shows styles
	listContent: {
		paddingHorizontal: (width - FULL_ITEM_SIZE) / 2 - 50,
	},
	cardContainer: {
		width: FULL_ITEM_SIZE,
		paddingHorizontal: ITEM_SPACING,
	},
	card: {
		backgroundColor: '#1e1e1e',
		borderRadius: 20,
		overflow: 'hidden',
		height: 400,
	},
	image: {
		...StyleSheet.absoluteFillObject,
		resizeMode: 'cover',
	},
	info: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		right: 20,
	},
	title: {
		color: '#fff',
		fontSize: 20,
		fontWeight: 'bold',
	},
	rating: {
		color: '#1DB954',
		fontSize: 14,
		fontWeight: 'bold',
		marginTop: 4,
	},

	// More for You Styles
	moreShowsListPadding: {
		paddingHorizontal: 10,
		paddingBottom: 100,
	},
	moreShowsColumn: {
		justifyContent: 'space-between',
	},
	moreShowsItem: {
		width: '31%',
		marginBottom: 20,
		alignItems: 'center',
	},
	moreShowsImage: {
		width: '100%',
		height: 150,
		borderRadius: 10,
		backgroundColor: '#1a1a1a',
	},

	// Search results styles
	loadingContainer: {
		flex: 1,
	},
	listPadding: {
		paddingHorizontal: 10,
		paddingBottom: 100,
		paddingTop: 100,
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
});

export default Home;
