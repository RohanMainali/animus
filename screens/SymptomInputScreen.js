"use client"

import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"
import { Audio } from "expo-av"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Colors } from "../constants/colors"
import { createSymptomReport } from "../utils/symptomApi"
import { transcribeAudioFile } from '../utils/speechToText'

const SymptomInputScreen = ({ navigation, addHistoryEntry }) => {
  const { colors } = useTheme()
  const [symptoms, setSymptoms] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState(null)
  const [recordedUri, setRecordedUri] = useState(null)
  const [playbackObject, setPlaybackObject] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const recordingTimer = useRef(null)

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start()
      recordingTimer.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } else {
      pulseAnim.stopAnimation()
      clearInterval(recordingTimer.current)
      setElapsedTime(0)
    }
    return () => {
      clearInterval(recordingTimer.current)
      if (playbackObject) playbackObject.unloadAsync()
    }
  }, [isRecording, playbackObject])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  const getMicrophonePermission = async () => {
    const { status } = await Audio.requestPermissionsAsync()
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Microphone permission is needed to record symptoms. Please enable it in your device settings."
      )
      return false
    }
    return true
  }

  const startRecording = async () => {
    const hasPermission = await getMicrophonePermission()
    if (!hasPermission) return
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playsInSilentModeAndroid: true,
        shouldDuckAndroid: true,
      })
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      setRecording(recording)
      setIsRecording(true)
      setRecordedUri(null)
      setIsPlaying(false)
      if (playbackObject) playbackObject.unloadAsync()
    } catch (err) {
      console.error("Failed to start recording", err)
      Alert.alert("Recording Error", "Could not start recording. Please ensure no other app is using the microphone.")
    }
  }

  const stopRecording = async () => {
    setIsRecording(false)
    try {
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      setRecordedUri(uri)
      setRecording(null)
      // Auto-transcribe after recording stops
      setIsLoading(true)
      try {
        const transcript = await transcribeAudioFile(uri)
        setSymptoms(transcript)
      } catch (err) {
        // Optionally handle error, but do not show popup
        console.error("Transcription Error", err)
      } finally {
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Failed to stop recording", error)
      Alert.alert("Recording Error", "Could not stop recording. Please try again.")
    }
  }

  const playRecording = async () => {
    if (!recordedUri) return
    try {
      if (playbackObject) await playbackObject.unloadAsync()
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri }, { shouldPlay: true })
      setPlaybackObject(sound)
      setIsPlaying(true)
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setIsPlaying(false)
      })
    } catch (error) {
      console.error("Failed to play recording", error)
      Alert.alert("Playback Error", "Could not play recording. Please try again.")
    }
  }

  const resetRecording = async () => {
    if (recording) await recording.stopAndUnloadAsync()
    if (playbackObject) playbackObject.unloadAsync()
    setRecording(null)
    setIsRecording(false)
    setRecordedUri(null)
    setPlaybackObject(null)
    setIsPlaying(false)
  }

  const handleTranscribe = async () => {
    if (!recordedUri) {
      Alert.alert("No Audio", "Please record a voice note first to transcribe.")
      return
    }
    setIsLoading(true)
    try {
      const transcript = await transcribeAudioFile(recordedUri)
      setSymptoms(transcript)
      // No popup on completion
    } catch (err) {
      Alert.alert("Transcription Error", err.message || 'Could not transcribe audio.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      Alert.alert("No Symptoms", "Please describe your symptoms to get an analysis.")
      return
    }
    setIsLoading(true)
    try {
      const token = await AsyncStorage.getItem("token")
      const response = await createSymptomReport({ symptoms: symptoms.trim() }, token)
      if (response && response.analysis) {
        const newEntry = {
          id: response._id || Date.now().toString(),
          date: response.date || new Date().toISOString(),
          scanType: "symptom",
          scanData: {
            symptoms: response.symptoms,
            analysis: response.analysis,
            confidence: response.confidence,
            scan_details: response.scan_details,
            insights: response.insights,
          },
          llmResponse: response,
        }
        if (typeof addHistoryEntry === "function") addHistoryEntry(newEntry)
        navigation.navigate("Results", { result: newEntry })
      } else {
        Alert.alert("Analysis Error", response.analysis || "Failed to analyze symptoms.")
      }
    } catch (error) {
      console.error("Symptom analysis failed", error)
      Alert.alert("Analysis Error", "Failed to analyze symptoms. Please try again.")
    } finally {
      setIsLoading(false)
      setSymptoms("")
    }
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Symptom Checker</Text>
          <Text style={[styles.guideText, { color: colors.text }]}>Describe your symptoms in detail, or record your voice for instant transcription.</Text>

          <View style={styles.recordingControls}>
            {isRecording ? (
              <View style={styles.recordingActive}>
                <Animated.View style={[styles.recordButtonOuter, { transform: [{ scale: pulseAnim }] }]}>
                  <TouchableOpacity
                    style={[styles.recordButton, { backgroundColor: Colors.accentRed }]}
                    onPress={stopRecording}
                    disabled={isLoading}
                  >
                    <Ionicons name="stop" size={35} color={Colors.textLight} />
                  </TouchableOpacity>
                </Animated.View>
                <Text style={[styles.recordingStatusText, { color: Colors.accentRed }]}>Recording...</Text>
                <Text style={[styles.timerText, { color: colors.text }]}>{formatTime(elapsedTime)}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.recordButtonLarge, { backgroundColor: Colors.primary }]}
                onPress={startRecording}
                disabled={isLoading || recordedUri !== null}
              >
                <Ionicons name="mic" size={40} color={Colors.textLight} />
                <Text style={styles.recordButtonText}>Record</Text>
              </TouchableOpacity>
            )}

            {recordedUri && !isRecording && (
              <View style={styles.playbackControls}>
                <TouchableOpacity
                  style={[styles.playbackButton, { backgroundColor: isPlaying ? Colors.secondary : Colors.primary }]}
                  onPress={playRecording}
                  disabled={isLoading}
                >
                  <Ionicons name={isPlaying ? "pause" : "play"} size={24} color={Colors.textLight} />
                  <Text style={styles.playbackButtonText}>{isPlaying ? "Pause" : "Play"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.playbackButton, { backgroundColor: Colors.secondary }]}
                  onPress={resetRecording}
                  disabled={isLoading}
                >
                  <Ionicons name="refresh" size={24} color={Colors.textLight} />
                  <Text style={styles.playbackButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={[styles.inputLabel, { color: colors.text }]}>Describe Your Symptoms</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color={colors.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g., 'I have a persistent cough and feel tired.'"
              placeholderTextColor={colors.text + "80"}
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.analyzeButton,
              { backgroundColor: symptoms.trim() ? Colors.accentGreen : colors.borderColorLight },
            ]}
            onPress={handleAnalyze}
            disabled={!symptoms.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textLight} size="small" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze Symptoms</Text>
            )}
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
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
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  guideText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.85,
    lineHeight: 24,
  },
  recordingControls: {
    alignItems: "center",
    marginBottom: 30,
  },
  recordButtonLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  recordButtonText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  recordingActive: {
    alignItems: "center",
  },
  recordButtonOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accentRed + "30",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  recordingStatusText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  playbackControls: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-around",
  },
  playbackButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playbackButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderColorLight,
    marginVertical: 30,
    width: "80%",
    alignSelf: "center",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
    opacity: 0.7,
    marginTop: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: "top",
  },
  analyzeButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  analyzeButtonText: {
    color: Colors.textLight,
    fontSize: 20,
    fontWeight: "bold",
  },
})

export default SymptomInputScreen
