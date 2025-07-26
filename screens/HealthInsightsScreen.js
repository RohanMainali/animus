"use client"

import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@react-navigation/native"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../constants/colors"

const healthArticles = [
	{
		id: "1",
		title: "Understanding Body Health Metrics",
		summary: "Learn about key indicators like vitals, skin, and eye health, and what they mean for your well-being.",
		image: "/placeholder.svg?height=150&width=250",
		content:
			"Monitoring your body's health metrics goes beyond just heart rate. Key indicators include blood pressure, pulse, blood oxygen, temperature, and visual assessments of skin and eyes. Understanding these metrics can provide early warnings for potential issues or confirm good health. For instance, consistent high blood pressure can indicate hypertension, while changes in skin appearance might point to dermatological conditions. Regular monitoring empowers you to make informed decisions about your lifestyle and seek professional advice when needed.",
	},
	{
		id: "2",
		title: "Holistic Wellness: Mind, Body, and Lifestyle",
		summary: "Discover how diet, exercise, stress management, and sleep contribute to overall health.",
		image: "/placeholder.svg?height=150&width=250",
		content:
			"True health is a balance of physical, mental, and emotional well-being. A balanced diet rich in nutrients fuels your body, while regular exercise strengthens muscles, improves cardiovascular health, and boosts mood. Stress management techniques like mindfulness and meditation are crucial for mental clarity and reducing the physical toll of stress. Adequate sleep is non-negotiable for repair and rejuvenation. By adopting healthy habits across these pillars, you can significantly enhance your overall quality of life and resilience.",
	},
	{
		id: "3",
		title: "AI in Health: Your Personal Health Guide",
		summary:
			"Explore how AI assists in monitoring symptoms, understanding conditions, and personalized health management.",
		image: "/placeholder.svg?height=150&width=250",
		content:
			"Artificial Intelligence is revolutionizing personal health management by providing powerful tools for monitoring, analysis, and guidance. AI-powered systems can help interpret scan results, identify patterns in your health data, and offer personalized insights. From symptom checkers that suggest possible conditions to virtual assistants that answer health-related questions, AI can serve as a valuable companion in your health journey. However, it's essential to remember that AI tools are for informational support and should always be complemented by professional medical consultation.",
	},
]

const HealthInsightsScreen = ({ navigation }) => {
	const { colors } = useTheme()

	const Card = ({ children, style }) => (
		<View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderColorLight }, style]}>
			{children}
		</View>
	)

	return (
		<ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
			<Text style={[styles.pageTitle, { color: colors.text }]}>Health Insights</Text>
			<Text style={[styles.pageSubtitle, { color: colors.text }]}>
				Explore articles and tips to better understand your overall health.
			</Text>

			{healthArticles.map((article) => (
				<Card key={article.id} style={styles.articleCard}>
					<Image
						source={{ uri: article.image }}
						style={styles.articleImage}
						accessibilityLabel={article.title + " illustration"}
					/>
					<View style={styles.articleContent}>
						<Text style={[styles.articleTitle, { color: colors.text }]}>{article.title}</Text>
						<Text style={[styles.articleSummary, { color: colors.text }]}>{article.summary}</Text>
						<TouchableOpacity
							style={[styles.readMoreButton, { backgroundColor: Colors.primary }]}
							onPress={() =>
								navigation.navigate("MainApp", {
									screen: "Chat",
									params: { initialPrompt: `Explain: ${article.title}.` },
								})
							}
							accessibilityLabel={`Read more about ${article.title}`}
						>
							<Text style={styles.readMoreButtonText}>Ask Animus to Explain</Text>
							<Ionicons name="chatbubbles-outline" size={18} color={Colors.textLight} style={{ marginLeft: 8 }} />
						</TouchableOpacity>
					</View>
				</Card>
			))}

			<Card style={styles.moreInfoCard}>
				<Ionicons name="bulb-outline" size={30} color={Colors.primary} />
				<Text style={[styles.moreInfoText, { color: colors.text }]}>
					Having more questions? Use the "Ask Animus" chat for personalized answers!
				</Text>
				<TouchableOpacity
					style={[styles.askAnimusButton, { backgroundColor: Colors.secondary }]}
					onPress={() => navigation.navigate("Chat")}
					accessibilityLabel="Go to Ask Animus chat"
				>
					<Text style={styles.askAnimusButtonText}>Go to Chat</Text>
					<Ionicons name="arrow-forward" size={18} color={Colors.textLight} style={{ marginLeft: 8 }} />
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
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 6,
		marginBottom: 20,
		borderWidth: 1,
	},
	articleCard: {
		flexDirection: "column",
		alignItems: "center",
		padding: 15,
	},
	articleImage: {
		width: "100%",
		height: 180,
		borderRadius: 15,
		marginBottom: 15,
		resizeMode: "cover",
	},
	articleContent: {
		flex: 1,
	},
	articleTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
	},
	articleSummary: {
		fontSize: 15,
		lineHeight: 22,
		opacity: 0.85,
		marginBottom: 15,
		textAlign: "center",
	},
	readMoreButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 30,
		alignSelf: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	readMoreButtonText: {
		color: Colors.textLight,
		fontSize: 15,
		fontWeight: "600",
	},
	moreInfoCard: {
		alignItems: "center",
		paddingVertical: 30,
		marginTop: 10,
	},
	moreInfoText: {
		fontSize: 16,
		textAlign: "center",
		marginTop: 15,
		marginBottom: 25,
		lineHeight: 24,
		opacity: 0.9,
	},
	askAnimusButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		paddingHorizontal: 25,
		borderRadius: 30,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 5,
	},
	askAnimusButtonText: {
		color: Colors.textLight,
		fontSize: 16,
		fontWeight: "bold",
	},
})

export default HealthInsightsScreen
