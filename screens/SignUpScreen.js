"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { Colors } from "../constants/colors"
import { signup as signupApi } from "../utils/api"

const SignUpScreen = ({ navigation, setLoggedIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Sign Up Error", "Please fill in all fields.")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Sign Up Error", "Passwords do not match.")
      return
    }
    if (password.length < 6) {
      Alert.alert("Sign Up Error", "Password must be at least 6 characters long.")
      return
    }

    setIsLoading(true)
    try {
      const response = await signupApi("New Animus User", email, password)
      console.log('Signup response:', response)
      if (response.message && response.message.includes("successfully")) {
        await AsyncStorage.setItem("loggedIn", "true")
        await AsyncStorage.setItem("userName", "New Animus User")
        await AsyncStorage.setItem("userEmail", email)
        setLoggedIn(true)
        Alert.alert("Success", "Account created successfully! You are now logged in.")
      } else {
        let errorMsg = response.message || "Could not create account."
        if (response.error) {
          errorMsg += `\nError: ${JSON.stringify(response.error)}`
        }
        Alert.alert("Sign Up Error", errorMsg)
      }
    } catch (error) {
      console.log('Signup error:', error)
      Alert.alert("Sign Up Error", `Something went wrong.\n${error?.message || error}`)
    }
    setIsLoading(false)
  }

  return (
    <LinearGradient colors={[Colors.primary, Colors.gradientEnd]} style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image
            source={{ uri: "/placeholder.svg?height=120&width=120" }}
            style={styles.logo}
            accessibilityLabel="Animus app logo"
          />
          <Text style={styles.title}>Join Animus</Text>
          <Text style={styles.subtitle}>Create your account to start monitoring your heart health.</Text>

          <View style={styles.inputGroup}>
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
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.textDark + "80"}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={Colors.textDark + "80"}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUp}
            disabled={isLoading}
            accessibilityLabel="Sign up"
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textLight} />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              disabled={isLoading}
              accessibilityLabel="Log in"
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
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
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    tintColor: Colors.textLight,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.textLight,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textLight,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 40,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
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
  signupButton: {
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
  signupButtonText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: Colors.textLight,
    fontSize: 16,
    marginRight: 5,
  },
  loginButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})

export default SignUpScreen
