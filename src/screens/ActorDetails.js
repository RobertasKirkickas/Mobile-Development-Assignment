import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ActorDetailsScreen({ route, navigation }) {
	const { actorId } = route.params;
	const [actorData, setActorData] = useState(null);
	const [credits, setCredits] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([fetch(`https://api.tvmaze.com/people/${actorId}`).then((res) => res.json()), fetch(`https://api.tvmaze.com/people/${actorId}/castcredits?embed=show`).then((res) => res.json())])
			.then(([person, castCredits]) => {
				setActorData(person);
				setCredits(castCredits);
				setLoading(false);
				navigation.setOptions({
					title: person.name,
					headerTransparent: true,
					headerBackTitle: '',
					headerBackTitleVisible: false,
					headerStyle: {
						backgroundColor: 'rgba(30, 30, 30, 0.6)',
					},
				});
			})
			.catch(() => setLoading(false));
	}, [actorId, navigation]);

	if (loading)
		return (
			<View style={styles.loading}>
				<ActivityIndicator size='large' color='#1DB954' />
			</View>
		);

	return (
		<ScrollView style={styles.container} bounces={false}>
			<View style={styles.imageWrapper}>
				<Image source={actorData.image ? { uri: actorData.image.original } : require('../media/images/no-photo.jpeg')} style={styles.profileImage} />
				<LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent', 'black']} style={StyleSheet.absoluteFill} />
			</View>

			<View style={styles.infoSection}>
				<Text style={styles.name}>{actorData.name}</Text>
				<Text style={styles.details}>
					{actorData.birthday ? `Born: ${actorData.birthday}` : 'Birthday unknown'}
					{actorData.country ? ` | ${actorData.country.name}` : ''}
				</Text>

				{/* Only show credits if there are any */}
				{credits && credits.length > 0 ? (
					<View>
						<Text style={styles.sectionTitle}>Known For</Text>
						<FlatList
							data={credits}
							horizontal
							showsHorizontalScrollIndicator={false}
							keyExtractor={(item) => item._embedded.show.id.toString()}
							renderItem={({ item }) => (
								<Pressable
									style={styles.showCard}
									onPress={() => {
										navigation.navigate('Show Details', { showId: item._embedded.show.id });
									}}
								>
									<Image source={item._embedded.show.image ? { uri: item._embedded.show.image.medium } : require('../media/images/no-photo.jpeg')} style={styles.showPoster} />
									<Text style={styles.showTitle} numberOfLines={2}>
										{item._embedded.show.name}
									</Text>
								</Pressable>
							)}
						/>
					</View>
				) : (
					<Text style={styles.details}>No other data was found.</Text>
				)}
			</View>
			<View style={{ height: 110 }} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		paddingTop: 90,
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#000',
		alignItems: 'center',
	},
	imageWrapper: {
		width: '100%',
		height: 550,
	},
	profileImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	infoSection: {
		padding: 20,
		marginTop: -60,
	},
	name: {
		color: '#fff',
		fontSize: 32,
		fontWeight: 'bold',
	},
	details: {
		color: '#aaa',
		fontSize: 14,
		marginVertical: 10,
	},
	sectionTitle: {
		color: '#fff',
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 30,
		marginBottom: 15,
	},
	showCard: {
		width: 120,
		marginRight: 15,
	},
	showPoster: {
		width: 120,
		height: 180,
		borderRadius: 8,
		backgroundColor: '#1a1a1a',
	},
	showTitle: {
		color: '#fff',
		fontSize: 12,
		marginTop: 8,
		textAlign: 'center',
	},
});
