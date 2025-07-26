import { View, Text, StyleSheet } from "react-native"
import { theme } from "../../constants/theme"

export const Badge = ({ children, variant = "primary", size = "md", style, textStyle }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          backgroundColor: theme.colors.success[100],
          borderColor: theme.colors.success[200],
        }
      case "warning":
        return {
          backgroundColor: theme.colors.warning[100],
          borderColor: theme.colors.warning[200],
        }
      case "error":
        return {
          backgroundColor: theme.colors.error[100],
          borderColor: theme.colors.error[200],
        }
      case "secondary":
        return {
          backgroundColor: theme.colors.secondary[100],
          borderColor: theme.colors.secondary[200],
        }
      default:
        return {
          backgroundColor: theme.colors.primary[100],
          borderColor: theme.colors.primary[200],
        }
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "success":
        return theme.colors.success[700]
      case "warning":
        return theme.colors.warning[700]
      case "error":
        return theme.colors.error[700]
      case "secondary":
        return theme.colors.secondary[700]
      default:
        return theme.colors.primary[700]
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          fontSize: 12,
        }
      case "lg":
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          fontSize: 16,
        }
      default:
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          fontSize: 14,
        }
    }
  }

  const sizeStyles = getSizeStyles()

  return (
    <View
      style={[
        styles.badge,
        getVariantStyles(),
        {
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: sizeStyles.fontSize,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
})
