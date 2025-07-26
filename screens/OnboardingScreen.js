"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../constants/colors"

const { width } = Dimensions.get("window")

const slides = [
  {
    id: "1",
    title: "Welcome to Animus",
    description: "Your AI-powered companion for comprehensive health monitoring and insights.",
    image: "/placeholder.svg?height=250&width=250",
  },
  {
    id: "2",
    title: "Scan & Analyze",
    description: "Easily perform various health scans, from cardiac and skin to eye and vitals, for instant analysis.",
    image: "/placeholder.svg?height=250&width=250",
  },
  {
    id: "3",
    title: "Understand & Improve",
    description: "Get AI-powered explanations, personalized suggestions, and chat with Animus for guidance.",
    image: "/placeholder.svg?height=250&width=250",
  },
  {
    id: "4",
    title: "Track Your Progress",
    description: "View your history, compare health data, and earn badges as you journey towards a healthier you.",
    image: "/placeholder.svg?height=250&width=250",
  },
]

const OnboardingScreen = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <Image source={{ uri: item.image }} style={styles.slideImage} accessibilityLabel={item.title} />
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  )

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const newIndex = Math.round(contentOffsetX / width)
    setCurrentIndex(newIndex)
  }

  return (
    <LinearGradient colors={[Colors.primary, Colors.gradientEnd]} style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContainer}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex ? styles.activeDot : styles.inactiveDot]}
            accessibilityLabel={`Page ${index + 1} of ${slides.length}`}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={onComplete}
        accessibilityLabel="Get Started with Animus"
      >
        <Text style={styles.getStartedButtonText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={24} color={Colors.primary} />
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50, // Space for button
  },
  flatListContainer: {
    alignItems: "center",
  },
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  slideImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 40,
    tintColor: Colors.textLight,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 15,
  },
  slideDescription: {
    fontSize: 18,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 26,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: Colors.textLight,
  },
  inactiveDot: {
    backgroundColor: Colors.textLight + "50", // 50% opacity
  },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.textLight,
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  getStartedButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
})

export default OnboardingScreen
