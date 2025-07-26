"use client"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useTheme } from "@react-navigation/native"
import { theme } from "../../constants/theme"
import { Ionicons } from "@expo/vector-icons"

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const { colors } = useTheme()

  const getVariantStyles = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.full,
      ...theme.shadows.sm,
    }

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary[500],
        }
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary[500],
        }
      case "success":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.success[500],
        }
      case "warning":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.warning[500],
        }
      case "error":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.error[500],
        }
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: theme.colors.primary[500],
        }
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          shadowOpacity: 0,
          elevation: 0,
        }
      default:
        return baseStyle
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 36,
        }
      case "lg":
        return {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.lg,
          minHeight: 56,
        }
      default:
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 48,
        }
    }
  }

  const getTextColor = () => {
    if (variant === "outline") return theme.colors.primary[500]
    if (variant === "ghost") return colors.text
    return "#ffffff"
  }

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return 14
      case "lg":
        return 18
      default:
        return 16
    }
  }

  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyles(), getSizeStyles(), isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons name={icon} size={getTextSize() + 2} color={getTextColor()} style={styles.iconLeft} />
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getTextSize(),
                fontWeight: "600",
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons name={icon} size={getTextSize() + 2} color={getTextColor()} style={styles.iconRight} />
          )}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  iconLeft: {
    marginRight: theme.spacing.sm,
  },
  iconRight: {
    marginLeft: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
})
