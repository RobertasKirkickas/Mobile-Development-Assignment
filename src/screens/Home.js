import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75; // Card is 75% of screen width
const ITEM_SPACING = 10;
const FULL_ITEM_SIZE = ITEM_WIDTH + (ITEM_SPACING * 2);

const HomeCarousel = ({ navigation }) => {
  const [featuredShows, setFeaturedShows] = useState([]);

  useEffect(() => {
    fetch('https://api.tvmaze.com/shows')
      .then(res => res.json())
      .then(data => setFeaturedShows(data.slice(0, 10))); // Shows 10 shows for the carousel
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ShowDetails', { id: item.id })}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image?.medium }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.rating}>⭐ {item.rating?.average || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Today</Text>
<FlatList
        data={featuredShows}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true} // Enables left-to-right scrolling instead of vertical
        showsHorizontalScrollIndicator={false} // Hides the scroll bar
        
        // Carousel logic
        snapToInterval={FULL_ITEM_SIZE} // Ensures the list stops at every card width.
        decelerationRate="fast"         // Makes the scroll stop quickly to enable snapping.
        snapToAlignment="center"        // Aligns the center of the card with the screen's center.
        contentContainerStyle={styles.listContent} // Adds space so the first/last cards can center.
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  header: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 20, 
    marginBottom: 15 
  },
  listContent: { paddingHorizontal: (width - FULL_ITEM_SIZE) / 2 },
  cardContainer: { width: FULL_ITEM_SIZE, paddingHorizontal: ITEM_SPACING },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    height: 350,
  },
  image: { width: '100%', height: '80%', resizeMode: 'cover' },
  info: { padding: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  rating: { color: '#aaa', fontSize: 14, marginTop: 4 }
});

export default HomeCarousel;