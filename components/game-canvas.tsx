import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameEngine, type Bubble } from "@/lib/game-engine";
import { ParticleSystem } from "@/lib/particle-system";
import { AudioManagerEnhanced } from "@/lib/audio-manager-enhanced";
import { AnimatedParticles, type AnimatedParticle } from "@/components/animated-particles";
import { getCreatureEmoji } from "@/constants/creatures";
import * as Haptics from "expo-haptics";

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
    height: Dimensions.get("window").height * 0.85, // Leave room for UI
  });
  const [particles, setParticles] = useState<AnimatedParticle[]>([]);
  const particleMapRef = useRef<Map<string, AnimatedParticle>>(new Map());

  // Initialize game engine and particle system
  useEffect(() => {
    const initializeGame = async () => {
      // Load unlocked creatures from storage
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
      
      // Initialize audio manager
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
      const deltaTime = Math.min(now - lastTimeRef.current, 16); // Cap at 60fps
      lastTimeRef.current = now;

      const engine = gameEngineRef.current!;
      const particleSystem = particleSystemRef.current!;
      
      engine.update(deltaTime);
      particleSystem.update(deltaTime);

      const state = engine.getState();

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

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, onGameOver, onScoreUpdate]);

  // Handle tap/touch
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
          // Play pop sound
          audioManager.playPopSound().catch(console.error);

          // Create pop effect
          particleSystem.createPopEffect(bubble.x, bubble.y);
          particleSystem.createRippleEffect(bubble.x, bubble.y);

          // Haptic feedback for successful pop
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          // Combo milestone haptics and sounds
          const state = gameEngineRef.current.getState();
          if (
            state.combo === 3 ||
            state.combo === 6 ||
            state.combo === 10 ||
            state.combo % 5 === 0
          ) {
            if (Platform.OS !== "web") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            audioManager.playComboSound().catch(console.error);
          }
        } else {
          // Danger bubble or game over - haptic alert and sound
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Error
            );
          }
          audioManager.playDangerSound?.().catch(console.error);
        }
      }
    },
    [isPaused]
  );

  // Render bubbles
  const renderBubbles = () => {
    const engine = gameEngineRef.current;
    if (!engine) return null;

    const state = engine.getState();
    return state.bubbles
      .filter((b) => !b.isPopped)
      .map((bubble) => (
        <BubbleView key={bubble.id} bubble={bubble} />
      ));
  };

  return (
    <View
      ref={canvasRef}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handleTap}
      style={{
        width: screenDimensions.width,
        height: screenDimensions.height,
        backgroundColor: "#F5D5E8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {renderBubbles()}
      <AnimatedParticles
        particles={particles}
        onParticleComplete={(id) => {
          setParticles((prev) => prev.filter((p) => p.id !== id));
        }}
      />
    </View>
  );
}

interface BubbleViewProps {
  bubble: Bubble;
}

function BubbleView({ bubble }: BubbleViewProps) {
  const getBubbleColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      normal: "rgba(255, 255, 255, 0.8)",
      bonus: "rgba(173, 216, 230, 0.85)",
      danger: "rgba(255, 100, 100, 0.85)",
      timed: "rgba(255, 215, 0, 0.85)",
    };
    return colorMap[type] || "rgba(255, 255, 255, 0.8)";
  };

  const getBubbleBorderColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      normal: "rgba(255, 255, 255, 0.95)",
      bonus: "rgba(100, 180, 220, 0.95)",
      danger: "rgba(255, 50, 50, 0.95)",
      timed: "rgba(255, 200, 0, 0.95)",
    };
    return colorMap[type] || "rgba(255, 255, 255, 0.95)";
  };

  return (
    <View
      style={{
        position: "absolute",
        left: bubble.x - bubble.radius,
        top: bubble.y - bubble.radius,
        width: bubble.radius * 2,
        height: bubble.radius * 2,
        borderRadius: bubble.radius,
        backgroundColor: getBubbleColor(bubble.type),
        borderWidth: 3,
        borderColor: getBubbleBorderColor(bubble.type),
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
      }}
    >
      <Text
        style={{
          fontSize: bubble.radius * 0.85,
          textAlign: "center",
          lineHeight: bubble.radius * 0.9,
        }}
      >
        {getCreatureEmoji(bubble.creature as any)}
      </Text>
    </View>
  );
}
