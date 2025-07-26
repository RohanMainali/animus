"use client"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { useTheme } from "@react-navigation/native"

export const StatusBar = () => {
  const { dark } = useTheme()

  return <ExpoStatusBar style={dark ? "light" : "dark"} backgroundColor="transparent" translucent />
}
