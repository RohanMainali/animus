"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useTheme } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"

const MedicalReportScreen = ({ route }) => {
  const { colors } = useTheme()
  const { result } = route.params // The full scan result object

  if (!result) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={[styles.errorText, { color: colors.text }]}>No report data available.</Text>
      </View>
    )
  }

  const { scanType, scanData, llmResponse, date, time } = result
  const { summary, topConditions, urgency, suggestions, confidence, explanation } = llmResponse

  const getUrgencyColor = (urgencyLevel) => {
    switch (urgencyLevel) {
      case "Low":
        return Colors.accentGreen
      case "Medium":
        return Colors.secondary
      case "High":
        return Colors.accentRed
      case "Emergency":
        return Colors.accentRed
      default:
        return colors.text
    }
  }

  const getScanTypeName = (type) => {
    switch (type) {
      case "cardiac":
        return "Cardiac Scan"
      case "skin":
        return "Skin Scan"
      case "eye":
        return "Eye Scan"
      case "vitals":
        return "Vitals Monitor"
      case "symptom":
        return "Symptom Check"
      default:
        return "Health Scan"
    }
  }

  const handleDownloadPDF = () => {
    Alert.alert(
      "Download Report",
      "This feature is under development. A PDF of this report would be downloaded here.",
      [{ text: "OK" }],
    )
    // In a real app, you'd use a library like 'expo-print' or 'react-native-html-to-pdf'
    // to generate and share the PDF.
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Medical Report</Text>

        <View style={styles.reportHeader}>
          <Text style={[styles.headerText, { color: colors.text }]}>
            <Text style={{ fontWeight: "bold" }}>Date:</Text> {date}
          </Text>
          <Text style={[styles.headerText, { color: colors.text }]}>
            <Text style={{ fontWeight: "bold" }}>Time:</Text> {time}
          </Text>
          <Text style={[styles.headerText, { color: colors.text }]}>
            <Text style={{ fontWeight: "bold" }}>Scan Type:</Text> {getScanTypeName(scanType)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Findings</Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>
            <Text style={{ fontWeight: "bold" }}>Primary Finding:</Text>{" "}
            {scanData.diagnosis || scanData.symptoms || "N/A"}
          </Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>
            <Text style={{ fontWeight: "bold" }}>Confidence Level:</Text> {Math.round(confidence * 100)}%
          </Text>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(urgency) }]}>
            <Text style={styles.urgencyText}>Criticality: {urgency}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>LLM-Powered Summary & Interpretation</Text>
          <Text style={[styles.sectionContent, { color: colors.text, fontStyle: "italic" }]}>{summary}</Text>
          <Text style={[styles.sectionContent, { color: colors.text, marginTop: 10 }]}>{explanation}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggested Condition(s)</Text>
          {topConditions.map((condition, index) => (
            <Text key={index} style={[styles.sectionContent, { color: colors.text }]}>
              • {condition}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommendations for Next Steps</Text>
          <Text style={[styles.sectionContent, { color: colors.text }]}>{suggestions}</Text>
        </View>

        <TouchableOpacity
          style={[styles.downloadButton, { backgroundColor: Colors.primary }]}
          onPress={handleDownloadPDF}
          accessibilityLabel="Download medical report as PDF"
        >
          <Ionicons name="download" size={20} color={Colors.textLight} />
          <Text style={styles.downloadButtonText}>Download Report (PDF)</Text>
        </TouchableOpacity>
      </Card>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  reportHeader: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColorLight,
  },
  headerText: {
    fontSize: 16,
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColorLight,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  urgencyBadge: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
    marginTop: 15,
    alignSelf: "flex-start", // Align to start
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urgencyText: {
    color: Colors.textLight,
    fontWeight: "bold",
    fontSize: 16,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  downloadButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default MedicalReportScreen
