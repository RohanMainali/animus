"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTheme } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native"
import {
    createReminder,
    deleteReminder,
    getReminders,
    updateReminder,
} from "../utils/api"
// import * as Notifications from 'expo-notifications'; // Uncomment for real notifications

import { Colors } from "../constants/colors"

// Remove initialMockReminders, use backend only

const RemindersScreen = () => {
  const { colors } = useTheme()
  const [reminders, setReminders] = useState([])
  const [newReminderName, setNewReminderName] = useState("")
  const [newReminderTime, setNewReminderTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [frequency, setFrequency] = useState('none')

  useEffect(() => {
    const fetchReminders = async () => {
      const token = await AsyncStorage.getItem("token")
      const response = await getReminders(token)
      if (Array.isArray(response)) {
        setReminders(response)
      } else {
        setReminders([])
      }
    }
    fetchReminders()
  }, [])

  // Backend integration for reminders
  const addReminder = async (reminderData) => {
    const token = await AsyncStorage.getItem("token")
    const response = await createReminder(token, reminderData)
    if (response && response._id) {
      setReminders((prev) => [...prev, response])
      Alert.alert("Reminder Added", `Your new reminder '${response.message}' at '${response.dateTime}' has been added!`)
    } else {
      Alert.alert("Error", response.message || "Failed to add reminder.")
    }
  }

  const updateReminderStatus = async (id, data) => {
    const token = await AsyncStorage.getItem("token")
    const response = await updateReminder(token, id, data)
    if (response && response._id) {
      setReminders((prev) => prev.map((r) => (r._id === id ? response : r)))
    } else {
      Alert.alert("Error", response.message || "Failed to update reminder.")
    }
  }

  const removeReminder = async (id) => {
    const token = await AsyncStorage.getItem("token")
    const response = await deleteReminder(token, id)
    if (response && response.message) {
      setReminders((prev) => prev.filter((r) => r._id !== id))
      Alert.alert("Reminder Deleted", "Reminder has been removed.")
    } else {
      Alert.alert("Error", response.message || "Failed to delete reminder.")
    }
  }

  const toggleReminder = async (id) => {
    const reminder = reminders.find((r) => r._id === id)
    if (!reminder) return
    const updated = { ...reminder, isCompleted: !reminder.isCompleted }
    await updateReminderStatus(id, updated)
    Alert.alert(
      updated.isCompleted ? "Reminder Completed" : "Reminder Enabled",
      `'${reminder.message}' at '${reminder.dateTime}' is now ${updated.isCompleted ? "completed" : "active"}.`,
    )
  }

  const deleteReminderHandler = (id) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => removeReminder(id),
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  const handleAddReminder = async () => {
    if (!newReminderName.trim()) {
      Alert.alert("Error", "Please enter a name for the reminder.")
      return
    }
    const isoDate = newReminderTime.toISOString()
    const newReminder = {
      type: "custom",
      message: newReminderName.trim(),
      dateTime: isoDate,
      repeat: frequency,
    }
    await addReminder(newReminder)
    setNewReminderName("")
    setNewReminderTime(new Date())
    setFrequency('none')
  }

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false)
    if (selectedDate) {
      setNewReminderTime(selectedDate)
    }
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Your Reminders</Text>
      <Text style={[styles.pageSubtitle, { color: colors.text }]}>
        Stay on track with your heart health goals by setting personalized reminders.
      </Text>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Add New Reminder</Text>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Reminder Name</Text>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.background, borderColor: colors.borderColorLight },
            ]}
          >
            <Ionicons name="text-outline" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g., Take medication"
              placeholderTextColor={colors.text + "80"}
              value={newReminderName}
              onChangeText={setNewReminderName}
            />
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Time</Text>
        <TouchableOpacity
          style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.borderColorLight }]}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={20} color={colors.text} style={styles.inputIcon} />
          <Text style={[styles.input, { color: colors.text }]}> {newReminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={newReminderTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Frequency</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            {['none', 'daily', 'weekly', 'monthly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 18,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: frequency === freq ? Colors.primary : colors.borderColorLight,
                  backgroundColor: frequency === freq ? Colors.primary : colors.background,
                  marginRight: 8,
                }}
                onPress={() => setFrequency(freq)}
              >
                <Text style={{ color: frequency === freq ? Colors.textLight : colors.text, fontWeight: '600' }}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </View>

        <TouchableOpacity
          style={[styles.addReminderButton, { backgroundColor: Colors.primary }]}
          onPress={handleAddReminder}
          accessibilityLabel="Add new reminder"
        >
          <Ionicons name="add-circle-outline" size={24} color={Colors.textLight} />
          <Text style={styles.addReminderButtonText}>Add Reminder</Text>
        </TouchableOpacity>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Manage Reminders</Text>
        {(!Array.isArray(reminders) || reminders.length === 0) ? (
          <View style={styles.noRemindersContainer}>
            <Ionicons name="notifications-off-outline" size={50} color={colors.text} style={{ opacity: 0.5 }} />
            <Text style={[styles.noRemindersText, { color: colors.text }]}>No reminders set yet.</Text>
          </View>
        ) : (
          (reminders || []).map((reminder) => (
            <View key={reminder._id || reminder.id} style={[styles.reminderItem, { borderBottomColor: colors.borderColorLight }]}> 
              <View style={styles.reminderInfo}>
                <Ionicons
                  name={reminder.isCompleted ? "checkmark-circle" : "notifications"}
                  size={24}
                  color={reminder.isCompleted ? Colors.accentGreen : Colors.primary}
                />
                <View style={styles.reminderTextContainer}>
                  <Text style={[styles.reminderName, { color: colors.text }]}>{reminder.message}</Text>
                  <Text style={[styles.reminderTime, { color: colors.text }]}>Time: {new Date(reminder.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  <Text style={[styles.reminderTime, { color: colors.text }]}>Frequency: {reminder.repeat ? reminder.repeat.charAt(0).toUpperCase() + reminder.repeat.slice(1) : 'None'}</Text>
                </View>
              </View>
              <View style={styles.reminderActions}>
                <Switch
                  trackColor={{ false: colors.borderColorLight, true: Colors.accentGreen }}
                  thumbColor={Platform.OS === "android" ? Colors.textLight : Colors.textLight}
                  ios_backgroundColor={colors.borderColorLight}
                  onValueChange={() => toggleReminder(reminder._id || reminder.id)}
                  value={!reminder.isCompleted}
                  accessibilityLabel={`Toggle ${reminder.message} reminder`}
                />
                <TouchableOpacity
                  onPress={() => deleteReminderHandler(reminder._id || reminder.id)}
                  style={styles.deleteButton}
                  accessibilityLabel={`Delete ${reminder.message} reminder`}
                >
                  <Ionicons name="trash-outline" size={24} color={Colors.accentRed} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </Card>

      <Card style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={30} color={Colors.secondary} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          Animus can help you remember to record your heartbeat, check insights, and more!
        </Text>
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
  addReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  addReminderButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoCard: {
    alignItems: "center",
    paddingVertical: 30,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
    opacity: 0.9,
  },
  noRemindersContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  noRemindersText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    opacity: 0.7,
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  reminderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  reminderTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  reminderName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    opacity: 0.7,
  },
  reminderActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 15,
    padding: 5,
  },
})

export default RemindersScreen
