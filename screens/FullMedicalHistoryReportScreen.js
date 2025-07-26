"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useTheme } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"

const FullMedicalHistoryReportScreen = ({ route }) => {
  const { colors } = useTheme()
  const { history } = route.params // The full history array

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
      "Download Full History",
      "This feature is under development. A PDF of your complete medical history would be downloaded here.",
      [{ text: "OK" }],
    )
    // In a real app, you'd generate a comprehensive PDF from the entire history data.
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Complete Medical History</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          A comprehensive overview of all your health scans and analyses.
        </Text>

        {history.length === 0 ? (
          <View style={styles.noHistoryContainer}>
            <Ionicons name="folder-open-outline" size={60} color={colors.text} style={{ opacity: 0.5 }} />
            <Text style={[styles.noHistoryText, { color: colors.text }]}>No history available to generate report.</Text>
          </View>
        ) : (
          history.map((item, index) => (
            <View key={item.id} style={[styles.historyItem, { borderBottomColor: colors.borderColorLight }]}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemDate, { color: colors.text }]}>{item.date}</Text>
                <Text style={[styles.itemTime, { color: colors.text }]}>{item.time}</Text>
              </View>
              <Text style={[styles.itemScanType, { color: colors.text }]}>
                <Text style={{ fontWeight: "bold" }}>Scan Type:</Text> {getScanTypeName(item.scanType)}
              </Text>
              <Text style={[styles.itemDiagnosis, { color: colors.text }]}>
                <Text style={{ fontWeight: "bold" }}>Finding:</Text>{" "}
                {item.scanData.diagnosis || item.scanData.symptoms || "N/A"}
              </Text>
              <Text style={[styles.itemSummary, { color: colors.text }]}>
                <Text style={{ fontWeight: "bold" }}>Summary:</Text> {item.llmResponse.summary}
              </Text>
              <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.llmResponse.urgency) }]}>
                <Text style={styles.urgencyText}>Criticality: {item.llmResponse.urgency}</Text>
              </View>
              {index < history.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}

        <TouchableOpacity
          style={[styles.downloadButton, { backgroundColor: Colors.primary }]}
          onPress={handleDownloadPDF}
          accessibilityLabel="Download full medical history as PDF"
        >
          <Ionicons name="download" size={20} color={Colors.textLight} />
          <Text style={styles.downloadButtonText}>Download Full History (PDF)</Text>
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
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    opacity: 0.8,
  },
  historyItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemTime: {
    fontSize: 16,
    opacity: 0.7,
  },
  itemScanType: {
    fontSize: 17,
    marginBottom: 5,
  },
  itemDiagnosis: {
    fontSize: 17,
    marginBottom: 5,
  },
  itemSummary: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  urgencyBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  urgencyText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderColorLight,
    marginTop: 20,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 30,
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
  noHistoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  noHistoryText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 15,
    opacity: 0.7,
    paddingHorizontal: 20,
  },
})

export default FullMedicalHistoryReportScreen
