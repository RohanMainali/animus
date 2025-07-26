"use client"

import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { Colors } from "../constants/colors"

const { width } = Dimensions.get("window")

import AsyncStorage from "@react-native-async-storage/async-storage"
import {
    getMedicalHistories
} from "../utils/api"

const MedicalHistoryScreen = ({ navigation, isDarkMode }) => {
  const { colors } = useTheme()
  const [filterScanType, setFilterScanType] = useState("All")
  const [medicalHistory, setMedicalHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
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

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      setLoading(true)
      const token = await AsyncStorage.getItem("token")
      const response = await getMedicalHistories(token)
      if (Array.isArray(response)) {
        setMedicalHistory(response)
      } else {
        setMedicalHistory([])
      }
      setLoading(false)
    }
    fetchMedicalHistory()
  }, [])

  const filteredHistory = medicalHistory
    .filter((item) => filterScanType === "All" || item.condition === filterScanType)
    .sort((a, b) => new Date(b.dateDiagnosed || b.createdAt) - new Date(a.dateDiagnosed || a.createdAt))

  // Chart data for cardiac conditions
  const cardiacHistory = medicalHistory.filter((item) => item.condition.toLowerCase().includes("cardiac"))
  const chartData = {
    labels: cardiacHistory.slice(0, 7).map((item) => (item.dateDiagnosed || item.createdAt).substring(5, 10)),
    datasets: [
      {
        data: cardiacHistory.slice(0, 7).map((item) => item.isActive ? 100 : 50),
        color: (opacity = 1) => `rgba(90, 103, 216, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? Colors.cardBackgroundDark : Colors.cardBackgroundLight,
    backgroundGradientTo: isDarkMode ? Colors.cardBackgroundDark : Colors.cardBackgroundLight,
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(90, 103, 216, ${opacity})`, // Primary color
    labelColor: (opacity = 1) => `rgba(${isDarkMode ? "247, 250, 252" : "45, 55, 72"}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: Colors.primary,
    },
    fillShadowGradient: Colors.primary,
    fillShadowGradientOpacity: 0.1,
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  const getScanTypeIcon = (scanType) => {
    switch (scanType) {
      case "cardiac":
        return "heart"
      case "skin":
        return "body"
      case "eye":
        return "eye"
      case "vitals":
        return "thermometer"
      case "symptom":
        return "chatbox-ellipses"
      default:
        return "document"
    }
  }

  const getScanTypeName = (scanType) => {
    switch ((scanType || "").trim().toLowerCase()) {
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
        return "Unknown Scan"
    }
  }

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.historyItem, { backgroundColor: colors.card, borderColor: colors.borderColorLight }]}
      onPress={() => navigation.navigate("Results", { result: item })}
      accessibilityLabel={`View details for ${item.condition} record`}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemType}>
          <Ionicons name={getScanTypeIcon(item.condition)} size={20} color={Colors.primary} />
          <Text style={[styles.itemTypeText, { color: colors.text }]}>{item.condition}</Text>
        </View>
        <Text style={[styles.itemDate, { color: colors.text }]}>{item.dateDiagnosed ? item.dateDiagnosed.substring(0, 10) : item.createdAt.substring(0, 10)}</Text>
      </View>
      <Text style={[styles.itemDiagnosis, { color: colors.text }]}> 
        <Text style={{ fontWeight: "bold" }}>Description:</Text> {item.description || "N/A"}
      </Text>
      <Text style={[styles.itemConfidence, { color: colors.text }]}> 
        <Text style={{ fontWeight: "bold" }}>Active:</Text> {item.isActive ? "Yes" : "No"}
      </Text>
      <TouchableOpacity
        style={styles.viewReportButton}
        onPress={() => navigation.navigate("Report", { result: item })}
        accessibilityLabel="View Medical Report"
      >
        <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
      </TouchableOpacity>
      <Ionicons name="chevron-forward" size={20} color={colors.text} style={styles.itemChevron} />
    </TouchableOpacity>
  )

  const allScanTypes = ["All", "cardiac", "skin", "eye", "vitals", "symptom"]

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Cardiac Scan Confidence Trends</Text>
        {cardiacHistory.length > 0 ? (
          <LineChart
            data={chartData}
            width={width - 60} // from padding 20 on each side + card padding
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="analytics-outline" size={60} color={colors.text} style={{ opacity: 0.5 }} />
            <Text style={[styles.noDataText, { color: colors.text }]}>
              Perform cardiac scans to see your health trends here!
            </Text>
          </View>
        )}
      </Card>

      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Past Scans</Text>
        <View style={styles.filterContainer}>
          <Text style={[styles.filterLabel, { color: colors.text }]}>Filter by Scan Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterButtons}>
            {allScanTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: filterScanType === type ? Colors.primary : colors.background,
                    borderColor: filterScanType === type ? Colors.primary : colors.borderColorLight,
                  },
                ]}
                onPress={() => setFilterScanType(type)}
                accessibilityLabel={`Filter by ${getScanTypeName(type)}`}
              >
                <Text
                  style={[styles.filterButtonText, { color: filterScanType === type ? Colors.textLight : colors.text }]}
                >
                  {type === "All" ? "All" : getScanTypeName(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredHistory.length === 0 ? (
          <View style={styles.noHistoryContainer}>
            <Ionicons name="folder-open-outline" size={60} color={colors.text} style={{ opacity: 0.5 }} />
            <Text style={[styles.noHistoryText, { color: colors.text }]}>
              No scans found. Start your first health analysis!
            </Text>
            <TouchableOpacity
              style={[styles.recordNowButton, { backgroundColor: Colors.primary }]}
              onPress={() => navigation.navigate("Scan")} // Navigate to ScanSelectionScreen
              accessibilityLabel="Start a new scan"
            >
              <Text style={styles.recordNowButtonText}>Start New Scan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
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
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 10,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  filterButtons: {
    paddingRight: 10, // To allow scrolling
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  flatListContent: {
    paddingBottom: 10,
  },
  historyItem: {
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemType: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: "bold",
  },
  urgencyBadge: {
    position: "absolute",
    top: 18,
    right: 85, // Adjusted to make space for the new button
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  urgencyText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: "bold",
  },
  itemDiagnosis: {
    fontSize: 17,
    marginBottom: 5,
  },
  itemConfidence: {
    fontSize: 15,
    opacity: 0.8,
  },
  itemChevron: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  viewReportButton: {
    position: "absolute",
    right: 50, // Position next to chevron
    top: "50%",
    transform: [{ translateY: -10 }],
    padding: 5, // Make clickable area larger
  },
  noHistoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  noHistoryText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  recordNowButton: {
    marginTop: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  recordNowButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default MedicalHistoryScreen
