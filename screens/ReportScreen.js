"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../constants/colors"
import { createHealthReport, createMedicalHistory, getHealthReports, getRecommendations } from "../utils/api"

const ReportScreen = ({ route, navigation }) => {
  const { result } = route.params
  const { colors } = useTheme()
  const [healthReports, setHealthReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [recommendationData, setRecommendationData] = useState(null)
  const [recLoading, setRecLoading] = useState(false)
  const [recError, setRecError] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      const token = await AsyncStorage.getItem("token")
      const response = await getHealthReports(token)
      if (Array.isArray(response)) {
        setHealthReports(response)
      } else {
        setHealthReports([])
      }
      setLoading(false)
    }
    fetchReports()
  }, [])

  // Save the medical report to the database (HealthReport) only if not already saved
  useEffect(() => {
    const saveReport = async () => {
      const token = await AsyncStorage.getItem("token")
      // Check if already exists in DB
      const existing = healthReports.find(r => r.id === result.id || r._id === result.id)
      if (!existing && scanType && scanData && result && result.id) {
        const reportString = JSON.stringify({
          scanType,
          scanData,
          llmResponse,
          summary,
          explanation,
          scan_details,
          insights,
          topConditions,
          confidence,
          suggestions,
          date: result.date,
          id: result.id
        })
        await createHealthReport(token, {
          reportType: scanType,
          result: reportString,
          doctorFeedback: '',
          date: result.date
        })
      }
    }
    saveReport()
  }, [scanType, scanData, result, healthReports])

  // Fetch recommendations and urgency after report loads, only if not already present
  useEffect(() => {
    const fetchRecommendations = async () => {
      setRecLoading(true)
      setRecError(null)
      try {
        // Only fetch if not already present
        if (!recommendationData) {
          const token = await AsyncStorage.getItem("token")
          const userId = await AsyncStorage.getItem("userId")
          const recPayload = {
            analysis: summary || analysis || explanation || '',
            userId: userId,
            scanType,
            scanData,
            vitalsId: result.id || undefined,
          }
          const recRes = await getRecommendations(token, recPayload)
          setRecommendationData(recRes)
          // Save to medical history if flagged, using all available fields
          if (recRes && recRes.isMedicalCondition === 1) {
            const historyPayload = {
              condition: recRes.condition || summary || analysis || scanType,
              description: recRes.recommendations || recRes.insights || explanation || '',
              dateDiagnosed: result.date || new Date().toISOString(),
              isActive: true,
              referenceId: result.id || undefined
            }
            await createMedicalHistory(token, historyPayload)
          }
        }
      } catch (err) {
        setRecError('Failed to fetch recommendations')
      } finally {
        setRecLoading(false)
      }
    }
    if (!recommendationData && (summary || analysis || explanation) && scanType && scanData) {
      fetchRecommendations()
    }
  }, [summary, analysis, explanation, scanType, scanData, result, recommendationData])

  // Use the passed result for display, but prefer the latest from healthReports if available
  let reportData = result
  if (Array.isArray(healthReports) && healthReports.length > 0) {
    // Try to find a matching report by id
    const found = healthReports.find(r => r.id === result.id)
    if (found) reportData = found
  }
  const { scanType, scanData, llmResponse = {} } = reportData
  // Show all fields, defaulting to empty if missing
  const { summary, topConditions = [], suggestions, confidence, explanation, analysis, scan_details, insights } = llmResponse

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
        return "Health Analysis"
    }
  }

  const getScanDataDisplay = () => {
    if (scanType === "cardiac") {
      return `Diagnosis: ${scanData.diagnosis}\nConfidence: ${Math.round(scanData.confidence * 100)}%`
    } else if (scanType === "skin" || scanType === "eye") {
      return `Diagnosis: ${scanData.diagnosis}\nConfidence: ${Math.round(scanData.confidence * 100)}%`
    } else if (scanType === "vitals") {
      return Object.entries(scanData)
        .filter(([key]) => key !== "diagnosis" && key !== "confidence")
        .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1").trim()}: ${value}`)
        .join("\n")
    } else if (scanType === "symptom") {
      return `Symptoms Reported: "${scanData.symptoms}"\nConfidence: ${Math.round(scanData.confidence * 100)}%`
    }
    return "N/A"
  }

  const handleDownloadPDF = async () => {
    const userName = (await AsyncStorage.getItem("userName")) || "Animus User"
    const userEmail = (await AsyncStorage.getItem("userEmail")) || "user@example.com"

    const pdfContent = `
      MEDICAL REPORT - Animus Health Monitor
      Generated: ${new Date().toLocaleString()}

      PATIENT INFORMATION
      Name: ${userName}
      Email: ${userEmail}

      SCAN DETAILS
      Scan Type: ${getScanTypeName(scanType)}
      Date of Scan: ${result.date}
      Scan ID: ${result.id}

      RAW SCAN DATA
      ${getScanDataDisplay()}

      AI ANALYSIS FINDINGS
      Summary:
      ${summary || analysis || ''}

      Scan Details:
      ${scan_details || ''}

      Insights:
      ${insights || suggestions || ''}

      Top Possible Conditions:
      ${topConditions.map((c) => `- ${c}`).join("\n")}

      AI Confidence: ${Math.round((confidence || 0) * 100)}%

      RECOMMENDATIONS / NEXT STEPS
      ${suggestions}

      ---
      Disclaimer: This report is generated by an AI-powered health monitoring system and is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
    `

    // In a real React Native app, you would use libraries like 'expo-print' and 'expo-sharing'
    // For a web preview, we'll create a blob and trigger a download.
    const blob = new Blob([pdfContent], { type: "text/plain" }) // Mock as plain text, not actual PDF
    const url = URL.createObjectURL(blob)

    Alert.alert(
      "Download Report",
      "This will download a mock text file as a PDF. In a real app, a formatted PDF would be generated.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Download",
          onPress: async () => {
            if (await Linking.canOpenURL(url)) {
              Linking.openURL(url)
              Alert.alert("Download Started", "Your medical report download has begun!")
            } else {
              Alert.alert("Download Failed", "Could not initiate download. Please try again.")
            }
          },
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card>
        <Text style={[styles.reportTitle, { color: colors.text }]}>Medical Report</Text>
        <Text style={[styles.reportSubtitle, { color: colors.text }]}>
          Generated on: {new Date().toLocaleDateString()}
        </Text>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Patient Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color={colors.text} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: colors.text }]}>Name: Animus User</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color={colors.text} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: colors.text }]}>Email: user@example.com</Text>
        </View>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Scan Details</Text>
        <View style={styles.infoRow}>
          <Ionicons name="medical-outline" size={20} color={colors.text} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: colors.text }]}>Scan Type: {getScanTypeName(scanType)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color={colors.text} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: colors.text }]}>Date of Scan: {result.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="barcode-outline" size={20} color={colors.text} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: colors.text }]}>Scan ID: {result.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="analytics-outline" size={20} color={colors.text} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: colors.text, flexShrink: 1 }]}>Raw Data: {getScanDataDisplay()}</Text>
        </View>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Analysis Findings</Text>
        <View style={styles.detailBlock}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>Summary:</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>{summary || analysis || ''}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>Possible Conditions:</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>{scan_details || ''}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>Insights:</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>{insights || suggestions || ''}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>AI Confidence:</Text>
          <Text style={[styles.detailText, { color: colors.text }]}>{Math.round((confidence || 0) * 100)}%</Text>
        </View>
      </Card>


      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommendations & Urgency</Text>
        {recLoading ? (
          <Text style={{ color: colors.text, textAlign: 'center', marginVertical: 10 }}>Loading recommendations...</Text>
        ) : recError ? (
          <Text style={{ color: Colors.accentRed, textAlign: 'center', marginVertical: 10 }}>{recError}</Text>
        ) : recommendationData ? (
          <>
            <View style={styles.detailBlock}>
              <Text style={[styles.detailTitle, { color: colors.text }]}>Urgency:</Text>
              <Text style={[styles.detailText, { color: colors.text, fontWeight: 'bold', color: recommendationData.urgency === 'High' ? Colors.accentRed : recommendationData.urgency === 'Medium' ? Colors.secondary : Colors.accentGreen }]}>{recommendationData.urgency || '--'}</Text>
            </View>
            <View style={styles.detailBlock}>
              <Text style={[styles.detailTitle, { color: colors.text }]}>Recommendations:</Text>
              <Text style={[styles.detailText, { color: colors.text }]}>{recommendationData.recommendations || recommendationData.insights || '--'}</Text>
            </View> 
            {recommendationData.isMedicalCondition === 1 && (
              <View style={styles.detailBlock}>
                <Text style={[styles.detailTitle, { color: Colors.accentRed }]}>This result has been saved to your medical history.</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={{ color: colors.text, textAlign: 'center', marginVertical: 10 }}>No recommendations available.</Text>
        )}
      </Card>

      <TouchableOpacity
        style={[styles.downloadButton, { backgroundColor: Colors.primary }]}
        onPress={handleDownloadPDF}
        accessibilityLabel="Download Medical Report as PDF"
      >
        <Ionicons name="download-outline" size={24} color={Colors.textLight} />
        <Text style={styles.downloadButtonText}>Download as PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: Colors.secondary }]}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back to results"
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        <Text style={styles.backButtonText}>Back to Results</Text>
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
  reportTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  reportSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 8,
    borderColor: Colors.borderColorLight,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
    opacity: 0.7,
  },
  infoText: {
    fontSize: 16,
    flexShrink: 1,
  },
  detailBlock: {
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  urgencyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  urgencyText: {
    color: Colors.textLight,
    fontWeight: "bold",
    fontSize: 14,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 15,
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 30,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  backButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },  
})

export default ReportScreen
