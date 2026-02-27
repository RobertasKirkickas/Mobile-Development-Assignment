import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Pressable, Keyboard } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function SearchForm({ searchQuery, setSearchQuery, setSearchResults }) {
	// Tracks the latest request so older/slower responses do not overwrite new results
	const requestIdRef = useRef(0);

	const changeHandler = (val) => {
		setSearchQuery(val);
	};

	const handleSearch = async (query, dismissKeyboard = false) => {
		// Used for manual submit Enter key / search button
		if (dismissKeyboard) {
			Keyboard.dismiss();
		}

		// Empty input will show default list
		if (!query || !query.trim()) {
			setSearchResults([]);
			return;
		}

		try {
			const currentRequestId = ++requestIdRef.current;
			const mainQuery = encodeURIComponent(query.trim());
			const showsRes = await fetch(`https://api.tvmaze.com/search/shows?q=${mainQuery}`);
			const shows = await showsRes.json();

			// Only applies results from the newest request
			if (currentRequestId === requestIdRef.current) {
				setSearchResults(shows.map((item) => item.show));
			}
		} catch (error) {
			console.error('Error:', error);
			setSearchResults([]);
		}
	};

	useEffect(() => {
		// Debounce search so fetch runs shortly after typing stops
		const timer = setTimeout(() => {
			handleSearch(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	return (
		<View style={styles.searchForm}>
			<TextInput
				onSubmitEditing={() => {
					handleSearch(searchQuery, true);
				}}
				style={styles.input}
				placeholder={`Search...`}
				value={searchQuery}
				onChangeText={changeHandler}
			/>
			<Pressable onPress={() => handleSearch(searchQuery, true)} style={styles.searchButton}>
				<Feather style={styles.icon} name='search' size={24} color='#FFF' />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	searchForm: {
		width: '100%',
		height: 40,
		flexDirection: 'row',
		backgroundColor: '#FFF',
	},
	input: {
		flexGrow: 1,
		color: '#000',
		paddingHorizontal: 8,
		borderWidth: 2,
		borderColor: '#000',
	},
	searchButton: {
		width: 40,
		height: 40,
		padding: 2,
		backgroundColor: '#000',
	},
	icon: {
		flex: 1,
		justifyContent: 'center',
		alignSelf: 'center',
		lineHeight: 32,
	},
});
