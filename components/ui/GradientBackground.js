import { LinearGradient } from "expo-linear-gradient"
import { theme } from "../../constants/theme"

export const GradientBackground = ({
  children,
  colors = [theme.colors.primary[500], theme.colors.secondary[500]],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  ...props
}) => {
  return (
    <LinearGradient colors={colors} start={start} end={end} style={[{ flex: 1 }, style]} {...props}>
      {children}
    </LinearGradient>
  )
}
