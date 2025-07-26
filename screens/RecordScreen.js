"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Animated,
} from "react-native"
import { Audio } from "expo-av"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import { useTheme } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"
import { analyzeHeartbeat } from "../utils/mockApi"
import AsyncStorage from "@react-native-async-storage/async-storage" // Import AsyncStorage

const RecordScreen = ({ navigation, addHistoryEntry, isDarkMode }) => {
  const { colors } = useTheme()
  const [recording, setRecording] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedUri, setRecordedUri] = useState(null)
  const [playbackObject, setPlaybackObject] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const pulseAnim = useRef(new Animated.Value(1)).current // For pulse animation
  const recordingTimer = useRef(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (isRecording) {
      pulseAnimation()
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
      if (playbackObject) {
        playbackObject.unloadAsync()
      }
    }
  }, [isRecording, playbackObject])

  const pulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  const getMicrophonePermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Microphone permission is needed to record heartbeats. Please enable it in your device settings.",
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
        interruptionModeIOS: Audio.InterruptioNModeIOS.DuckOthers,
        playsInSilentModeAndroid: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.InterruptioNModeAndroid.DuckOthers,
        // For Android, ensure the audio input is from the microphone
        // This might require more specific configuration depending on the device
        // For simplicity, we rely on default behavior for now.
      })
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      setRecording(recording)
      setIsRecording(true)
      setRecordedUri(null)
      setIsPlaying(false)
      if (playbackObject) {
        playbackObject.unloadAsync()
        setPlaybackObject(null)
      }
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
    } catch (error) {
      console.error("Failed to stop recording", error)
      Alert.alert("Recording Error", "Could not stop recording. Please try again.")
    }
  }

  const playRecording = async () => {
    if (!recordedUri) return
    try {
      if (playbackObject) {
        await playbackObject.unloadAsync()
      }
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri }, { shouldPlay: true })
      setPlaybackObject(sound)
      setIsPlaying(true)
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false)
        }
      })
    } catch (error) {
      console.error("Failed to play recording", error)
      Alert.alert("Playback Error", "Could not play recording. Please try again.")
    }
  }

  const resetRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync()
    }
    if (playbackObject) {
      playbackObject.unloadAsync()
    }
    setRecording(null)
    setIsRecording(false)
    setRecordedUri(null)
    setPlaybackObject(null)
    setIsPlaying(false)
  }

  const pickAudioFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Audio,
      allowsEditing: false,
      quality: 1,
    })

    if (!result.canceled) {
      setRecordedUri(result.assets[0].uri)
      setIsRecording(false)
      if (recording) {
        await recording.stopAndUnloadAsync()
        setRecording(null)
      }
      if (playbackObject) {
        playbackObject.unloadAsync()
        setPlaybackObject(null)
      }
    }
  }

  // Function to update recording streak and count
  const updateRecordingMetrics = async () => {
    try {
      const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
      const lastRecordingDate = await AsyncStorage.getItem("lastRecordingDate")
      let currentStreak = Number.parseInt((await AsyncStorage.getItem("recordingStreak")) || "0")
      let totalRecordings = Number.parseInt((await AsyncStorage.getItem("totalRecordings")) || "0")

      if (lastRecordingDate === today) {
        // Already recorded today, do nothing to streak
      } else if (lastRecordingDate) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toISOString().split("T")[0]

        if (lastRecordingDate === yesterdayString) {
          currentStreak += 1 // Continue streak
        } else {
          currentStreak = 1 // Reset streak
        }
      } else {
        currentStreak = 1 // First recording
      }

      totalRecordings += 1

      await AsyncStorage.setItem("lastRecordingDate", today)
      await AsyncStorage.setItem("recordingStreak", currentStreak.toString())
      await AsyncStorage.setItem("totalRecordings", totalRecordings.toString())

      console.log(`Recording metrics updated: Streak ${currentStreak}, Total ${totalRecordings}`)
    } catch (e) {
      console.error("Failed to update recording metrics:", e)
    }
  }

  const handleAnalyze = async () => {
    if (!recordedUri) {
      Alert.alert("No Audio", "Please record or upload a heartbeat sound first to analyze.")
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would send the audio file to a backend for ML inference.
      // The backend would return the diagnosis, confidence, and audio features.
      // Real-time waveform visualization during recording would require complex native module integration.
      const result = await analyzeHeartbeat(recordedUri)
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        audioUri: recordedUri,
        ...result,
      }
      addHistoryEntry(newEntry)
      await updateRecordingMetrics() // Update streak and count
      navigation.navigate("Results", { result: newEntry })
    } catch (error) {
      console.error("Analysis failed", error)
      Alert.alert("Analysis Error", "Failed to analyze heartbeat. Please try again.")
    } finally {
      setIsLoading(false)
      resetRecording() // Reset after analysis attempt
    }
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Capture Your Heartbeat</Text>
        <Text style={[styles.guideText, { color: colors.text }]}>
          For best results, find a quiet place and place your phone's microphone firmly against your chest, near your
          heart.
        </Text>
        <Image
          source={{ uri: "/placeholder.svg?height=200&width=300" }}
          style={styles.guideImage}
          accessibilityLabel="Illustration of phone placed on chest for heartbeat recording"
        />

        <View style={styles.recordingControls}>
          {isRecording ? (
            <View style={styles.recordingActive}>
              <Animated.View style={[styles.recordButtonOuter, { transform: [{ scale: pulseAnim }] }]}>
                <TouchableOpacity
                  style={[styles.recordButton, { backgroundColor: Colors.accentRed }]}
                  onPress={stopRecording}
                  disabled={isLoading}
                  accessibilityLabel="Stop recording"
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
              accessibilityLabel="Start recording"
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
                accessibilityLabel={isPlaying ? "Pause playback" : "Play recording"}
              >
                <Ionicons name={isPlaying ? "pause" : "play"} size={24} color={Colors.textLight} />
                <Text style={styles.playbackButtonText}>{isPlaying ? "Pause" : "Play"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.playbackButton, { backgroundColor: Colors.secondary }]}
                onPress={resetRecording}
                disabled={isLoading}
                accessibilityLabel="Reset recording"
              >
                <Ionicons name="refresh" size={24} color={Colors.textLight} />
                <Text style={styles.playbackButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <Text style={[styles.uploadTitle, { color: colors.text }]}>Or Upload an Audio File</Text>
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: Colors.secondary }]}
          onPress={pickAudioFile}
          disabled={isLoading || isRecording}
          accessibilityLabel="Upload audio file"
        >
          <Ionicons name="cloud-upload" size={24} color={Colors.textLight} />
          <Text style={styles.uploadButtonText}>Choose File</Text>
        </TouchableOpacity>

        {recordedUri && (
          <View style={[styles.audioPreview, { borderColor: colors.borderColorLight }]}>
            <Ionicons name="musical-notes" size={20} color={colors.text} />
            <Text style={[styles.audioPreviewText, { color: colors.text }]}>
              {recordedUri.split("/").pop().substring(0, 30)}...
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.analyzeButton,
            { backgroundColor: recordedUri ? Colors.accentGreen : colors.borderColorLight },
          ]}
          onPress={handleAnalyze}
          disabled={!recordedUri || isLoading}
          accessibilityLabel="Analyze heartbeat"
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.textLight} size="small" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze Heartbeat</Text>
          )}
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
  guideImage: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    resizeMode: "cover",
    marginBottom: 30,
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
    backgroundColor: Colors.accentRed + "30", // Light halo effect
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
  uploadTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 10,
  },
  audioPreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: Colors.backgroundLight, // Lighter background for preview
  },
  audioPreviewText: {
    fontSize: 14,
    fontStyle: "italic",
    marginLeft: 10,
    flexShrink: 1,
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

export default RecordScreen
