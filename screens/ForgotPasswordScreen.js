"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetInitiated, setResetInitiated] = useState(false)

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.")
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.")
      return
    }

    setIsLoading(true)
    // Mock password reset logic
    setTimeout(() => {
      setResetInitiated(true)
      Alert.alert(
        "Password Reset Initiated",
        `If an account with ${email} exists, a password reset link has been sent to your email. Please check your inbox (and spam folder).`,
      )
      setIsLoading(false)
      // In a real app, you might navigate back to login or a confirmation screen here
    }, 2000) // Simulate API call
  }

  return (
    <LinearGradient colors={[Colors.primary, Colors.gradientEnd]} style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Ionicons name="lock-closed-outline" size={100} color={Colors.textLight} style={styles.icon} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address below and we'll send you a link to reset your password.
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.textDark + "80"}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading && !resetInitiated}
            />
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={isLoading || resetInitiated}
            accessibilityLabel="Reset password"
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textLight} />
            ) : (
              <Text style={styles.resetButtonText}>{resetInitiated ? "Link Sent!" : "Reset Password"}</Text>
            )}
          </TouchableOpacity>

          {resetInitiated && (
            <Text style={styles.confirmationText}>
              Please check your email for further instructions. You can close this screen and return to login.
            </Text>
          )}

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
            accessibilityLabel="Back to login"
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textLight,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 30,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: Colors.textDark,
  },
  resetButton: {
    backgroundColor: Colors.textLight,
    paddingVertical: 18,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 20,
  },
  resetButtonText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  confirmationText: {
    color: Colors.textLight,
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  backToLoginButton: {
    marginTop: 10,
  },
  backToLoginText: {
    color: Colors.textLight,
    fontSize: 16,
    opacity: 0.9,
    textDecorationLine: "underline",
  },
})

export default ForgotPasswordScreen
