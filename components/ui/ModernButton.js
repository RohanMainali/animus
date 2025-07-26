import { TouchableOpacity, Text, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../../constants/colors"

export const ModernButton = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  disabled = false,
  style,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]]

    if (disabled) {
      return [...baseStyle, styles.disabled, style]
    }

    return [...baseStyle, style]
  }

  const getGradientColors = () => {
    switch (variant) {
      case "primary":
        return Colors.gradientPrimary
      case "success":
        return Colors.gradientSuccess
      case "warning":
        return Colors.gradientWarning
      case "health":
        return Colors.gradientHealth
      default:
        return Colors.gradientPrimary
    }
  }

  const getTextColor = () => {
    return variant === "outline" ? Colors.primary : Colors.textLight
  }

  if (variant === "outline") {
    return (
      <TouchableOpacity style={[...getButtonStyle(), styles.outline]} onPress={onPress} disabled={disabled} {...props}>
        <View style={styles.buttonContent}>
          {icon && <Ionicons name={icon} size={20} color={Colors.primary} style={styles.icon} />}
          <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={getButtonStyle()} onPress={onPress} disabled={disabled} {...props}>
      <LinearGradient
        colors={disabled ? ["#9CA3AF", "#6B7280"] : getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.buttonContent}>
          {icon && <Ionicons name={icon} size={20} color={Colors.textLight} style={styles.icon} />}
          <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  small: {
    minHeight: 40,
  },
  medium: {
    minHeight: 52,
  },
  large: {
    minHeight: 60,
  },
  gradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  icon: {
    marginRight: 8,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
})
