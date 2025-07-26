"use client"
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useTheme } from "@react-navigation/native"; // Import useFocusEffect
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";
import { funFacts, mockBadges } from "../constants/mockData";

const { width } = Dimensions.get("window")

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme()
  const currentFunFact = funFacts[Math.floor(Math.random() * funFacts.length)]
  const [activeReminders, setActiveReminders] = useState([])
  const [latestScanSummary, setLatestScanSummary] = useState(null)
  const [latestMedicalReport, setLatestMedicalReport] = useState(null)

  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem("userReminders")
      if (storedReminders) {
        const parsedReminders = JSON.parse(storedReminders)
        const active = parsedReminders.filter((r) => r.enabled)
        setActiveReminders(active)
      }
    } catch (e) {
      console.error("Failed to load reminders for home screen:", e)
    }
  }

  const loadLatestScanSummary = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("history") // Now `history` holds all scan types
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory)
        // Find the latest medical_report entry
        const latestReport = parsedHistory.find(entry => entry.scanType === 'medical_report' && entry.llmResponse)
        setLatestMedicalReport(latestReport || null)
        // Fallback for latest scan summary (any scan)
        if (
          parsedHistory.length > 0 &&
          parsedHistory[0] &&
          parsedHistory[0].llmResponse &&
          typeof parsedHistory[0].llmResponse.summary !== 'undefined'
        ) {
          setLatestScanSummary(parsedHistory[0].llmResponse.summary)
        } else {
          setLatestScanSummary("")
        }
      }
    } catch (e) {
      console.error("Failed to load latest scan summary:", e)
    }
  }

  useFocusEffect(
    // useCallback is important to prevent infinite loops
    // if dependencies are objects/arrays that change on every render
    // For simple functions like loadProfileData, it's good practice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => {
      loadReminders()
      loadLatestScanSummary()
    },
  )

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  const renderReminderBubble = ({ item }) => (
    <TouchableOpacity
      style={[styles.reminderBubble, { backgroundColor: Colors.primary + "15", borderColor: Colors.primary }]}
      onPress={() => navigation.navigate("Reminders")}
      accessibilityLabel={`Reminder: ${item.name}`}
    >
      <Ionicons name="alarm-outline" size={24} color={Colors.primary} />
      <Text style={[styles.reminderBubbleText, { color: colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[Colors.primary, Colors.gradientEnd]} style={styles.heroSection}>
        <Image
          source={{ uri: "/placeholder.svg?height=100&width=100" }}
          style={styles.heroIcon}
          accessibilityLabel="Abstract health monitor icon"
        />
        <Text style={styles.heroTitle}>Welcome to Animus</Text>
        <Text style={styles.heroSubtitle}>Your personal AI-powered health companion.</Text>
        {latestScanSummary && (
          <View style={styles.latestSummaryContainer}>
            <Ionicons name="sparkles" size={20} color={Colors.textLight} />
            <Text style={styles.latestSummaryText}>Latest AI Insight: {latestScanSummary}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => navigation.navigate("Scan")} // Navigate to ScanSelectionScreen
          accessibilityLabel="Start a new health scan"
        >
          <Ionicons name="scan-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.heroButtonText}>Start New Scan</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {activeReminders.length > 0 && (
          <View style={styles.remindersSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Reminders</Text>
            <FlatList
              data={activeReminders}
              renderItem={renderReminderBubble}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.remindersList}
            />
            <TouchableOpacity
              style={styles.viewAllRemindersButton}
              onPress={() => navigation.navigate("Reminders")}
              accessibilityLabel="View all reminders"
            >
              <Text style={[styles.viewAllRemindersText, { color: Colors.primary }]}>View All Reminders</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </View>
        )}


        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Scans</Text>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("CardiacScan")} // Cardiac Scan
            accessibilityLabel="Perform cardiac scan"
          >
            <Ionicons name="heart" size={30} color={Colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Cardiac Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("SkinScanner")} // New Skin Scan
            accessibilityLabel="Scan skin"
          >
            <Ionicons name="body" size={30} color={Colors.secondary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Skin Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("EyeScanner")} // New Eye Scan
            accessibilityLabel="Scan eyes"
          >
            <Ionicons name="eye" size={30} color={Colors.accentGreen} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Eye Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("VitalsMonitor")} // New Vitals Monitor
            accessibilityLabel="Monitor vitals"
          >
            <Ionicons name="thermometer" size={30} color={Colors.accentRed} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Vitals Monitor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("SymptomInput")} // New Symptom Checker
            accessibilityLabel="Check symptoms"
          >
            <Ionicons name="chatbox-ellipses" size={30} color={Colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Symptom Checker</Text>
          </TouchableOpacity>
          {/* Medical Report Analysis Quick Scan Card */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("MedicalReportScan")}
            accessibilityLabel="Analyze medical report"
          >
            <Ionicons name="document-text-outline" size={30} color={Colors.secondary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Medical Report</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
          {mockBadges.map((badge) => (
            <Card key={badge.id} style={styles.badgeCard}>
              <Ionicons name={badge.icon} size={40} color={badge.color} />
              <Text style={[styles.badgeName, { color: colors.text }]}>{badge.name}</Text>
              <Text style={[styles.badgeDescription, { color: colors.text }]}>{badge.description}</Text>
            </Card>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Breathing & Wellness</Text>
        <Card style={styles.wellnessCard}>
          <Image
            source={{ uri: "/placeholder.svg?height=150&width=300" }}
            style={styles.wellnessImage}
            accessibilityLabel="Person meditating peacefully"
          />
          <Text style={[styles.wellnessText, { color: colors.text }]}>
            Engage in guided breathing exercises synced with calming visuals to reduce stress and improve focus.
          </Text>
          <TouchableOpacity
            style={[styles.wellnessButton, { backgroundColor: Colors.primary }]}
            onPress={() => navigation.navigate("Breathing")} // Link to new BreathingScreen
            accessibilityLabel="Start Breathing Mode"
          >
            <Text style={styles.wellnessButtonText}>Start Breathing Mode</Text>
          </TouchableOpacity>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Fact</Text>
        <Card style={styles.factCard}>
          <Ionicons name="bulb-outline" size={24} color={Colors.primary} style={styles.factIcon} />
          <Text style={[styles.factText, { color: colors.text }]}>{currentFunFact}</Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Explore Animus</Text>
        <View style={styles.exploreButtonsContainer}>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("HealthInsights")}
            accessibilityLabel="Explore health insights"
          >
            <Ionicons name="book-outline" size={30} color={Colors.primary} />
            <Text style={[styles.exploreButtonText, { color: colors.text }]}>Health Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("Reminders")}
            accessibilityLabel="Set reminders"
          >
            <Ionicons name="alarm-outline" size={30} color={Colors.secondary} />
            <Text style={[styles.exploreButtonText, { color: colors.text }]}>Reminders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("Support")}
            accessibilityLabel="Get support"
          >
            <Ionicons name="help-circle-outline" size={30} color={Colors.accentGreen} />
            <Text style={[styles.exploreButtonText, { color: colors.text }]}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  heroIcon: {
    width: 80,
    height: 80,
    marginBottom: 15,
    tintColor: Colors.textLight,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.textLight,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 18,
    color: Colors.textLight,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 25,
  },
  latestSummaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.textLight + "30",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    maxWidth: "90%",
  },
  latestSummaryText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    flexShrink: 1,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.textLight,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  heroButtonText: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 15,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  remindersSection: {
    marginBottom: 20,
  },
  remindersList: {
    paddingVertical: 10,
  },
  reminderBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reminderBubbleText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  viewAllRemindersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewAllRemindersText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColorLight,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  badgesScroll: {
    paddingRight: 10, // To show part of the next card
  },
  badgeCard: {
    width: width * 0.4, // Approx 2 cards per row
    marginRight: 15,
    alignItems: "center",
    paddingVertical: 25,
    justifyContent: "center",
  },
  badgeName: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  badgeDescription: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.7,
  },
  wellnessCard: {
    alignItems: "center",
    paddingVertical: 25,
  },
  wellnessImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  wellnessText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
    opacity: 0.85,
  },
  wellnessButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  wellnessButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "bold",
  },
  factCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 25,
  },
  factIcon: {
    marginRight: 15,
  },
  factText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
    opacity: 0.85,
  },
  exploreButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  exploreButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColorLight,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
})

export default HomeScreen
