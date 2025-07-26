"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native"
import { useTheme } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "../constants/colors"

const BreathingScreen = () => {
  const { colors } = useTheme()
  const [isBreathing, setIsBreathing] = useState(false)
  const [phase, setPhase] = useState("Inhale") // Inhale, Hold, Exhale, Pause
  const [timer, setTimer] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)

  const breatheAnim = useRef(new Animated.Value(0)).current // 0 to 1 for scale
  const timerIntervalRef = useRef(null)
  const phaseTimeoutRef = useRef(null)

  const BREATH_PATTERN = [
    { phase: "Inhale", duration: 4 }, // seconds
    { phase: "Hold", duration: 7 },
    { phase: "Exhale", duration: 8 },
    { phase: "Pause", duration: 1 }, // Short pause before next cycle
  ]

  const startBreathingAnimation = () => {
    breatheAnim.setValue(0) // Reset animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: BREATH_PATTERN[0].duration * 1000, // Inhale
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.delay(BREATH_PATTERN[1].duration * 1000), // Hold
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: BREATH_PATTERN[2].duration * 1000, // Exhale
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.delay(BREATH_PATTERN[3].duration * 1000), // Pause
      ]),
    ).start()
  }

  const stopBreathingAnimation = () => {
    breatheAnim.stopAnimation()
    breatheAnim.setValue(0) // Reset to initial state
  }

  const startTimerAndPhases = () => {
    let currentPhaseIndex = 0
    let currentPhaseTime = 0
    const totalTime = 0

    const runPhase = () => {
      const { phase: currentPhaseName, duration: currentPhaseDuration } = BREATH_PATTERN[currentPhaseIndex]
      setPhase(currentPhaseName)
      setTimer(currentPhaseDuration)
      currentPhaseTime = currentPhaseDuration

      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current)
            currentPhaseIndex = (currentPhaseIndex + 1) % BREATH_PATTERN.length
            if (currentPhaseIndex === 0) {
              setCycleCount((prev) => prev + 1)
            }
            phaseTimeoutRef.current = setTimeout(runPhase, 100) // Small delay to ensure state updates
            return 0 // Reset timer for next phase
          }
          return prev - 1
        })
      }, 1000)
    }

    runPhase()
  }

  const stopTimerAndPhases = () => {
    clearInterval(timerIntervalRef.current)
    clearTimeout(phaseTimeoutRef.current)
    setTimer(0)
    setPhase("Ready")
    setCycleCount(0)
  }

  useEffect(() => {
    if (isBreathing) {
      startBreathingAnimation()
      startTimerAndPhases()
    } else {
      stopBreathingAnimation()
      stopTimerAndPhases()
    }

    return () => {
      stopBreathingAnimation()
      stopTimerAndPhases()
    }
  }, [isBreathing])

  const handleStartStop = () => {
    setIsBreathing((prev) => !prev)
  }

  const handleReset = () => {
    setIsBreathing(false)
    stopBreathingAnimation()
    stopTimerAndPhases()
  }

  const circleScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1], // Scale from 70% to 100%
  })

  const circleOpacity = breatheAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1, 0.6], // Fade in and out slightly
  })

  return (
    <LinearGradient colors={[Colors.primary, Colors.gradientEnd]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Guided Breathing</Text>
        <Text style={styles.subtitle}>Follow the circle to calm your mind and body.</Text>

        <View style={styles.breathingArea}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                backgroundColor: Colors.textLight,
                transform: [{ scale: circleScale }],
                opacity: circleOpacity,
              },
            ]}
          />
          <View style={styles.overlayTextContainer}>
            <Text style={styles.phaseText}>{isBreathing ? phase : "Ready"}</Text>
            {isBreathing && <Text style={styles.timerText}>{timer}</Text>}
          </View>
        </View>

        <Text style={styles.cycleCountText}>Cycles Completed: {cycleCount}</Text>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: isBreathing ? Colors.accentRed : Colors.accentGreen }]}
            onPress={handleStartStop}
            accessibilityLabel={isBreathing ? "Stop breathing exercise" : "Start breathing exercise"}
          >
            <Ionicons name={isBreathing ? "pause" : "play"} size={24} color={Colors.textLight} />
            <Text style={styles.controlButtonText}>{isBreathing ? "Stop" : "Start"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: Colors.secondary }]}
            onPress={handleReset}
            disabled={!isBreathing && timer === 0 && cycleCount === 0}
            accessibilityLabel="Reset breathing exercise"
          >
            <Ionicons name="refresh" size={24} color={Colors.textLight} />
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.textLight,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textLight,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 50,
  },
  breathingArea: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.primary + "50", // A subtle background for the animation area
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  breathingCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 125,
    position: "absolute",
  },
  overlayTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  phaseText: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.primary,
  },
  cycleCountText: {
    fontSize: 18,
    color: Colors.textLight,
    opacity: 0.8,
    marginBottom: 50,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  controlButtonText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
})

export default BreathingScreen
