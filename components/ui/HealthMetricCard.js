import { View, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../../constants/colors"

export const HealthMetricCard = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = Colors.primary,
  isDarkMode = false,
}) => {
  const getTrendIcon = () => {
    if (trend === "up") return "trending-up"
    if (trend === "down") return "trending-down"
    return "remove"
  }

  const getTrendColor = () => {
    if (trend === "up") return Colors.accentGreen
    if (trend === "down") return Colors.accentRed
    return Colors.textMuted
  }

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["rgba(31, 41, 55, 0.9)", "rgba(17, 24, 39, 0.8)"]
          : ["rgba(255, 255, 255, 0.95)", "rgba(249, 250, 251, 0.9)"]
      }
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons name={getTrendIcon()} size={16} color={getTrendColor()} />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>{trendValue}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.value, { color: isDarkMode ? Colors.textLight : Colors.textDark }]}>{value}</Text>
        {unit && <Text style={[styles.unit, { color: Colors.textMuted }]}>{unit}</Text>}
      </View>

      <Text style={[styles.title, { color: Colors.textMuted }]}>{title}</Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: "700",
  },
  unit: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
})
