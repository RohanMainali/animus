"use client"
import { View, StyleSheet } from "react-native"
import { useTheme } from "@react-navigation/native"
import { theme } from "../../constants/theme"

export const Card = ({ children, style, variant = "default", padding = "lg", shadow = "md", ...props }) => {
  const { colors } = useTheme()

  const getVariantStyles = () => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: colors.card,
          ...theme.shadows.lg,
        }
      case "outlined":
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          ...theme.shadows.sm,
        }
      case "glass":
        return {
          backgroundColor: colors.card + "90",
          backdropFilter: "blur(10px)",
          ...theme.shadows.md,
        }
      default:
        return {
          backgroundColor: colors.card,
          ...theme.shadows[shadow],
        }
    }
  }

  return (
    <View style={[styles.card, getVariantStyles(), { padding: theme.spacing[padding] }, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
})
