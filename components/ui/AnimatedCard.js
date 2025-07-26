"use client"

import { useEffect, useRef } from "react"
import { Animated, TouchableOpacity } from "react-native"
import { Card } from "./Card"

export const AnimatedCard = ({ children, onPress, delay = 0, duration = 600, style, ...props }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
        <Animated.View style={[animatedStyle, style]}>
          <Card {...props}>{children}</Card>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Card {...props}>{children}</Card>
    </Animated.View>
  )
}
