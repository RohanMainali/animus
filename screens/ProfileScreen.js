"use client"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect, useTheme } from "@react-navigation/native"
import { useState } from "react"
import { Alert, Image, Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../constants/colors"
import { mockBadges } from "../constants/mockData"
import { getProfile } from "../utils/api"

const ProfileScreen = ({ isDarkMode, toggleTheme, navigation, setLoggedIn }) => {
  const { colors } = useTheme()
  const [userName, setUserName] = useState("Animus User")
  const [userEmail, setUserEmail] = useState("user@example.com")
  const [scanStreak, setScanStreak] = useState(0) // Changed from recordingStreak
  const [totalScans, setTotalScans] = useState(0) // Changed from totalRecordings
  const [scanGoalProgress, setScanGoalProgress] = useState(0) // Changed from recordGoalProgress
  const [scanGoalTarget, setScanGoalTarget] = useState(0) // Changed from recordGoalTarget

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  // Function to load profile data and scan metrics
  const loadProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        const response = await getProfile(token)
        if (response.name) setUserName(response.name)
        if (response.email) setUserEmail(response.email)
      }
      // ...existing code for scan metrics...
      const streak = Number.parseInt((await AsyncStorage.getItem("scanStreak")) || "0")
      const total = Number.parseInt((await AsyncStorage.getItem("totalScans")) || "0")
      setScanStreak(streak)
      setTotalScans(total)
      const storedGoals = await AsyncStorage.getItem("userGoals")
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals)
        const scanGoal = parsedGoals.find(
          (goal) => goal.name === "Complete X Scans" || goal.name === "Record Heartbeat X Times",
        )
        if (scanGoal) {
          setScanGoalTarget(Number.parseInt(scanGoal.target) || 0)
          setScanGoalProgress(total)
        } else {
          setScanGoalTarget(0)
          setScanGoalProgress(0)
        }
      }
    } catch (e) {
      console.error("Failed to load profile data or metrics.", e)
    }
  }

  // Use useFocusEffect to reload data when screen comes into focus
  useFocusEffect(
    // useCallback is important to prevent infinite loops
    // if dependencies are objects/arrays that change on every render
    // For simple functions like loadProfileData, it's good practice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => {
      loadProfileData()
    },
  )

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          onPress: async () => {
            await AsyncStorage.setItem("loggedIn", "false")
            // Clear user-specific data on logout
            await AsyncStorage.removeItem("userName")
            await AsyncStorage.removeItem("userEmail")
            await AsyncStorage.removeItem("history") // Changed from heartbeatHistory
            await AsyncStorage.removeItem("userReminders")
            await AsyncStorage.removeItem("userGoals") // Clear goals too
            await AsyncStorage.removeItem("aiFeedback") // Clear feedback too
            await AsyncStorage.removeItem("scanStreak") // Changed from recordingStreak
            await AsyncStorage.removeItem("totalScans") // Changed from totalRecordings
            await AsyncStorage.removeItem("lastScanDate") // Changed from lastRecordingDate

            setLoggedIn(false)
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  const handleExportData = async () => {
    try {
      const historyData = await AsyncStorage.getItem("history") // Changed from heartbeatHistory
      const reminders = await AsyncStorage.getItem("userReminders")
      const goals = await AsyncStorage.getItem("userGoals")
      const feedback = await AsyncStorage.getItem("aiFeedback")
      const streak = await AsyncStorage.getItem("scanStreak") // Updated key
      const totalScansExport = await AsyncStorage.getItem("totalScans") // Updated key

      const dataToExport = {
        profile: { name: userName, email: userEmail },
        healthHistory: historyData ? JSON.parse(historyData) : [], // Renamed key
        reminders: reminders ? JSON.parse(reminders) : [],
        goals: goals ? JSON.parse(goals) : [],
        aiFeedback: feedback ? JSON.parse(feedback) : [],
        scanMetrics: {
          streak: Number.parseInt(streak || "0"),
          totalScans: Number.parseInt(totalScansExport || "0"),
        },
        exportTimestamp: new Date().toISOString(),
      }

      const jsonString = JSON.stringify(dataToExport, null, 2)
      const filename = `animus_data_export_${new Date().toISOString().split("T")[0]}.json`
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`

      // For web, this will trigger a download. For native, it would require expo-sharing or react-native-fs.
      // Since Next.js runs in browser, Linking.openURL with data URI is the closest simulation.
      const supported = await Linking.canOpenURL(dataUri)
      if (supported) {
        await Linking.openURL(dataUri)
        Alert.alert("Export Initiated", `Your data export (${filename}) has started. Check your downloads!`)
      } else {
        Alert.alert("Export Failed", "Could not initiate data download. Please try again or check console for data.")
        console.log("Exported Data (JSON):", jsonString)
      }
    } catch (e) {
      console.error("Failed to export data:", e)
      Alert.alert("Export Error", "Failed to prepare data for export. Please try again.")
    }
  }

  const handleSetGoal = () => {
    navigation.navigate("SetGoal") // Navigate to new screen
  }

  const handlePrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy") // Navigate to new screen
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.profileCard}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Your Profile</Text>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: "/placeholder.svg?height=100&width=100" }}
            style={styles.profileAvatar}
            accessibilityLabel="User avatar"
          />
          <Text style={[styles.profileName, { color: colors.text }]}>{userName}</Text>
          <Text style={[styles.profileEmail, { color: colors.text }]}>{userEmail}</Text>
        </View>
        <TouchableOpacity
          style={[styles.editProfileButton, { backgroundColor: Colors.secondary }]}
          onPress={() => navigation.navigate("EditProfile")}
          accessibilityLabel="Edit profile"
        >
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>App Settings</Text>
        <View style={[styles.settingItem, { borderBottomColor: colors.borderColorLight }]}>
          <Ionicons name="moon" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: colors.borderColorLight, true: Colors.primary }}
            thumbColor={isDarkMode ? Colors.textLight : Colors.textLight}
            ios_backgroundColor={colors.borderColorLight}
            onValueChange={toggleTheme}
            value={isDarkMode}
            accessibilityLabel="Toggle dark mode"
          />
        </View>
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.borderColorLight }]}
          onPress={() => navigation.navigate("Reminders")}
          accessibilityLabel="Go to reminders settings"
        >
          <Ionicons name="alarm" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>Reminders</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.borderColorLight }]}
          onPress={() => navigation.navigate("HealthInsights")}
          accessibilityLabel="Go to health insights"
        >
          <Ionicons name="book" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>Health Insights</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.borderColorLight }]}
          onPress={() => navigation.navigate("Support")}
          accessibilityLabel="Go to help and support"
        >
          <Ionicons name="help-circle" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.borderColorLight }]}
          onPress={handleExportData}
          accessibilityLabel="Export my data"
        >
          <Ionicons name="download" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>Export My Data</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: colors.borderColorLight }]}
          onPress={handlePrivacyPolicy} // Link to new screen
          accessibilityLabel="View privacy policy"
        >
          <Ionicons name="document-text" size={24} color={colors.text} />
          <Text style={[styles.settingText, { color: colors.text }]}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Gamification & Goals</Text>
        <View style={styles.gamificationSection}>
          <View style={[styles.streakContainer, { backgroundColor: Colors.accentGreen + "20" }]}>
            <Ionicons name="flame" size={30} color={Colors.accentGreen} />
            <Text style={[styles.streakText, { color: colors.text }]}>Current Scan Streak: {scanStreak} Days</Text>
          </View>

          {scanGoalTarget > 0 && (
            <View style={styles.goalProgressContainer}>
              <Text style={[styles.goalProgressLabel, { color: colors.text }]}>
                Scans Goal: {scanGoalProgress} / {scanGoalTarget}
              </Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.min(100, (scanGoalProgress / scanGoalTarget) * 100)}%` },
                  ]}
                />
              </View>
              {scanGoalProgress >= scanGoalTarget && (
                <Text style={[styles.goalCompletedText, { color: Colors.accentGreen }]}>Goal Achieved!</Text>
              )}
            </View>
          )}

          <Text style={[styles.gamificationSubtitle, { color: colors.text }]}>Earned Badges:</Text>
          <View style={styles.badgesContainer}>
            {mockBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Ionicons name={badge.icon} size={45} color={badge.color} />
                <Text style={[styles.badgeName, { color: colors.text }]}>{badge.name}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.setGoalButton, { backgroundColor: Colors.primary }]}
            onPress={handleSetGoal}
            accessibilityLabel="Set a new goal"
          >
            <Ionicons name="trophy-outline" size={20} color={Colors.textLight} />
            <Text style={styles.setGoalButtonText}>Set a New Goal</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: Colors.accentRed }]}
        onPress={handleLogout}
        accessibilityLabel="Log out of Animus"
      >
        <Ionicons name="log-out-outline" size={24} color={Colors.textLight} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileCard: {
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  profileName: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    opacity: 0.7,
  },
  editProfileButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editProfileButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  settingText: {
    flex: 1,
    fontSize: 17,
    marginLeft: 15,
    fontWeight: "500",
  },
  gamificationSection: {
    alignItems: "center",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  goalProgressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  goalProgressLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  progressBarBackground: {
    width: "90%",
    height: 10,
    backgroundColor: Colors.borderColorLight,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.accentGreen,
    borderRadius: 5,
  },
  goalCompletedText: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },
  gamificationSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badgeItem: {
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 10,
    width: 90, // Fixed width for consistent layout
  },
  badgeName: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
  },
  setGoalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  setGoalButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
})

export default ProfileScreen
