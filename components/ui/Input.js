"use client"

import { useState } from "react"
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "@react-navigation/native"
import { theme } from "../../constants/theme"
import { Ionicons } from "@expo/vector-icons"

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  multiline = false,
  style,
  inputStyle,
  ...props
}) => {
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [isSecure, setIsSecure] = useState(secureTextEntry)

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure)
  }

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? theme.colors.error[500] : isFocused ? theme.colors.primary[500] : colors.border,
            backgroundColor: colors.card,
          },
          multiline && styles.multilineContainer,
        ]}
      >
        {leftIcon && <Ionicons name={leftIcon} size={20} color={colors.text} style={styles.leftIcon} />}
        <TextInput
          style={[styles.input, { color: colors.text }, multiline && styles.multilineInput, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.text + "80"}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          multiline={multiline}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.rightIcon}>
            <Ionicons name={isSecure ? "eye-off" : "eye"} size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon} size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.error, { color: theme.colors.error[500] }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
    ...theme.shadows.sm,
  },
  multilineContainer: {
    alignItems: "flex-start",
    paddingVertical: theme.spacing.md,
    minHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: theme.spacing.sm,
  },
  multilineInput: {
    textAlignVertical: "top",
    minHeight: 60,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  error: {
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
})
