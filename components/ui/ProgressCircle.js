"use client"

import { useEffect, useRef } from "react"
import { View, Text, Animated, StyleSheet } from "react-native"
import Svg, { Circle } from "react-native-svg"
import { theme } from "../../constants/theme"

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const ProgressCircle = ({
  progress = 0,
  size = 100,
  strokeWidth = 8,
  color = theme.colors.primary[500],
  backgroundColor = theme.colors.neutral[200],
  showText = true,
  text,
  textStyle,
  duration = 1000,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  })

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.text, textStyle]}>{text || `${Math.round(progress * 100)}%`}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
})
