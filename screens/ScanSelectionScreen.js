"use client"

import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../constants/colors"

const { width } = Dimensions.get("window")

const ScanSelectionScreen = ({ navigation, addHistoryEntry, isDarkMode }) => {
  const { colors } = useTheme()

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  const scanOptions = [
    {
      name: "Cardiac Scan",
      icon: "heart-circle-outline",
      color: Colors.primary,
      screen: "CardiacScan",
      description: "Analyze your heartbeat for insights into cardiovascular health.",
    },
    {
      name: "Skin Scan",
      icon: "body-outline",
      color: Colors.secondary,
      screen: "SkinScanner",
      description: "Detect potential skin conditions by scanning a specific area.",
    },
    {
      name: "Eye Scan",
      icon: "eye-outline",
      color: Colors.accentGreen,
      screen: "EyeScanner",
      description: "Check your eye health for signs of common irritations or conditions.",
    },
    {
      name: "Vitals Monitor",
      icon: "thermometer-outline",
      color: Colors.accentRed,
      screen: "VitalsMonitor",
      description: "Manually log and monitor key vital signs like BP, pulse, and temperature.",
    },
    {
      name: "Symptom Checker",
      icon: "chatbox-ellipses-outline",
      color: Colors.primary,
      screen: "SymptomInput",
      description: "Input your symptoms and get AI-powered insights on possible conditions.",
    },
    {
      name: "Medical Report Scan",
      icon: "document-attach-outline",
      color: Colors.accentBlue || Colors.primary,
      screen: "MedicalReportScan",
      description: "Analyze blood, lab, or other medical reports using AI from an image.",
    },
  ]

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Choose Your Scan</Text>
      <Text style={[styles.pageSubtitle, { color: colors.text }]}>
        Select a health area you'd like to monitor or analyze today.
      </Text>

      <View style={styles.scanOptionsContainer}>
        {scanOptions.map((option) => (
          <TouchableOpacity
            key={option.screen}
            style={[styles.scanOptionButton, { backgroundColor: colors.card, borderColor: colors.borderColorLight }]}
            onPress={() => navigation.navigate(option.screen, { addHistoryEntry, isDarkMode })}
            accessibilityLabel={`Start ${option.name}`}
          >
            <Ionicons name={option.icon} size={45} color={option.color} style={styles.optionIcon} />
            <Text style={[styles.optionTitle, { color: colors.text }]}>{option.name}</Text>
            <Text style={[styles.optionDescription, { color: colors.text }]}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={30} color={Colors.secondary} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          Animus uses advanced AI to provide insights across various health aspects. Always consult a medical
          professional for diagnosis and treatment.
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
  scanOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  scanOptionButton: {
    width: "100%", // Full width for larger cards
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
  },
  optionIcon: {
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  optionDescription: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.85,
    lineHeight: 22,
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
  infoCard: {
    alignItems: "center",
    paddingVertical: 30,
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
    opacity: 0.9,
  },
})

export default ScanSelectionScreen
