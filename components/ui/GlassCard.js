import { View, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "../../constants/colors"

export const GlassCard = ({ children, style, gradient = false, isDarkMode = false }) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={
          isDarkMode
            ? ["rgba(31, 41, 55, 0.8)", "rgba(17, 24, 39, 0.9)"]
            : ["rgba(255, 255, 255, 0.9)", "rgba(249, 250, 251, 0.8)"]
        }
        style={[styles.glassCard, style]}
      >
        {children}
      </LinearGradient>
    )
  }

  return (
    <View
      style={[
        styles.glassCard,
        {
          backgroundColor: isDarkMode ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.9)",
          borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    backdropFilter: "blur(20px)",
  },
})
