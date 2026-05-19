import { Animated } from 'react-native';
import { CustomTheme } from './CustomTheme';

/**
 * Interpolates between two CustomTheme color objects using an Animated.Value.
 * Useful for smooth theme transition animations.
 */
export function interpolateThemes(
  animValue: Animated.Value,
  fromTheme: CustomTheme,
  toTheme: CustomTheme,
): Record<string, Animated.AnimatedInterpolation<string>> {
  const interpolatedColors: Record<string, Animated.AnimatedInterpolation<string>> = {};

  const colorKeys = Object.keys(fromTheme.colors) as Array<keyof CustomTheme['colors']>;

  colorKeys.forEach(key => {
    const fromColor = fromTheme.colors[key];
    const toColor = toTheme.colors[key];

    if (typeof fromColor === 'string' && typeof toColor === 'string') {
      interpolatedColors[key] = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [fromColor, toColor],
      });
    }
  });

  return interpolatedColors;
}
