import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../constants/colors";
import { createMedicalReportAnalysis } from "../utils/medicalReportApi";
import { uploadImageToImgBB } from "../utils/uploadImage";

const IMGBB_API_KEY = "1d214f9e52b271e1f9f3e8e1ac83eaf5"; // Replace with your real key

const MedicalReportScanScreen = ({ navigation, addHistoryEntry }) => {
  const { colors } = useTheme();
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Camera permission is needed to take photos for report analysis. Please enable it in your device settings."
          );
        }
      }
    })();
  }, []);

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  );

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please take a photo or select an image to analyze.");
      return;
    }
    setIsLoading(true);
    try {
      let hostedImageUrl = null;
      try {
        hostedImageUrl = await uploadImageToImgBB(imageUri, IMGBB_API_KEY);
        if (!hostedImageUrl) throw new Error("Image upload failed: No URL returned");
      } catch (uploadErr) {
        console.error("Image upload error:", uploadErr);
        Alert.alert("Image Upload Error", uploadErr.message || "Failed to upload image.");
        setIsLoading(false);
        return;
      }
      const token = await AsyncStorage.getItem("token");
      let response = null;
      try {
        response = await createMedicalReportAnalysis({ imageUrl: hostedImageUrl, userContext }, token);
        console.log("Backend response:", response);
      } catch (apiErr) {
        console.error("Backend API error:", apiErr);
        Alert.alert("Backend Error", apiErr.message || "Failed to analyze report.");
        setIsLoading(false);
        return;
      }
      if (response && response.short_summary) {
        const newEntry = {
          id: response._id || Date.now().toString(),
          date: response.date || new Date().toISOString(),
          scanType: "medical_report",
          scanData: {
            imageUrl: hostedImageUrl,
            short_summary: response.short_summary,
            analysis: response.analysis,
            confidence: response.confidence,
            scan_details: response.scan_details,
            insights: response.insights,
            userContext,
          },
          llmResponse: response,
        };
        if (typeof addHistoryEntry === "function") {
          addHistoryEntry(newEntry);
        }
        navigation.navigate("Results", { result: newEntry });
      } else {
        Alert.alert("Analysis Error", response?.error || "Failed to analyze report.");
      }
    } catch (error) {
      console.error("Report analysis failed", error);
      Alert.alert("Upload/Analysis Error", error.message || "Failed to analyze report. Please try again.");
    } finally {
      setIsLoading(false);
      setImageUri(null);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Medical Report Analyzer</Text>
        <Text style={[styles.guideText, { color: colors.text }]}>Upload a photo of your blood, lab, or other medical report to get an AI-powered summary and recommendations.</Text>
        <TextInput
          style={[styles.contextInput, { color: colors.text, borderColor: colors.borderColorLight }]}
          placeholder="Add a note (e.g. 'CBC', 'liver function', 'abnormal value', etc.)"
          placeholderTextColor={colors.text + "80"}
          value={userContext}
          onChangeText={setUserContext}
          editable={!isLoading}
          multiline
          numberOfLines={2}
        />
        <View style={styles.imagePreviewContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} accessibilityLabel="Report to analyze" />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.background }]}> 
              <Ionicons name="document-attach-outline" size={60} color={colors.text} style={{ opacity: 0.5 }} />
              <Text style={[styles.placeholderText, { color: colors.text }]}>No image selected</Text>
            </View>
          )}
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors.primary }]}
            onPress={takePhoto}
            disabled={isLoading}
            accessibilityLabel="Take photo"
          >
            <Ionicons name="camera-outline" size={24} color={Colors.textLight} />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
            onPress={pickImage}
            disabled={isLoading}
            accessibilityLabel="Choose from gallery"
          >
            <Ionicons name="image-outline" size={24} color={Colors.textLight} />
            <Text style={styles.actionButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.analyzeButton, { backgroundColor: imageUri ? Colors.accentGreen : colors.borderColorLight }]}
          onPress={handleAnalyze}
          disabled={!imageUri || isLoading}
          accessibilityLabel="Analyze report"
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.textLight} size="small" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze Report</Text>
          )}
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

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
    marginBottom: 20,
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
  contextInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    minHeight: 40,
    backgroundColor: "#f7f7f7",
  },
  imagePreviewContainer: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.borderColorLight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  actionButton: {
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
  actionButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
});

export default MedicalReportScanScreen;
