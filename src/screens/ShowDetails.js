import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ShowDetailsScreen({ route, navigation }) {
  const [showData, setShowData] = useState();
  const [seasons, setSeasons] = useState([]);
  const { showId } = route.params;

  // Regex to remove HTML tags like <p> and <b>
  const cleanHtmlTags = (text) =>
    text ? text.replace(/<[^>]*>/g, "") : "No summary available.";

  const getShowData = () => {
    fetch("https://api.tvmaze.com/shows/" + showId)
      .then((response) => response.json())
      .then((json) => {
        setShowData(json);
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  };

  useEffect(() => {
    getShowData();
  }, [showId]);

  useEffect(() => {
    // Fetch show data
    fetch(`https://api.tvmaze.com/shows/${showId}`)
      .then((res) => res.json())
      .then((data) => setShowData(data));

    // Fetch show's seasons
    fetch(`https://api.tvmaze.com/shows/${showId}/seasons`)
      .then((res) => res.json())
      .then((data) => setSeasons(data));
  }, [showId]);

  useEffect(() => {
    if (showData) {
      navigation.setOptions({
        title: showData.name,
        headerBackTitleVisible: false,
      });
    }
  }, [showData, navigation]);

  if (!showData)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );

  return (
    <ScrollView style={styles.ShowDetailsScreen} bounces={false}>
      {showData ? (
        <View style={styles.ShowDetailsContainer}>
          {/* Header image */}
          <View style={styles.imageWrapper}>
            <Image
              style={styles.showImage}
              source={{
                uri: showData.image?.original || showData.image?.medium,
              }}
            />

            {/* Vertical shadow */}
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.8)",
                "transparent",
                "transparent",
                "rgba(0,0,0,1)",
              ]}
              locations={[0, 0.2, 0.7, 1]}
              style={StyleSheet.absoluteFill}
            />

            {/* Horizontal shadow */}
            <LinearGradient
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              colors={[
                "rgba(0,0,0,0.6)",
                "transparent",
                "transparent",
                "rgba(0,0,0,0.6)",
              ]}
              locations={[0, 0.1, 0.9, 1]}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={styles.metaDataContainer}>
            {/* Show title */}
            <Text style={styles.title}>{showData.name}</Text>

            {/* Badges for year, ranking, seasons) */}
            <View style={styles.badgeRow}>
              <Text style={styles.yearBadge}>
                {showData.premiered?.split("-")[0] || "N/A"}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {showData.rating?.average || "N/A"}
                </Text>
              </View>
              <Text style={styles.seasonBadge}>{seasons.length} Seasons</Text>
            </View>

            {/* Genres */}
            <View style={styles.genreRow}>
              {showData.genres?.map((genre, index) => (
                <View key={index} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>

            {/* Summary */}
            <Text style={styles.sectionHeader}>About the show</Text>
            <Text style={styles.summaryText}>
              {cleanHtmlTags(showData.summary)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Main styles
  ShowDetailsScreen: {
    flex: 1,
  },
  ShowDetailsContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  imageWrapper: {
    width: "100%",
    height: 450,
  },
  showImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  metaDataContainer: {
    padding: 20,
    marginTop: -40,
  },
  metaDataText: {
    fontSize: 17,
    color: "#fff",
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },

  // Badge styles
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  yearBadge: {
    color: "#aaa",
    marginRight: 15,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  ratingText: {
    color: "#FFD700",
    marginLeft: 4,
    fontWeight: "bold",
  },
  seasonBadge: {
    backgroundColor: "#333",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },

  // Genres styles
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  genrePill: {
    backgroundColor: "rgba(29, 185, 84, 0.2)",
    borderWidth: 1,
    borderColor: "#1DB954",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "#1DB954",
    fontSize: 12,
    fontWeight: "600",
  },

  // Summary
  sectionHeader: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryText: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },
});
