import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchForm from './SearchForm';

const Header = ({ searchQuery, setSearchQuery, setSearchResults, searchType }) => {
	const insets = useSafeAreaInsets();
	const [isSearching, setIsSearching] = useState(false);

	const handleClose = () => {
		setIsSearching(false);
		setSearchQuery('');
		setSearchResults([]);
	};

	return (
		<View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
			<View style={styles.headerContent}>
				{!isSearching ? (
					<>
						<Text style={styles.logoText}>
							SHOW<Text style={{ color: '#1DB954' }}>HUB</Text>
						</Text>
						<TouchableOpacity onPress={() => setIsSearching(true)}>
							<Ionicons name='search' size={26} color='white' />
						</TouchableOpacity>
					</>
				) : (
					<SearchForm searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} onClose={handleClose} searchType={searchType} />
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	headerWrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	headerContent: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
	},
	logoText: { color: 'white', fontSize: 22, fontWeight: '900' },
});

export default Header;
