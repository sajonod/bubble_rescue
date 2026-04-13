import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";

export interface AnimatedParticle {
  id: string;
  x: number;
  y: number;
  type: "sparkle" | "ripple" | "trail";
  color: string;
  size: number;
}

interface AnimatedParticlesProps {
  particles: AnimatedParticle[];
  onParticleComplete?: (id: string) => void;
}

const AnimatedParticleView = ({
  particle,
  onComplete,
}: {
  particle: AnimatedParticle;
  onComplete?: () => void;
}) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (particle.type === "sparkle") {
      // Sparkles fade out and move down
      opacity.value = withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }, () => {
        if (onComplete) {
          runOnJS(onComplete)();
        }
      });

      scale.value = withTiming(0.3, { duration: 600 });
      translateY.value = withTiming(40, { duration: 600 });
    } else if (particle.type === "ripple") {
      // Ripples expand and fade
      scale.value = withTiming(3, { duration: 400, easing: Easing.out(Easing.ease) });
      opacity.value = withTiming(0, { duration: 400 }, () => {
        if (onComplete) {
          runOnJS(onComplete)();
        }
      });
    } else if (particle.type === "trail") {
      // Trails fade out
      opacity.value = withTiming(0, { duration: 300 }, () => {
        if (onComplete) {
          runOnJS(onComplete)();
        }
      });

      scale.value = withTiming(0.5, { duration: 300 });
    }
  }, [particle.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const getParticleShape = () => {
    if (particle.type === "sparkle") {
      return (
        <View
          style={[
            styles.sparkle,
            {
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.size / 2,
            },
          ]}
        />
      );
    } else if (particle.type === "ripple") {
      return (
        <View
          style={[
            styles.ripple,
            {
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              borderWidth: 2,
              borderColor: particle.color,
            },
          ]}
        />
      );
    } else {
      // Trail
      return (
        <View
          style={[
            styles.trail,
            {
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.size / 2,
            },
          ]}
        />
      );
    }
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: particle.x - particle.size / 2,
          top: particle.y - particle.size / 2,
        },
        animatedStyle,
      ]}
    >
      {getParticleShape()}
    </Animated.View>
  );
};

export const AnimatedParticles: React.FC<AnimatedParticlesProps> = ({
  particles,
  onParticleComplete,
}) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <AnimatedParticleView
          key={particle.id}
          particle={particle}
          onComplete={() => onParticleComplete?.(particle.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  ripple: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  trail: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
