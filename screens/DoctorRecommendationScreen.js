"use client"

import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"
import { useEffect, useMemo, useState } from "react"
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../constants/colors"
import { mockDoctors as importedMockDoctors, assignDoctors } from "../constants/mockData"

const DoctorRecommendationScreen = ({ route, navigation }) => {

  const { colors } = useTheme()
  const { result } = route.params
  const { llmResponse } = result

  // Default topConditions to [] if undefined
  const { urgency, topConditions: rawTopConditions = [] } = llmResponse

  // Memoize topConditions to avoid infinite loop
  const topConditions = useMemo(() => rawTopConditions, [JSON.stringify(rawTopConditions)])

  // Add recommendedDoctors state
  const [recommendedDoctors, setRecommendedDoctors] = useState([])

  const mockDoctors = useMemo(() => importedMockDoctors, [])

  useEffect(() => {
    // Gather all possible conditions
    let conditions = [];
    if (topConditions && topConditions.length > 0) {
      conditions = topConditions;
    } else {
      const fallbackCond = result?.scanData?.diagnosis || result?.scanData?.symptoms;
      if (fallbackCond) conditions = [fallbackCond];
    }
    const doctors = assignDoctors({ conditions, urgency });
    setRecommendedDoctors(doctors);
  }, [urgency, topConditions, result]);

  const handleBookAppointment = (doctorName) => {
    Alert.alert(
      "Appointment Booking",
      `A mock appointment request has been sent for ${doctorName}. You will be contacted shortly to confirm.`,
      [{ text: "OK" }],
      { cancelable: true },
    )
  }

  const renderStarRating = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={18}
          color={Colors.primary}
          style={styles.starIcon}
        />,
      )
    }
    return <View style={styles.starRatingContainer}>{stars}</View>
  }

  const Card = ({ children, style }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
      {children}
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Find a Doctor</Text>
        <Text style={[styles.pageSubtitle, { color: colors.text }]}>
          Based on your recent scan ({result.scanData.diagnosis || result.scanData.symptoms}, Urgency: {urgency}), here
          are some recommended healthcare professionals.
        </Text>
      </Card>

      {recommendedDoctors.length === 0 ? (
        <Card style={styles.noDoctorsCard}>
          <Ionicons name="sad-outline" size={50} color={colors.text} style={{ opacity: 0.5 }} />
          <Text style={[styles.noDoctorsText, { color: colors.text }]}>
            No specific doctor recommendations found for your condition at this time. Please consult a general
            physician.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: Colors.primary }]}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>Back to Results</Text>
          </TouchableOpacity>
        </Card>
      ) : (
        <FlatList
          data={recommendedDoctors}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Disable FlatList scrolling inside ScrollView
          renderItem={({ item: doctor }) => (
            <Card style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
                <Image source={{ uri: doctor.imageUrl }} style={styles.doctorImage} />
                <View style={styles.doctorInfo}>
                  <Text style={[styles.doctorName, { color: colors.text }]}>Dr. {doctor.name}</Text>
                  <Text style={[styles.doctorSpecialization, { color: colors.text }]}>{doctor.specialization}</Text>
                  <View style={styles.ratingRow}>
                    {renderStarRating(doctor.rating)}
                    <Text style={[styles.reviewCount, { color: colors.text }]}>({doctor.reviews} Reviews)</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.doctorBio, { color: colors.text }]}>{doctor.bio}</Text>
              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Ionicons name="location-outline" size={18} color={colors.text} />
                  <Text style={[styles.contactText, { color: colors.text }]}>{doctor.address}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={18} color={colors.text} />
                  <Text style={[styles.contactText, { color: colors.text }]}>{doctor.phone}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.bookButton, { backgroundColor: Colors.accentGreen }]}
                onPress={() => handleBookAppointment(doctor.name)}
                accessibilityLabel={`Book appointment with Dr. ${doctor.name}`}
              >
                <Ionicons name="calendar-outline" size={20} color={Colors.textLight} />
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </Card>
          )}
        />
      )}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: Colors.secondary }]}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back to results"
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        <Text style={styles.backButtonText}>Back to Results</Text>
      </TouchableOpacity>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  pageSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    opacity: 0.8,
    lineHeight: 24,
  },
  doctorCard: {
    marginBottom: 20,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  doctorSpecialization: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starRatingContainer: {
    flexDirection: "row",
    marginRight: 5,
  },
  starIcon: {
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  doctorBio: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: 15,
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    marginLeft: 10,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  bookButtonText: {
    color: Colors.textLight,
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
  noDoctorsCard: {
    alignItems: "center",
    paddingVertical: 50,
  },
  noDoctorsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 30,
    marginTop: 20,
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

export default DoctorRecommendationScreen
