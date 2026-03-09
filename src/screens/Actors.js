import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import Header from '../components/Header';
import NoPhoto from '../media/images/no-photo.jpeg';

export default function ActorsScreen({ navigation }) {
	const [actors, setActors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	useEffect(() => {
		fetch('https://api.tvmaze.com/people?page=1')
			.then((res) => res.json())
			.then((data) => {
				// Shuffle the whole list
				const shuffled = data.sort(() => Math.random() - 0.5);

				setActors(shuffled.slice(0, 30)); // Random actor selection for Popular Actors section
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	const renderActor = ({ item }) => (
		<Pressable style={styles.actorCard} onPress={() => navigation.navigate('Actor Details', { actorId: item.id })}>
			<Image source={item.image ? { uri: item.image.original || item.image.medium } : NoPhoto} style={styles.avatar} />
			<Text style={styles.actorName} numberOfLines={1}>
				{item.name}
			</Text>
		</Pressable>
	);

	return (
		<View style={styles.container}>
			<Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} searchType='people' />

			<View style={styles.content}>
				{loading ? (
					<ActivityIndicator color='#1DB954' size='large' />
				) : (
					<FlatList
						// Switches data based on whether there is a search query
						ListHeaderComponent={<Text style={styles.title}>{searchQuery.trim() ? `Results for "${searchQuery}"` : 'Popular Actors'}</Text>}
						data={searchQuery.trim() ? searchResults : actors}
						renderItem={renderActor}
						keyExtractor={(item) => item.id.toString()}
						numColumns={3}
						contentContainerStyle={styles.list}
					/>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
	},
	title: {
		color: '#fff',
		fontSize: 22,
		fontWeight: 'bold',
		marginLeft: 20,
		marginBottom: 20,
	},
	list: {
		paddingHorizontal: 10,
		paddingBottom: 100,
		paddingTop: 110,
	},
	actorCard: {
		flex: 1,
		alignItems: 'center',
		marginBottom: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: '#1a1a1a',
	},
	actorName: {
		color: '#fff',
		marginTop: 8,
		fontSize: 14,
		textAlign: 'center',
	},
});
