import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [highScore, setHighScore] = useState(0);
  const [totalCreatures, setTotalCreatures] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadGameStats();
    }, [])
  );

  const loadGameStats = async () => {
    const saved = await AsyncStorage.getItem("highScore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }

    const creatures = await AsyncStorage.getItem("unlockedCreatures");
    if (creatures) {
      const creatureList = JSON.parse(creatures);
      setTotalCreatures(creatureList.length);
    } else {
      // Default to 3 common creatures
      setTotalCreatures(3);
    }
  };

  const handlePlay = () => {
    router.push("./game");
  };

  const handleCollection = () => {
    router.push("./collection");
  };

  const handleSettings = () => {
    router.push("./settings");
  };

  const screenHeight = Dimensions.get("window").height;

  return (
    <ScreenContainer className="flex-1 bg-gradient-to-b from-pink-200 via-purple-200 to-pink-100">
      {/* Top Corner Decorations */}
      <View className="absolute top-0 left-0 w-24 h-24 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2" />
      <View className="absolute top-20 right-10 w-16 h-16 rounded-full bg-blue-300/30" />
      <View className="absolute bottom-32 left-8 w-12 h-12 rounded-full bg-purple-300/30" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, minHeight: screenHeight }}
        className="flex-1"
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center gap-6 px-6">
          {/* Title with enhanced styling */}
          <View className="items-center gap-1 mb-4">
            <Text
              className="text-6xl font-black text-center tracking-wider"
              style={{
                color: "#E84B8A",
                textShadowColor: "rgba(0, 0, 0, 0.15)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Bubble
            </Text>
            <Text
              className="text-6xl font-black text-center tracking-wider"
              style={{
                color: "#6366F1",
                textShadowColor: "rgba(0, 0, 0, 0.15)",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }}
            >
              Rescue
            </Text>
            <Text className="text-purple-700 text-sm font-semibold mt-2 tracking-widest">
              🫧 Free the creatures! 🫧
            </Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row gap-4 mb-2">
            {/* High Score Card */}
            <TouchableOpacity
              onPress={handlePlay}
              className="flex-1 bg-white/80 rounded-2xl px-4 py-3 shadow-md"
              activeOpacity={0.7}
            >
              <Text className="text-gray-600 text-xs font-semibold text-center">
                High Score
              </Text>
              <Text className="text-center text-2xl font-bold text-yellow-600">
                {highScore}
              </Text>
            </TouchableOpacity>

            {/* Creatures Card */}
            <TouchableOpacity
              onPress={handleCollection}
              className="flex-1 bg-white/80 rounded-2xl px-4 py-3 shadow-md"
              activeOpacity={0.7}
            >
              <Text className="text-gray-600 text-xs font-semibold text-center">
                Creatures
              </Text>
              <Text className="text-center text-2xl font-bold text-purple-600">
                {totalCreatures}/11
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Play Button */}
          <View className="my-8">
            <TouchableOpacity
              onPress={handlePlay}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 shadow-2xl justify-center items-center active:scale-95 mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35,
                shadowRadius: 15,
                elevation: 20,
              }}
            >
              <Text className="text-7xl font-bold text-white">▶</Text>
            </TouchableOpacity>
            <Text className="text-center text-white font-bold text-lg">
              TAP TO PLAY
            </Text>
          </View>

          {/* Collection Button */}
          <TouchableOpacity
            onPress={handleCollection}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full px-8 py-4 shadow-lg active:opacity-80"
          >
            <Text className="text-white font-bold text-lg text-center">
              🦋 View Collection
            </Text>
          </TouchableOpacity>

          {/* Secondary Buttons Row */}
          <View className="flex-row gap-3 mt-4 w-full">
            <TouchableOpacity
              onPress={handleSettings}
              className="flex-1 bg-white/70 rounded-full py-3 shadow-md active:opacity-80"
            >
              <Text className="text-center text-gray-700 font-semibold">
                ⚙️ Settings
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tagline */}
          <Text className="text-center text-gray-700 text-sm font-medium mt-6 italic">
            Rescue cute creatures trapped in bubbles
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
