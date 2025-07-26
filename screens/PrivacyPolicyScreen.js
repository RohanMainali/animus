"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useTheme } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"

const PrivacyPolicyScreen = ({ navigation }) => {
  const { colors } = useTheme()

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Privacy Policy</Text>
      <Text style={[styles.pageSubtitle, { color: colors.text }]}>
        Your privacy is important to us. This policy explains how we handle your data.
      </Text>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Information We Collect</Text>
        <Text style={[styles.policyText, { color: colors.text }]}>
          We collect information you provide directly to us, such as your name, email address, and any health data you
          input or record through the app (e.g., heartbeat recordings, diagnoses, goals, reminders). We also collect
          technical data like device information and usage statistics to improve app performance.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>2. How We Use Your Information</Text>
        <Text style={[styles.policyText, { color: colors.text }]}>
          Your data is used to provide, maintain, and improve the Animus app's features, including heartbeat analysis,
          personalized insights, and reminders. We may use aggregated, anonymized data for research and development
          purposes. We do not sell your personal data to third parties.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>3. Data Security</Text>
        <Text style={[styles.policyText, { color: colors.text }]}>
          We implement reasonable security measures to protect your information from unauthorized access, alteration,
          disclosure, or destruction. However, no internet or mobile transmission is 100% secure.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>4. Your Choices</Text>
        <Text style={[styles.policyText, { color: colors.text }]}>
          You can review and update your profile information through the app settings. You can also delete your account
          and associated data by contacting support.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>5. Changes to This Policy</Text>
        <Text style={[styles.policyText, { color: colors.text }]}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </Text>

        <Text style={[styles.policyText, { color: colors.text, marginTop: 20, fontStyle: "italic" }]}>
          Last updated: July 25, 2025
        </Text>
      </Card>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: Colors.primary }]}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        <Text style={styles.backButtonText}>Back to Settings</Text>
      </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  policyText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 20,
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

export default PrivacyPolicyScreen
