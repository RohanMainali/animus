"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from "@react-navigation/native"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import { Colors } from "../constants/colors"
import { createVitals } from "../utils/vitalsApi"

const VitalsMonitorScreen = ({ navigation, addHistoryEntry }) => {
  const { colors } = useTheme()
  const [bloodPressure, setBloodPressure] = useState("")
  const [pulseRate, setPulseRate] = useState("")
  const [bloodOxygen, setBloodOxygen] = useState("")
  const [temperature, setTemperature] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  const handleAnalyze = async () => {
    if (!bloodPressure && !pulseRate && !temperature) {
      Alert.alert("No Data", "Please enter at least blood pressure, pulse rate, or temperature.")
      return
    }

    setIsLoading(true)
    try {
      // Split bloodPressure into systolic/diastolic
      let bpSystolic = ""
      let bpDiastolic = ""
      if (bloodPressure.includes("/")) {
        const [sys, dia] = bloodPressure.split("/").map(s => s.replace(/[^\d.]/g, "").trim())
        bpSystolic = sys || ""
        bpDiastolic = dia || ""
      }
      const vitalsData = {
        heartRate: pulseRate.replace(/[^\d.]/g, "").trim(),
        bpSystolic,
        bpDiastolic,
        temperature: temperature.trim(),
        o2: bloodOxygen.trim(),
      }
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      const result = await createVitals(vitalsData, token)
      if (result.error) throw new Error(result.error)
      const newEntry = {
        id: result._id || Date.now().toString(),
        date: result.date || new Date().toISOString().split("T")[0],
        scanType: "vitals",
        scanData: vitalsData,
        llmResponse: {
          analysis: result.analysis,
          confidence: result.confidence,
          scan_details: result.scan_details,
          insights: result.insights,
          ai: result.ai
        }
      }
      if (typeof addHistoryEntry === "function") {
        addHistoryEntry(newEntry) // Add to global history
      }
      navigation.navigate("Results", { result: newEntry })
    } catch (error) {
      console.error("Vitals analysis failed", error)
      Alert.alert("Analysis Error", "Failed to analyze vitals. Please try again.")
    } finally {
      setIsLoading(false)
      setBloodPressure("")
      setPulseRate("")
      setBloodOxygen("")
      setTemperature("")
    }
  }

  const mockPulseFromCamera = async () => {
    setIsLoading(true)
    Alert.alert(
      "Mock Pulse Reading",
      "Simulating pulse reading from camera flash... (In a real app, this would use camera and flash for PPG)",
    )
    setTimeout(async () => {
      const mockPulse = Math.floor(Math.random() * (100 - 60) + 60) // 60-100 bpm
      setPulseRate(`${mockPulse} bpm`)
      setIsLoading(false)
      Alert.alert("Pulse Read", `Mock Pulse: ${mockPulse} bpm`)
    }, 2000)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="always">
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Vitals & BP Monitoring</Text>
          <Text style={[styles.guideText, { color: colors.text }]}> 
            Manually enter your vital signs or use mock sensor features.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Blood Pressure (Systolic/Diastolic)</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.background, borderColor: colors.borderColorLight },
              ]}
            >
              <Ionicons name="heart-outline" size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="e.g., 120/80 mmHg"
                placeholderTextColor={colors.text + "80"}
                value={bloodPressure}
                onChangeText={setBloodPressure}
                keyboardType="numbers-and-punctuation"
                editable={!isLoading}
              />
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Pulse Rate</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.background, borderColor: colors.borderColorLight },
              ]}
            >
              <Ionicons name="pulse-outline" size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="e.g., 72 bpm"
                placeholderTextColor={colors.text + "80"}
                value={pulseRate}
                onChangeText={setPulseRate}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Blood Oxygen (SpO₂)</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.background, borderColor: colors.borderColorLight },
              ]}
            >
              <Ionicons name="water-outline" size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="e.g., 98%"
                placeholderTextColor={colors.text + "80"}
                value={bloodOxygen}
                onChangeText={setBloodOxygen}
                keyboardType="numeric"
                editable={!isLoading}
              />
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Temperature</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.background, borderColor: colors.borderColorLight },
              ]}
            >
              <Ionicons name="thermometer-outline" size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="e.g., 98.6°F or 37°C"
                placeholderTextColor={colors.text + "80"}
                value={temperature}
                onChangeText={setTemperature}
                keyboardType="numbers-and-punctuation"
                editable={!isLoading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: Colors.accentGreen }]}
            onPress={handleAnalyze}
            disabled={isLoading}
            accessibilityLabel="Analyze vitals"
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textLight} size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze Vitals</Text>
            )}
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  guideText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.85,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 30,
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
  mockSensorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mockSensorButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  analyzeButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  analyzeButtonText: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: "bold",
  },
})

export default VitalsMonitorScreen
