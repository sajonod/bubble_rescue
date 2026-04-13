import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { GameCanvas } from "@/components/game-canvas";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GameScreen() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [newCreatures, setNewCreatures] = useState<string[]>([]);

  const handleGameOver = useCallback(
    async (finalScore: number, creatures: string[]) => {
      // Save high score
      const saved = await AsyncStorage.getItem("highScore");
      const currentHigh = saved ? parseInt(saved, 10) : 0;

      if (finalScore > currentHigh) {
        await AsyncStorage.setItem("highScore", finalScore.toString());
        setHighScore(finalScore);
      } else {
        setHighScore(currentHigh);
      }

      setNewCreatures(creatures);
      setGameOver(true);
    },
    []
  );

  const handleScoreUpdate = useCallback(
    (newScore: number, newCombo: number, newMultiplier: number) => {
      setScore(newScore);
      setCombo(newCombo);
      setMultiplier(newMultiplier);
    },
    []
  );

  const handleRetry = () => {
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setMultiplier(1);
    setNewCreatures([]);
  };

  const handleHome = () => {
    router.push("../");
  };

  return (
    <ScreenContainer className="flex-1 bg-gradient-to-b from-pink-200 to-purple-200">
      {/* Score Display */}
      <View className="absolute top-4 left-0 right-0 z-10 items-center">
        <View className="bg-yellow-500 px-6 py-2 rounded-full shadow-lg">
          <Text className="text-2xl font-bold text-white">{score}</Text>
        </View>
      </View>

      {/* Combo Display */}
      {combo > 0 && (
        <View className="absolute left-4 top-20 z-10">
          <Text
            className={`text-2xl font-bold ${
              multiplier === 3
                ? "text-red-500"
                : multiplier === 2
                  ? "text-blue-500"
                  : "text-gray-600"
            }`}
            style={{
              transform: [{ scale: 1 + multiplier * 0.1 }],
              textShadowColor: "rgba(0, 0, 0, 0.3)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            Combo x{combo}
          </Text>
          <Text className="text-lg font-semibold text-yellow-600">
            ×{multiplier}
          </Text>
        </View>
      )}

      {/* Game Canvas */}
      <GameCanvas
        onGameOver={handleGameOver}
        onScoreUpdate={handleScoreUpdate}
        isPaused={gameOver}
      />

      {/* Game Over Modal */}
      <Modal visible={gameOver} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-3xl p-6 w-4/5 max-w-sm shadow-2xl">
            {/* Title */}
            <Text className="text-3xl font-bold text-center text-purple-600 mb-4">
              Rescue Mission Complete!
            </Text>

            {/* Score */}
            <View className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4">
              <Text className="text-center text-gray-600 text-sm mb-1">
                Score
              </Text>
              <Text className="text-center text-4xl font-bold text-yellow-600">
                {score}
              </Text>

              {score > highScore && highScore > 0 && (
                <Text className="text-center text-green-600 font-semibold mt-2">
                  🎉 New Best!
                </Text>
              )}
            </View>

            {/* New Creatures */}
            {newCreatures.length > 0 && (
              <View className="bg-blue-50 rounded-2xl p-4 mb-4">
                <Text className="text-center font-semibold text-blue-600 mb-2">
                  ✨ New Discovery!
                </Text>
                <Text className="text-center text-2xl">
                  {newCreatures.map((c) => {
                    const emojiMap: Record<string, string> = {
                      butterfly: "🦋",
                      bird: "🐦",
                      firefly: "✨",
                      fairy: "🧚",
                      dragon: "🐉",
                      spirit: "🌙",
                    };
                    return emojiMap[c] || "✨";
                  })}
                </Text>
              </View>
            )}

            {/* Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleRetry}
                className="bg-gradient-to-r from-teal-400 to-teal-500 rounded-full py-3"
              >
                <Text className="text-center text-white font-bold text-lg">
                  Play Again
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleHome}
                className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-full py-3"
              >
                <Text className="text-center text-white font-bold text-lg">
                  Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
