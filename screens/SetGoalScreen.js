"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "@react-navigation/native"
import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { Colors } from "../constants/colors"
import { createGoal, deleteGoal as deleteGoalApi, getGoals } from '../utils/api'

const SetGoalScreen = () => {
  const { colors } = useTheme()
  const [goalName, setGoalName] = useState("")
  const [goalTarget, setGoalTarget] = useState("")
  const [goalFrequency, setGoalFrequency] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userGoals, setUserGoals] = useState([])

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await getGoals(token)
      if (Array.isArray(response)) {
        setUserGoals(response)
      } else {
        setUserGoals([])
      }
    } catch (e) {
      console.error("Failed to load goals:", e)
    }
  }

  const handleAddGoal = async () => {
    if (!goalName.trim() || !goalTarget.trim() || !goalFrequency.trim()) {
      Alert.alert("Error", "Please fill in all fields for the goal.")
      return
    }

    // Specific validation for "Record Heartbeat X Times" goal
    if (goalName.trim() === "Record Heartbeat X Times") {
      if (isNaN(Number.parseInt(goalTarget.trim()))) {
        Alert.alert("Error", "For 'Record Heartbeat X Times' goal, target must be a number.")
        return
      }
    }

    setIsLoading(true)
    const token = await AsyncStorage.getItem("token")
    const newGoal = {
      name: goalName.trim(),
      target: goalTarget.trim(),
      frequency: goalFrequency.trim(),
      completed: false,
    }
    const response = await createGoal(token, newGoal)
    if (response && response._id) {
      setUserGoals((prev) => [...prev, response])
      Alert.alert("Success", "New goal added successfully!")
      setGoalName("")
      setGoalTarget("")
      setGoalFrequency("")
    } else {
      Alert.alert("Error", response.message || "Failed to add goal.")
    }
    setIsLoading(false)
  }

  const handleDeleteGoal = (id) => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const token = await AsyncStorage.getItem("token")
            const response = await deleteGoalApi(token, id)
            if (response && response.message && response.message.includes("deleted")) {
              setUserGoals((prev) => prev.filter((goal) => goal._id !== id))
              Alert.alert("Goal Deleted", "Goal has been removed.")
            } else {
              Alert.alert("Error", response.message || "Failed to delete goal.")
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  const renderGoalItem = ({ item }) => (
    <View style={[styles.goalItem, { borderBottomColor: colors.borderColorLight }]}>
      <View style={styles.goalInfo}>
        <Ionicons name="checkmark-circle-outline" size={24} color={Colors.accentGreen} />
        <View style={styles.goalTextContainer}>
          <Text style={[styles.goalName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.goalDetails, { color: colors.text }]}>
            Target: {item.target} | Frequency: {item.frequency}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDeleteGoal(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color={Colors.accentRed} />
      </TouchableOpacity>
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Set Your Health Goals</Text>
      <Text style={[styles.pageSubtitle, { color: colors.text }]}>
        Define and track your personal health objectives.
      </Text>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Add New Goal</Text>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Goal Name</Text>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.background, borderColor: colors.borderColorLight },
            ]}
          >
            <Ionicons name="flag-outline" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g., Record Heartbeat X Times"
              placeholderTextColor={colors.text + "80"}
              value={goalName}
              onChangeText={setGoalName}
              editable={!isLoading}
            />
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Target</Text>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.background, borderColor: colors.borderColorLight },
            ]}
          >
            <Ionicons name="analytics-outline" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g., 3 (for X times), 150 (for minutes)"
              placeholderTextColor={colors.text + "80"}
              value={goalTarget}
              onChangeText={setGoalTarget}
              keyboardType={goalName.trim() === "Record Heartbeat X Times" ? "numeric" : "default"}
              editable={!isLoading}
            />
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Frequency</Text>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.background, borderColor: colors.borderColorLight },
            ]}
          >
            <Ionicons name="repeat-outline" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g., Daily, Weekly, Monthly"
              placeholderTextColor={colors.text + "80"}
              value={goalFrequency}
              onChangeText={setGoalFrequency}
              editable={!isLoading}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addGoalButton, { backgroundColor: Colors.primary }]}
          onPress={handleAddGoal}
          disabled={isLoading}
          accessibilityLabel="Add new goal"
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.textLight} />
          ) : (
            <Text style={styles.addGoalButtonText}>Add Goal</Text>
          )}
        </TouchableOpacity>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Current Goals</Text>
        {userGoals.length === 0 ? (
          <View style={styles.noGoalsContainer}>
            <Ionicons name="trophy-outline" size={50} color={colors.text} style={{ opacity: 0.5 }} />
            <Text style={[styles.noGoalsText, { color: colors.text }]}>No goals set yet. Add one above!</Text>
          </View>
        ) : (
          <FlatList
            data={userGoals}
            renderItem={renderGoalItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Disable FlatList scrolling inside ScrollView
          />
        )}
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  pageSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.8,
    lineHeight: 24,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
  },
  addGoalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  addGoalButtonText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
  noGoalsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  noGoalsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.7,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  goalInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  goalTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  goalName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  goalDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  deleteButton: {
    marginLeft: 15,
    padding: 5,
  },
})

export default SetGoalScreen
