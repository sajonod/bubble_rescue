import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    const saved = await AsyncStorage.getItem("highScore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  };

  const handlePlay = () => {
    router.push("./game");
  };

  const handleCollection = () => {
    router.push("./collection");
  };

  return (
    <ScreenContainer className="flex-1 bg-gradient-to-b from-pink-200 via-purple-200 to-pink-100">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
        scrollEnabled={false}
      >
        <View className="flex-1 justify-center items-center gap-8 px-6">
          {/* Decorative Bubbles */}
          <View className="absolute top-10 left-10 w-16 h-16 rounded-full bg-white/30 shadow-lg" />
          <View className="absolute top-32 right-8 w-12 h-12 rounded-full bg-white/40 shadow-lg" />
          <View className="absolute bottom-40 left-6 w-10 h-10 rounded-full bg-white/35 shadow-lg" />

          {/* Title */}
          <View className="items-center gap-2">
            <Text
              className="text-5xl font-bold text-center"
              style={{
                color: "#E84B8A",
                textShadowColor: "rgba(0, 0, 0, 0.1)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Bubble
            </Text>
            <Text
              className="text-5xl font-bold text-center"
              style={{
                color: "#6366F1",
                textShadowColor: "rgba(0, 0, 0, 0.1)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Rescue
            </Text>
          </View>

          {/* High Score */}
          {highScore > 0 && (
            <View className="bg-white/80 rounded-full px-6 py-3 shadow-md">
              <Text className="text-gray-600 text-sm">High Score</Text>
              <Text className="text-2xl font-bold text-yellow-600">
                {highScore}
              </Text>
            </View>
          )}

          {/* Play Button */}
          <TouchableOpacity
            onPress={handlePlay}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 shadow-2xl justify-center items-center active:opacity-80"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 15,
            }}
          >
            <Text className="text-6xl font-bold text-white">▶</Text>
          </TouchableOpacity>

          {/* Collection Button */}
          <TouchableOpacity
            onPress={handleCollection}
            className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-full px-8 py-4 shadow-lg active:opacity-80"
          >
            <Text className="text-white font-bold text-lg">
              🦋 Collection
            </Text>
          </TouchableOpacity>

          {/* Tagline */}
          <Text className="text-center text-gray-700 text-sm font-medium mt-4">
            Free the creatures from their bubbles!
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
