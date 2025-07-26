"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "@react-navigation/native"
import { useState } from "react"
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as Progress from "react-native-progress"
import { Colors } from "../constants/colors"

const ResultsScreen = ({ route, navigation }) => {
  const { result } = route.params // result now contains scanType, scanData, and llmResponse
  const { colors } = useTheme()
  const [feedbackGiven, setFeedbackGiven] = useState(null) // 'helpful' or 'unhelpful'

  // Extract data from the generic result object
  const { scanType, scanData, llmResponse } = result
  // For symptom, llmResponse may be structured JSON from AI
  const { analysis, confidence, scan_details, insights, summary, topConditions, urgency, suggestions, explanation, message } = llmResponse || {}
  // Fallback for symptom analysis
  const symptomAnalysis = analysis || message || result.analysis || 'No AI analysis available.'

  const getUrgencyColor = (urgencyLevel) => {
    switch (urgencyLevel) {
      case "Low":
        return Colors.accentGreen
      case "Medium":
        return Colors.secondary
      case "High":
        return Colors.accentRed
      default:
        return colors.text
    }
  }

  const handleFeedback = async (type) => {
    setFeedbackGiven(type)
    Alert.alert("Feedback Received", `Thank you for your feedback! You found this explanation ${type}.`)
    // Simulate sending feedback to a backend or storing it
    try {
      const feedbackEntry = {
        resultId: result.id,
        scanType: scanType,
        diagnosis: scanData.diagnosis || scanData.symptoms, // Use diagnosis for scans, symptoms for symptom checker
        feedbackType: type,
        timestamp: new Date().toISOString(),
      }
      const storedFeedback = await AsyncStorage.getItem("aiFeedback")
      const allFeedback = storedFeedback ? JSON.parse(storedFeedback) : []
      allFeedback.push(feedbackEntry)
      await AsyncStorage.setItem("aiFeedback", JSON.stringify(allFeedback))
      console.log("AI Feedback stored:", feedbackEntry)
    } catch (e) {
      console.error("Failed to store AI feedback:", e)
    }
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  // Render medical report modules using the same logic as other modules
  const renderMedicalReportModules = () => {
    if (!llmResponse) return null;
    return (
      <>
        {llmResponse.analysis && (
          <View style={styles.llmDetailSection}>
            <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Analysis:</Text>
            <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse.analysis}</Text>
          </View>
        )}
        {llmResponse.scan_details && (
          <View style={styles.llmDetailSection}>
            <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Scan Details:</Text>
            <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse.scan_details}</Text>
          </View>
        )}
        {llmResponse.insights && (
          <View style={styles.llmDetailSection}>
            <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Insights / Suggestions:</Text>
            <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse.insights}</Text>
          </View>
        )}
        {llmResponse.explanation && (
          <View style={styles.llmDetailSection}>
            <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Explanation:</Text>
            <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse.explanation}</Text>
          </View>
        )}
      </>
    );
  };

  const renderScanSpecificVisuals = () => {
    if (scanType === "cardiac") {
      return (
        <View style={styles.visualsContainer}>
          <View style={[styles.visualItem, { backgroundColor: colors.background }]}>
            <Text style={[styles.visualTitle, { color: colors.text }]}>Waveform</Text>
            <Image
              source={{ uri: scanData.waveformUrl }}
              style={styles.visualImage}
              accessibilityLabel={`Waveform for ${scanData.diagnosis}`}
            />
            {/* Note: Real-time waveform visualization during recording or detailed interactive playback
                would require advanced audio processing libraries and potentially native module development. */}
          </View>
          <View style={[styles.visualItem, { backgroundColor: colors.background }]}>
            <Text style={[styles.visualTitle, { color: colors.text }]}>Spectrogram</Text>
            <Image
              source={{ uri: scanData.spectrogramUrl }}
              style={styles.visualImage}
              accessibilityLabel={`Spectrogram for ${scanData.diagnosis}`}
            />
          </View>
        </View>
      )
    } else if (scanType === "skin" || scanType === "eye") {
      return (
        <View style={styles.visualsContainer}>
          <View style={[styles.visualItemFull, { backgroundColor: colors.background }]}>
            <Text style={[styles.visualTitle, { color: colors.text }]}>Captured Image</Text>
            <Image
              source={{ uri: scanData.imageUrl }}
              style={styles.capturedImage}
              accessibilityLabel={`Captured image for ${scanType} scan`}
            />
          </View>
        </View>
      )
    } else if (scanType === "vitals") {
      return (
        <View style={styles.vitalsDisplayContainer}>
          {/* Show Scan Analysis (3-5 word summary) */}
          {llmResponse?.analysis && (
            <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight, backgroundColor: '#e6f7ff', marginBottom: 8 }]}> 
              <Ionicons name="analytics-outline" size={24} color={Colors.primary} />
              <Text style={[styles.vitalsLabel, { color: colors.text, fontWeight: 'bold' }]}>Scan Analysis:</Text>
              <Text style={[styles.vitalsValue, { color: colors.text }]}>{llmResponse.analysis}</Text>
            </View>
          )}
          {(scanData.bpSystolic || scanData.bpDiastolic) && (
            <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight }]}> 
              <Ionicons name="heart-outline" size={24} color={Colors.primary} />
              <Text style={[styles.vitalsLabel, { color: colors.text }]}>BP:</Text>
              <Text style={[styles.vitalsValue, { color: colors.text }]}> 
                {scanData.bpSystolic || '--'}/{scanData.bpDiastolic || '--'} mmHg
              </Text>
            </View>
          )}
          {scanData.heartRate && (
            <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight }]}> 
              <Ionicons name="pulse-outline" size={24} color={Colors.secondary} />
              <Text style={[styles.vitalsLabel, { color: colors.text }]}>Pulse:</Text>
              <Text style={[styles.vitalsValue, { color: colors.text }]}>{scanData.heartRate} bpm</Text>
            </View>
          )}
          {scanData.o2 && (
            <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight }]}> 
              <Ionicons name="water-outline" size={24} color={Colors.accentGreen} />
              <Text style={[styles.vitalsLabel, { color: colors.text }]}>O₂:</Text>
              <Text style={[styles.vitalsValue, { color: colors.text }]}>{scanData.o2}%</Text>
            </View>
          )}
          {scanData.temperature && (
            <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight }]}> 
              <Ionicons name="thermometer-outline" size={24} color={Colors.accentRed} />
              <Text style={[styles.vitalsLabel, { color: colors.text }]}>Temp:</Text>
              <Text style={[styles.vitalsValue, { color: colors.text }]}>{scanData.temperature}°F</Text>
            </View>
          )}
        </View>
      )
    } else if (scanType === "symptom") {
      return (
        <View style={styles.symptomDisplayContainer}>
          <Ionicons name="chatbox-ellipses-outline" size={30} color={Colors.primary} />
          <Text style={[styles.symptomText, { color: colors.text }]}>You described: "{scanData.symptoms}"</Text>
        </View>
      )
    }
    return null
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 16 }]}>AI Analysis Results</Text>
        {scanType === 'medical_report' ? (
          <View style={styles.summarySection}>
            <View style={styles.diagnosisBadge}>
              <Text style={[styles.diagnosisText, { color: colors.text }]}> 
                {llmResponse?.short_summary || 'No disease detected'}
              </Text>
            </View>
            <View style={styles.confidenceContainer}>
              <Progress.Circle
                progress={Number(llmResponse?.confidence) || 0}
                size={100}
                showsText={true}
                formatText={() => `${Math.round((Number(llmResponse?.confidence) || 0) * 100)}%`}
                color={Colors.primary}
                unfilledColor={colors.borderColorLight}
                borderWidth={0}
                textStyle={{ color: colors.text, fontSize: 22, fontWeight: "bold" }}
              />
              <Text style={[styles.confidenceLabel, { color: colors.text }]}>Confidence Score</Text>
            </View>
          </View>
        ) : scanType === 'vitals' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'right', marginRight: 12 }}>
                {llmResponse?.analysis || 'No AI analysis available.'}
              </Text>
            </View>
            <View style={{ width: 1, height: 60, backgroundColor: colors.borderColorLight, marginHorizontal: 8, borderRadius: 1 }} />
            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Confidence Score</Text>
              <Progress.Circle
                progress={Number(confidence) || 0}
                size={60}
                showsText={true}
                formatText={() => `${Math.round((Number(confidence) || 0) * 100)}%`}
                color={Colors.primary}
                unfilledColor={colors.borderColorLight}
                borderWidth={0}
                textStyle={{ color: colors.text, fontSize: 18, fontWeight: "bold" }}
              />
            </View>
          </View>
        ) : scanType === 'symptom' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'right', marginRight: 12 }}>
                {llmResponse?.short_summary || 'No summary available.'}
              </Text>
            </View>
            <View style={{ width: 1, height: 60, backgroundColor: colors.borderColorLight, marginHorizontal: 8, borderRadius: 1 }} />
            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Confidence Score</Text>
              <Progress.Circle
                progress={Number(confidence) || 0}
                size={60}
                showsText={true}
                formatText={() => `${Math.round((Number(confidence) || 0) * 100)}%`}
                color={Colors.primary}
                unfilledColor={colors.borderColorLight}
                borderWidth={0}
                textStyle={{ color: colors.text, fontSize: 18, fontWeight: "bold" }}
              />
            </View>
          </View>
        ) : (scanType === 'skin' || scanType === 'eye') ? (
          <View style={styles.summarySection}>
            <View style={styles.diagnosisBadge}>
              <Text style={[styles.diagnosisText, { color: colors.text }]}> 
                {llmResponse?.short_summary || 'No finding detected'}
              </Text>
            </View>
            <View style={styles.confidenceContainer}>
              <Progress.Circle
                progress={Number(confidence) || 0}
                size={100}
                showsText={true}
                formatText={() => `${Math.round((Number(confidence) || 0) * 100)}%`}
                color={Colors.primary}
                unfilledColor={colors.borderColorLight}
                borderWidth={0}
                textStyle={{ color: colors.text, fontSize: 22, fontWeight: "bold" }}
              />
              <Text style={[styles.confidenceLabel, { color: colors.text }]}>Confidence Score</Text>
            </View>
          </View>
        ) : (
          <View style={styles.summarySection}>
            <View className={styles.diagnosisBadge}>
              <Text style={[styles.diagnosisText, { color: colors.text }]}> 
                {scanData.diagnosis || "Scan Analysis"}
              </Text>
              <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(urgency) }]}> 
                <Text style={styles.urgencyText}>{urgency}</Text>
              </View>
            </View>
            <View style={styles.confidenceContainer}>
              <Progress.Circle
                progress={confidence}
                size={100}
                showsText={true}
                formatText={() => `${Math.round(confidence * 100)}%`}
                color={Colors.primary}
                unfilledColor={colors.borderColorLight}
                borderWidth={0}
                textStyle={{ color: colors.text, fontSize: 22, fontWeight: "bold" }}
              />
              <Text style={[styles.confidenceLabel, { color: colors.text }]}>Confidence Score</Text>
            </View>
          </View>
        )}
      </Card>
      <Card style={styles.visualsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Scan Details</Text>
        {scanType === 'medical_report' && scanData?.imageUrl ? (
          <View style={styles.visualsContainer}>
            <View style={[styles.visualItemFull, { backgroundColor: colors.background }]}> 
              <Text style={[styles.visualTitle, { color: colors.text }]}>Uploaded Image</Text>
              <Image
                source={{ uri: scanData.imageUrl }}
                style={styles.capturedImage}
                accessibilityLabel="Uploaded medical report image"
              />
            </View>
          </View>
        ) : scanType === 'vitals' ? (
          <View style={styles.vitalsDisplayContainer}>
            {(scanData.bpSystolic || scanData.bpDiastolic) && (
              <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight }]}> 
                <Ionicons name="heart-outline" size={24} color={Colors.primary} />
                <Text style={[styles.vitalsLabel, { color: colors.text }]}>BP:</Text>
                <Text style={[styles.vitalsValue, { color: colors.text }]}> 
                  {scanData.bpSystolic || '--'}/{scanData.bpDiastolic || '--'} mmHg
                </Text>
              </View>
            )}
            {scanData.heartRate && (
              <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight }]}> 
                <Ionicons name="pulse-outline" size={24} color={Colors.secondary} />
                <Text style={[styles.vitalsLabel, { color: colors.text }]}>Pulse:</Text>
                <Text style={[styles.vitalsValue, { color: colors.text }]}>{scanData.heartRate} bpm</Text>
              </View>
            )}
            {scanData.o2 && (
              <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight }]}> 
                <Ionicons name="water-outline" size={24} color={Colors.accentGreen} />
                <Text style={[styles.vitalsLabel, { color: colors.text }]}>O₂:</Text>
                <Text style={[styles.vitalsValue, { color: colors.text }]}>{scanData.o2}%</Text>
              </View>
            )}
            {scanData.temperature && (
              <View style={[styles.vitalsItem, { borderColor: colors.borderColorLight }]}> 
                <Ionicons name="thermometer-outline" size={24} color={Colors.accentRed} />
                <Text style={[styles.vitalsLabel, { color: colors.text }]}>Temp:</Text>
                <Text style={[styles.vitalsValue, { color: colors.text }]}>{scanData.temperature}°F</Text>
              </View>
            )}
          </View>
        ) : renderScanSpecificVisuals()}
      </Card>


      <Card style={styles.llmCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI-Powered Insights</Text>
        <>
          {scanType === 'medical_report' ? (
            renderMedicalReportModules()
          ) : (scanType === 'skin' || scanType === 'eye') ? (
            <>
              {scanData.userContext ? (
                <View style={styles.llmDetailSection}>
                  <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Supporting Note:</Text>
                  <Text style={[styles.llmDetailText, { color: colors.text }]}>{scanData.userContext}</Text>
                </View>
              ) : null}
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>AI Analysis:</Text>
                <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse?.analysis || 'No analysis available.'}</Text>
              </View>
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Scan Details:</Text>
                <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse?.scan_details || '--'}</Text>
              </View>
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Next Actions / Insights:</Text>
                <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse?.insights || '--'}</Text>
              </View>
            </>
          ) : (scanType === 'symptom' || scanType === 'vitals') ? (
            <>
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Explanation:</Text>
                <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse?.analysis || llmResponse?.message || 'No AI analysis available.'}</Text>
              </View>
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Top Possible Conditions:</Text>
                <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse?.scan_details || '--'}</Text>
              </View>
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Next Actions / Suggestions:</Text>
                <Text style={[styles.llmDetailText, { color: colors.text }]}>{llmResponse?.insights || '--'}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.llmSummary, { color: colors.text }]}>{summary}</Text>
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Explanation:</Text>
                <Text style={[styles.llmDetailText, { color: colors.text }]}>{explanation}</Text>
              </View>
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Top Possible Conditions:</Text>
                {(Array.isArray(topConditions) ? topConditions : []).map((condition, index) => (
                  <Text key={index} style={[styles.llmDetailText, { color: colors.text }]}> 
                    • {condition}
                  </Text>
                ))}
              </View>
              <View style={styles.llmDetailSection}>
                <Text style={[styles.llmDetailTitle, { color: colors.text }]}>Next Actions / Suggestions:</Text>
                <Text style={[styles.llmDetailText, { color: colors.text }]}>{suggestions}</Text>
              </View>
            </>
          )}

          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackQuestion, { color: colors.text }]}>Was this explanation helpful?</Text>
            <View style={styles.feedbackButtons}>
              <TouchableOpacity
                style={[
                  styles.feedbackButton,
                  {
                    backgroundColor: feedbackGiven === "helpful" ? Colors.accentGreen : colors.background,
                    borderColor: feedbackGiven === "helpful" ? Colors.accentGreen : colors.borderColorLight,
                  },
                ]}
                onPress={() => handleFeedback("helpful")}
                disabled={!!feedbackGiven}
                accessibilityLabel="Explanation was helpful"
              >
                <Ionicons
                  name="thumbs-up"
                  size={20}
                  color={feedbackGiven === "helpful" ? Colors.textLight : Colors.accentGreen}
                />
                <Text
                  style={[
                    styles.feedbackButtonText,
                    { color: feedbackGiven === "helpful" ? Colors.textLight : Colors.accentGreen },
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.feedbackButton,
                  {
                    backgroundColor: feedbackGiven === "unhelpful" ? Colors.accentRed : colors.background,
                    borderColor: feedbackGiven === "unhelpful" ? Colors.accentRed : colors.borderColorLight,
                  },
                ]}
                onPress={() => handleFeedback("unhelpful")}
                disabled={!!feedbackGiven}
                accessibilityLabel="Explanation was unhelpful"
              >
                <Ionicons
                  name="thumbs-down"
                  size={20}
                  color={feedbackGiven === "unhelpful" ? Colors.textLight : Colors.accentRed}
                />
                <Text
                  style={[
                    styles.feedbackButtonText,
                    { color: feedbackGiven === "unhelpful" ? Colors.textLight : Colors.accentRed },
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      </Card>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
          onPress={() => {
            // Prefer AI-generated analysis, summary, or explanation for chat context
            let topic = llmResponse?.analysis || llmResponse?.summary || llmResponse?.explanation || scanData.diagnosis || scanData.symptoms || "my results"
            if (topic && typeof topic === 'string') topic = topic.replace(/\.$/, '')
            navigation.navigate("MainApp", { screen: "Chat", params: { initialPrompt: `Tell me more about: ${topic}` } })
          }}
          accessibilityLabel="Ask Animus about diagnosis"
        >
          <Ionicons name="chatbubbles" size={20} color={Colors.textLight} />
          <Text style={styles.actionButtonText}>Ask More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
          onPress={() => navigation.navigate("Report", { result: result })} // Navigate to ReportScreen
          accessibilityLabel="Generate medical report"
        >
          <Ionicons name="document-text" size={20} color={Colors.textLight} />
          <Text style={styles.actionButtonText}>Get Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.accentRed }]}
          onPress={() => navigation.navigate("DoctorRecommendation", { result: result })} // Navigate to DoctorRecommendationScreen
          accessibilityLabel="Find a doctor"
        >
          <Ionicons name="medkit" size={20} color={Colors.textLight} />
          <Text style={styles.actionButtonText}>Find Doctor</Text>
        </TouchableOpacity>
        {scanType === "cardiac" && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
            onPress={() => navigation.navigate("MainApp", { screen: "Compare", params: { currentResult: result } })}
            accessibilityLabel="Compare this result"
          >
            <Ionicons name="git-compare" size={20} color={Colors.textLight} />
            <Text style={styles.actionButtonText}>Compare</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.accentGreen }]}
          onPress={() => navigation.navigate("MainApp", { screen: "Home" })}
          accessibilityLabel="Back to home"
        >
          <Ionicons name="home" size={20} color={Colors.textLight} />
          <Text style={styles.actionButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
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
  summarySection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  diagnosisBadge: {
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  diagnosisText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  urgencyBadge: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
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
  confidenceContainer: {
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  confidenceLabel: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  visualsCard: {
    paddingVertical: 25,
  },
  visualsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  visualItem: {
    width: "48%",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.borderColorLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  visualItemFull: {
    width: "100%",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.borderColorLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  visualTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  visualImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  capturedImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
  },
  vitalsDisplayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vitalsItem: {
    width: "48%",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  vitalsLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
  },
  vitalsValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  symptomDisplayContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  symptomText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
    lineHeight: 24,
  },
  llmCard: {
    paddingVertical: 25,
  },
  loadingIndicator: {
    marginVertical: 30,
  },
  llmSummary: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  llmDetailSection: {
    marginBottom: 15,
  },
  llmDetailTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  llmDetailText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  feedbackContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColorLight,
    alignItems: "center",
  },
  feedbackQuestion: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  feedbackButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  feedbackButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 8,
    minWidth: "48%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default ResultsScreen
