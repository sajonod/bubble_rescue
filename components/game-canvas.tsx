import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import { GameEngine, type Bubble } from "@/lib/game-engine";
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
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [screenDimensions, setScreenDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.85, // Leave room for UI
  });

  // Initialize game engine
  useEffect(() => {
    gameEngineRef.current = new GameEngine(
      screenDimensions.width,
      screenDimensions.height
    );
    lastTimeRef.current = Date.now();
  }, [screenDimensions]);

  // Game loop
  useEffect(() => {
    if (isPaused || !gameEngineRef.current) return;

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = Math.min(now - lastTimeRef.current, 16); // Cap at 60fps
      lastTimeRef.current = now;

      const engine = gameEngineRef.current!;
      engine.update(deltaTime);

      const state = engine.getState();

      // Update UI
      onScoreUpdate(state.score, state.combo, state.comboMultiplier);

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

        if (success) {
          // Haptic feedback for successful pop
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          // Combo milestone haptics
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
          }
        } else {
          // Danger bubble or game over - haptic alert
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Error
            );
          }
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
    </View>
  );
}

interface BubbleViewProps {
  bubble: Bubble;
}

function BubbleView({ bubble }: BubbleViewProps) {
  const getCreatureEmoji = (creature: string): string => {
    const emojiMap: Record<string, string> = {
      butterfly: "🦋",
      bird: "🐦",
      firefly: "✨",
      fairy: "🧚",
      dragon: "🐉",
      spirit: "🌙",
    };
    return emojiMap[creature] || "✨";
  };

  const getBubbleColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      normal: "rgba(255, 255, 255, 0.7)",
      bonus: "rgba(173, 216, 230, 0.8)",
      danger: "rgba(255, 100, 100, 0.8)",
      timed: "rgba(255, 215, 0, 0.8)",
    };
    return colorMap[type] || "rgba(255, 255, 255, 0.7)";
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
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 5,
      }}
    >
      <Text
        style={{
          fontSize: bubble.radius * 0.8,
          textAlign: "center",
          lineHeight: bubble.radius * 0.8,
        }}
      >
        {getCreatureEmoji(bubble.creature)}
      </Text>
    </View>
  );
}
