import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameEngine, type Bubble, type FlyingCreature } from "@/lib/game-engine";
import { ParticleSystem } from "@/lib/particle-system";
import { AudioManagerEnhanced } from "@/lib/audio-manager-enhanced";
import { AnimatedParticles, type AnimatedParticle } from "@/components/animated-particles";
import { getCreatureEmoji } from "@/constants/creatures";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor
} from "react-native-reanimated";

interface GameCanvasProps {
  onGameOver: (score: number, newCreatures: string[]) => void;
  onScoreUpdate: (score: number, combo: number, multiplier: number) => void;
  isPaused?: boolean;
}

export function GameCanvas({
  onGameOver,
  onScoreUpdate,
  isPaused = false,
}: GameCanvasProps) {
  const canvasRef = useRef<View>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const audioManagerRef = useRef<AudioManagerEnhanced | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [screenDimensions, setScreenDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.85,
  });

  const [gameState, setGameState] = useState<{
    bubbles: Bubble[];
    flyingCreatures: FlyingCreature[];
    shakeIntensity: number;
  }>({
    bubbles: [],
    flyingCreatures: [],
    shakeIntensity: 0,
  });

  const [particles, setParticles] = useState<AnimatedParticle[]>([]);

  // Animation values for screen shake
  const shakeX = useSharedValue(0);
  const shakeY = useSharedValue(0);

  // Initialize game engine and particle system
  useEffect(() => {
    const initializeGame = async () => {
      let unlockedCreatures: Set<string> | undefined;
      try {
        const saved = await AsyncStorage.getItem("unlockedCreatures");
        if (saved) {
          unlockedCreatures = new Set(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load creatures:", error);
      }

      gameEngineRef.current = new GameEngine(
        screenDimensions.width,
        screenDimensions.height,
        unlockedCreatures as any
      );
      particleSystemRef.current = new ParticleSystem();
      
      const audioManager = AudioManagerEnhanced.getInstance();
      audioManagerRef.current = audioManager;
      audioManager.initialize().catch(console.error);
      
      lastTimeRef.current = Date.now();
    };

    initializeGame();
  }, [screenDimensions]);

  // Game loop
  useEffect(() => {
    if (isPaused || !gameEngineRef.current) return;

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = Math.min(now - lastTimeRef.current, 32);
      lastTimeRef.current = now;

      const engine = gameEngineRef.current!;
      const particleSystem = particleSystemRef.current!;
      
      engine.update(deltaTime);
      particleSystem.update(deltaTime);

      const state = engine.getState();

      // Update Local State
      setGameState({
        bubbles: [...state.bubbles],
        flyingCreatures: [...state.flyingCreatures],
        shakeIntensity: state.shakeIntensity,
      });

      // Handle screen shake
      if (state.shakeIntensity > 0) {
        shakeX.value = (Math.random() - 0.5) * state.shakeIntensity * 2;
        shakeY.value = (Math.random() - 0.5) * state.shakeIntensity * 2;
      } else {
        shakeX.value = 0;
        shakeY.value = 0;
      }

      // Update UI
      onScoreUpdate(state.score, state.combo, state.comboMultiplier);

      // Update particles display
      const systemParticles = particleSystem.getParticles();
      const animatedParticles: AnimatedParticle[] = systemParticles.map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        type: p.type,
        color: p.color,
        size: particleSystem.getParticleSize(p),
      }));
      setParticles(animatedParticles);

      // Check for game over
      if (state.isGameOver) {
        onGameOver(state.score, state.newCreatures);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, onGameOver, onScoreUpdate]);

  const handleTap = useCallback(
    (event: any) => {
      if (!gameEngineRef.current || isPaused) return;

      const { locationX, locationY } = event.nativeEvent;
      const bubble = gameEngineRef.current.getBubbleAtPosition(
        locationX,
        locationY
      );

      if (bubble) {
        const success = gameEngineRef.current.popBubble(bubble.id);
        const particleSystem = particleSystemRef.current!;
        const audioManager = audioManagerRef.current!;

        if (success) {
          audioManager.playPopSound().catch(console.error);
          particleSystem.createPopEffect(bubble.x, bubble.y);
          particleSystem.createRippleEffect(bubble.x, bubble.y);

          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          const state = gameEngineRef.current.getState();
          if (state.combo % 5 === 0 || state.combo === 3) {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            audioManager.playComboSound().catch(console.error);
          }
        } else {
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          audioManager.playDangerSound?.().catch(console.error);
        }
      }
    },
    [isPaused]
  );

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeX.value },
      { translateY: shakeY.value },
    ],
  }));

  return (
    <View
      style={{
        width: screenDimensions.width,
        height: screenDimensions.height,
        backgroundColor: "#E0F2F1", // Light teal pastel
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Animated.View
        ref={canvasRef}
        onStartShouldSetResponder={() => true}
        onResponderGrant={handleTap}
        style={[{ flex: 1 }, animatedContainerStyle]}
      >
        {/* Render Bubbles */}
        {gameState.bubbles.map((bubble) => (
          <BubbleView key={bubble.id} bubble={bubble} />
        ))}

        {/* Render Flying Creatures */}
        {gameState.flyingCreatures.map((creature) => (
          <CreatureView key={creature.id} creature={creature} />
        ))}

        <AnimatedParticles
          particles={particles}
          onParticleComplete={(id) => {
            setParticles((prev) => prev.filter((p) => p.id !== id));
          }}
        />
      </Animated.View>
    </View>
  );
}

function BubbleView({ bubble }: { bubble: Bubble }) {
  const getBubbleStyles = (type: string) => {
    const styles: Record<string, any> = {
      normal: { bg: "rgba(255, 255, 255, 0.7)", border: "rgba(255, 255, 255, 0.9)" },
      bonus: { bg: "rgba(187, 222, 251, 0.8)", border: "rgba(33, 150, 243, 0.9)" },
      danger: { bg: "rgba(255, 205, 210, 0.8)", border: "rgba(244, 67, 54, 0.9)" },
      timed: { bg: "rgba(255, 249, 196, 0.8)", border: "rgba(251, 192, 45, 0.9)" },
    };
    return styles[type] || styles.normal;
  };

  const styleConfig = getBubbleStyles(bubble.type);

  return (
    <View
      style={{
        position: "absolute",
        left: bubble.x - bubble.radius,
        top: bubble.y - bubble.radius,
        width: bubble.radius * 2,
        height: bubble.radius * 2,
        borderRadius: bubble.radius,
        backgroundColor: styleConfig.bg,
        borderWidth: 2,
        borderColor: styleConfig.border,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: bubble.radius * 0.9 }}>
        {getCreatureEmoji(bubble.creature)}
      </Text>
      {bubble.type === "timed" && (
        <View style={styles.timerIndicator} />
      )}
    </View>
  );
}

function CreatureView({ creature }: { creature: FlyingCreature }) {
  return (
    <View
      style={{
        position: "absolute",
        left: creature.x - 20,
        top: creature.y - 20,
        opacity: creature.opacity,
        transform: [
          { scale: creature.scale },
          { rotate: `${creature.rotation}deg` }
        ],
      }}
    >
      <Text style={{ fontSize: 32 }}>
        {getCreatureEmoji(creature.creature)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timerIndicator: {
    position: "absolute",
    bottom: -5,
    width: "60%",
    height: 4,
    backgroundColor: "#FBC02D",
    borderRadius: 2,
  }
});
