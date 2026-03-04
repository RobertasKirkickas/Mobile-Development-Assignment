import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Pressable, Keyboard } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function SearchForm({ searchQuery, setSearchQuery, setSearchResults, onClose, searchType = 'shows' }) {
	const requestIdRef = useRef(0);

	const handleSearch = async (query, dismissKeyboard = false) => {
		if (dismissKeyboard) Keyboard.dismiss();
		if (!query || !query.trim()) {
			setSearchResults([]);
			return;
		}

		try {
			const currentRequestId = ++requestIdRef.current;

			// Logic to switch between shows and people endpoints
			const endpoint = searchType === 'people' ? 'search/people' : 'search/shows';
			const res = await fetch(`https://api.tvmaze.com/${endpoint}?q=${encodeURIComponent(query)}`);
			const data = await res.json();

			if (currentRequestId === requestIdRef.current) {
				// Map to person if type is people, otherwise map to shows
				setSearchResults(data.map((item) => (searchType === 'people' ? item.person : item.show)));
			}
		} catch (error) {
			setSearchResults([]);
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => handleSearch(searchQuery), 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	return (
		<View style={styles.searchForm}>
			<TextInput
				style={styles.input}
				placeholder={searchType === 'people' ? 'Search actors...' : 'Search shows...'}
				placeholderTextColor='#888'
				value={searchQuery}
				onChangeText={setSearchQuery}
				autoFocus={true}
			/>
			<Pressable onPress={onClose} style={styles.clearButton}>
				<Feather name='x-circle' size={22} color='#888' />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	searchForm: {
		flex: 1,
		height: 40,
		flexDirection: 'row',
		backgroundColor: '#1e1e1e',
		borderRadius: 20,
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	input: {
		flex: 1,
		color: '#FFF',
		fontSize: 16,
		height: '100%',
	},
	clearButton: {
		padding: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
