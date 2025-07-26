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
import { login as loginApi } from "../utils/api"

const LoginScreen = ({ navigation, setLoggedIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Login Error", "Please enter both email and password.")
      return
    }

    setIsLoading(true)
    try {
      const response = await loginApi(email, password)
      if (response.token) {
        await AsyncStorage.setItem("loggedIn", "true")
        await AsyncStorage.setItem("userName", response.user.name)
        await AsyncStorage.setItem("userEmail", response.user.email)
        await AsyncStorage.setItem("token", response.token)
        setLoggedIn(true)
        Alert.alert("Success", "Logged in successfully!")
      } else {
        Alert.alert("Login Failed", response.message || "Invalid email or password.")
      }
    } catch (error) {
      Alert.alert("Login Error", "Something went wrong. Please try again.")
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue your heart health journey.</Text>

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
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityLabel="Log in"
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textLight} />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate("ForgotPassword")} // Navigate to new screen
            disabled={isLoading}
            accessibilityLabel="Forgot password"
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              disabled={isLoading}
              accessibilityLabel="Sign up"
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
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
  loginButton: {
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
  loginButtonText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  forgotPasswordButton: {
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: Colors.textLight,
    fontSize: 16,
    opacity: 0.9,
    textDecorationLine: "underline",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupText: {
    color: Colors.textLight,
    fontSize: 16,
    marginRight: 5,
  },
  signupButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})

export default LoginScreen
