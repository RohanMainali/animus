"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native"
import { useTheme } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"

const SupportScreen = () => {
  const { colors } = useTheme()

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err))
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Help & Support</Text>
      <Text style={[styles.pageSubtitle, { color: colors.text }]}>
        Find answers to common questions or get in touch with our support team.
      </Text>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
        <View style={[styles.faqItem, { borderBottomColor: colors.borderColorLight }]}>
          <Text style={[styles.faqQuestion, { color: colors.text }]}>How do I record my heartbeat?</Text>
          <Text style={[styles.faqAnswer, { color: colors.text }]}>
            Navigate to the "Record Beat" tab, place your phone's microphone firmly on your chest, and tap the record
            button. Ensure you are in a quiet environment.
          </Text>
        </View>
        <View style={[styles.faqItem, { borderBottomColor: colors.borderColorLight }]}>
          <Text style={[styles.faqQuestion, { color: colors.text }]}>What do the analysis results mean?</Text>
          <Text style={[styles.faqAnswer, { color: colors.text }]}>
            The app provides a diagnosis, confidence score, and urgency level. You can also use the "Ask Animus" chat
            for AI-powered explanations of medical terms and lifestyle suggestions.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={[styles.faqQuestion, { color: colors.text }]}>Is Animus a substitute for medical advice?</Text>
          <Text style={[styles.faqAnswer, { color: Colors.accentRed, fontWeight: "bold" }]}>
            No. Animus is a health monitoring tool and should not replace professional medical advice, diagnosis, or
            treatment. Always consult with a qualified healthcare provider for any health concerns.
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: Colors.primary }]}
          onPress={() => handleLinkPress("mailto:support@animusapp.com")}
          accessibilityLabel="Email support"
        >
          <Ionicons name="mail-outline" size={24} color={Colors.textLight} />
          <Text style={styles.contactButtonText}>Email Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: Colors.secondary }]}
          onPress={() => handleLinkPress("tel:+1234567890")}
          accessibilityLabel="Call support"
        >
          <Ionicons name="call-outline" size={24} color={Colors.textLight} />
          <Text style={styles.contactButtonText}>Call Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: Colors.accentGreen }]}
          onPress={() => handleLinkPress("https://www.animusapp.com/faq")}
          accessibilityLabel="Visit FAQ website"
        >
          <Ionicons name="globe-outline" size={24} color={Colors.textLight} />
          <Text style={styles.contactButtonText}>Visit Our Website</Text>
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
  faqItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  contactButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
})

export default SupportScreen
