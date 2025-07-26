"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { useTheme } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"
import { mockComparisonSamples } from "../constants/mockData"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CompareScreen = ({ route, navigation }) => {
  const { colors } = useTheme()
  const [selectedSample1, setSelectedSample1] = useState(null)
  const [selectedSample2, setSelectedSample2] = useState(null)
  const [historyOptions, setHistoryOptions] = useState([])
  const [showPicker1, setShowPicker1] = useState(false)
  const [showPicker2, setShowPicker2] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoadingHistory(true)
      try {
        // Load all history, then filter for cardiac scans for comparison
        const storedHistory = await AsyncStorage.getItem("history") // Uses general history
        if (storedHistory !== null) {
          const parsedHistory = JSON.parse(storedHistory)
          const cardiacScanHistory = parsedHistory
            .filter((item) => item.scanType === "cardiac") // Filter for cardiac scans only
            .map((item) => ({
              id: item.id,
              name: `Your Cardiac Scan: ${item.date} - ${item.scanData.diagnosis} (${Math.round(
                item.scanData.confidence * 100,
              )}%)`,
              diagnosis: item.scanData.diagnosis,
              waveformUrl: item.audio_features?.waveformUrl, // Use audio_features if available
              text: item.llmResponse.summary,
            }))
          setHistoryOptions(cardiacScanHistory)
        }
      } catch (e) {
        console.error("Failed to load history for comparison.", e)
      } finally {
        setIsLoadingHistory(false)
      }
    }
    loadHistory()

    if (route.params?.currentResult && route.params.currentResult.scanType === "cardiac") {
      const current = route.params.currentResult
      setSelectedSample1({
        id: current.id,
        name: `Your Latest Cardiac Scan: ${current.date} - ${current.scanData.diagnosis} (${Math.round(
          current.scanData.confidence * 100,
        )}%)`,
        diagnosis: current.scanData.diagnosis,
        waveformUrl: current.audio_features?.waveformUrl,
        text: current.llmResponse.summary,
      })
    }
  }, [route.params?.currentResult])

  const allComparisonOptions = [
    ...historyOptions,
    { id: "healthy", name: "Healthy Cardiac Sample", ...mockComparisonSamples.healthy },
    { id: "murmur", name: "Cardiac Murmur Sample", ...mockComparisonSamples.murmur },
    { id: "arrhythmia", name: "Cardiac Arrhythmia Sample", ...mockComparisonSamples.arrhythmia },
  ]

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  const renderSamplePicker = (sampleNum, currentSelection, setSelection, showPicker, setShowPicker) => (
    <View style={[styles.pickerContainer, { borderColor: colors.borderColorLight }]}>
      <TouchableOpacity
        style={[styles.pickerButton, { backgroundColor: colors.background }]}
        onPress={() => setShowPicker((prev) => !prev)}
        accessibilityLabel={`Select sample ${sampleNum}`}
      >
        <Text style={[styles.pickerButtonText, { color: colors.text }]}>
          {currentSelection ? currentSelection.name : `Select Cardiac Sample ${sampleNum}`}
        </Text>
        <Ionicons name={showPicker ? "chevron-up" : "chevron-down"} size={20} color={colors.text} />
      </TouchableOpacity>
      {showPicker && (
        <ScrollView style={[styles.pickerOptions, { backgroundColor: colors.card }]}>
          {isLoadingHistory ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ padding: 20 }} />
          ) : allComparisonOptions.length === 0 ? (
            <Text style={[styles.noOptionsText, { color: colors.text }]}>No cardiac history or samples available.</Text>
          ) : (
            allComparisonOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.pickerOption, { borderBottomColor: colors.borderColorLight }]}
                onPress={() => {
                  setSelection(option)
                  setShowPicker(false)
                }}
                accessibilityLabel={`Choose ${option.name}`}
              >
                <Text style={[styles.pickerOptionText, { color: colors.text }]}>{option.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  )

  const renderSampleCard = (sample, title) => (
    <Card style={styles.sampleCard}>
      <Text style={[styles.sampleCardTitle, { color: colors.text }]}>{title}</Text>
      {sample ? (
        <>
          <Text style={[styles.sampleName, { color: colors.text }]}>{sample.name}</Text>
          <Text style={[styles.sampleDiagnosis, { color: colors.text }]}>Diagnosis: {sample.diagnosis}</Text>
          {sample.waveformUrl ? (
            <Image
              source={{ uri: sample.waveformUrl }}
              style={styles.waveformImage}
              accessibilityLabel={`Waveform for ${sample.name}`}
            />
          ) : (
            <View style={[styles.waveformImage, styles.noImagePlaceholder]}>
              <Text style={{ color: colors.text + "80" }}>No waveform available</Text>
            </View>
          )}
          <Text style={[styles.sampleText, { color: colors.text }]}>{sample.text}</Text>
        </>
      ) : (
        <Text style={[styles.noSampleText, { color: colors.text }]}>Select a sample above to compare.</Text>
      )}
    </Card>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Compare Cardiac Scans</Text>
      <Text style={[styles.pageSubtitle, { color: colors.text }]}>
        Select two cardiac samples from your history or pre-defined examples to compare their waveforms and insights.
      </Text>

      {renderSamplePicker(1, selectedSample1, setSelectedSample1, showPicker1, setShowPicker1)}
      {renderSamplePicker(2, selectedSample2, setSelectedSample2, showPicker2, setShowPicker2)}

      <View style={styles.comparisonSection}>
        {renderSampleCard(selectedSample1, "Sample 1")}
        {renderSampleCard(selectedSample2, "Sample 2")}
      </View>

      {!selectedSample1 || !selectedSample2 ? (
        <View style={[styles.instructionContainer, { backgroundColor: Colors.secondary + "20" }]}>
          <Ionicons name="information-circle-outline" size={30} color={Colors.secondary} />
          <Text style={[styles.instructionText, { color: colors.text }]}>
            Choose two cardiac scan results above to see a side-by-side comparison of their characteristics and AI
            insights.
          </Text>
        </View>
      ) : (
        <Card style={styles.comparisonSummaryCard}>
          <Text style={[styles.comparisonSummaryTitle, { color: colors.text }]}>Comparison Insights</Text>
          <Text style={[styles.comparisonSummaryText, { color: colors.text }]}>
            {selectedSample1.diagnosis === selectedSample2.diagnosis
              ? `Both samples show a similar diagnosis of ${selectedSample1.diagnosis}.`
              : `Sample 1 is diagnosed as ${selectedSample1.diagnosis} while Sample 2 is ${selectedSample2.diagnosis}.`}
          </Text>
          <Text style={[styles.comparisonSummaryText, { color: colors.text }]}>
            Analyze the waveforms and descriptions above to understand the differences and similarities in detail.
          </Text>
        </Card>
      )}
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
    marginBottom: 25,
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 15,
  },
  pickerButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  pickerOptions: {
    maxHeight: 200,
    borderTopWidth: 1,
  },
  pickerOption: {
    padding: 18,
    borderBottomWidth: 1,
  },
  pickerOptionText: {
    fontSize: 16,
  },
  noOptionsText: {
    padding: 20,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
  },
  comparisonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  sampleCard: {
    width: "48%",
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sampleCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  sampleName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sampleDiagnosis: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
    opacity: 0.8,
  },
  waveformImage: {
    width: "100%",
    height: 80,
    resizeMode: "contain",
    marginBottom: 15,
  },
  noImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
  },
  sampleText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.85,
  },
  noSampleText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
    paddingVertical: 20,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    lineHeight: 24,
  },
  comparisonSummaryCard: {
    paddingVertical: 25,
  },
  comparisonSummaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  comparisonSummaryText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 8,
  },
})

export default CompareScreen
