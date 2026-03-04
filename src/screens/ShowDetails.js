import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, Linking } from 'react-native';

export default function ShowDetailsScreen({ route, navigation }) {
	const [showData, setShowData] = useState();
	const { showId } = route.params;

	const getShowData = () => {
		fetch('https://api.tvmaze.com/shows/' + showId)
			.then((response) => response.json())
			.then((json) => {
				setShowData(json);
			})
			.catch((error) => {
				console.error('Fetch Error:', error);
			});
	};

	useEffect(() => {
		getShowData();
	}, [showId]);

	return (
		<View style={styles.ShowDetailsScreen}>
			{showData ? (
				<View style={styles.ShowDetailsContainer}>
					<Image style={styles.showImage} source={{ uri: showData.image?.original || showData.image?.medium }} />
					<View style={styles.metaDataContainer}>
						<Text style={styles.metaDataText}>
							<Text style={{ fontWeight: 'bold' }}>Show Name:</Text>
							{showData.name}
						</Text>
						<Text style={styles.metaDataText}>
							<Text style={{ fontWeight: 'bold' }}>Location:</Text>
							{showData.network?.country?.name || 'N/A'}
						</Text>
					</View>
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
	ShowDetailsScreen: {
		flex: 1,
	},
	ShowDetailsContainer: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000',
	},
	showImage: {
		width: '100%',
		height: 450,
		resizeMode: 'cover',
	},
	metaDataContainer: {
		padding: 20,
	},
	metaDataText: {
		fontSize: 17,
		color: '#fff',
		marginBottom: 10,
	},
});
