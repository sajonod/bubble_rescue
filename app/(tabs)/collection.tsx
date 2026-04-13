import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ALL_CREATURES = [
  { id: "butterfly", name: "Butterfly", emoji: "🦋", rarity: "common" },
  { id: "bird", name: "Bird", emoji: "🐦", rarity: "common" },
  { id: "firefly", name: "Firefly", emoji: "✨", rarity: "common" },
  { id: "fairy", name: "Fairy", emoji: "🧚", rarity: "rare" },
  { id: "dragon", name: "Dragon", emoji: "🐉", rarity: "rare" },
  { id: "spirit", name: "Spirit", emoji: "🌙", rarity: "rare" },
];

export default function CollectionScreen() {
  const router = useRouter();
  const [unlockedCreatures, setUnlockedCreatures] = useState<Set<string>>(
    new Set(["butterfly", "bird", "firefly"])
  );
  const [progress, setProgress] = useState(50);

  useEffect(() => {
    loadUnlockedCreatures();
  }, []);

  const loadUnlockedCreatures = async () => {
    const saved = await AsyncStorage.getItem("unlockedCreatures");
    if (saved) {
      setUnlockedCreatures(new Set(JSON.parse(saved)));
    }
  };

  const calculateProgress = () => {
    return Math.round((unlockedCreatures.size / ALL_CREATURES.length) * 100);
  };

  const handleBack = () => {
    router.back();
  };

  const renderCreatureCard = ({ item }: { item: (typeof ALL_CREATURES)[0] }) => {
    const isUnlocked = unlockedCreatures.has(item.id);

    return (
      <View className="flex-1 m-2">
        <TouchableOpacity
          disabled
          className={`rounded-2xl p-4 aspect-square justify-center items-center shadow-md ${
            isUnlocked
              ? item.rarity === "rare"
                ? "bg-gradient-to-br from-yellow-300 to-orange-400"
                : "bg-gradient-to-br from-green-300 to-emerald-400"
              : "bg-gray-400"
          }`}
        >
          {isUnlocked ? (
            <View className="items-center">
              <Text className="text-5xl mb-2">{item.emoji}</Text>
              <Text className="text-white font-bold text-sm text-center">
                {item.name}
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <Text className="text-3xl mb-2">🔒</Text>
              <Text className="text-white font-bold text-xs">???</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenContainer className="flex-1 bg-gradient-to-b from-indigo-900 to-purple-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Collection</Text>
        <View className="w-10" />
      </View>

      {/* Progress */}
      <View className="px-6 mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-white font-semibold">Progress</Text>
          <Text className="text-white font-bold text-lg">
            {unlockedCreatures.size}/{ALL_CREATURES.length}
          </Text>
        </View>
        <View className="bg-gray-700 rounded-full h-3 overflow-hidden">
          <View
            className="bg-gradient-to-r from-yellow-400 to-pink-500 h-full"
            style={{
              width: `${calculateProgress()}%`,
            }}
          />
        </View>
        <Text className="text-white text-sm mt-2 text-center">
          {calculateProgress()}% Complete
        </Text>
      </View>

      {/* Creatures Grid */}
      <FlatList
        data={ALL_CREATURES}
        renderItem={renderCreatureCard}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={true}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
      />

      {/* Info */}
      <View className="px-6 py-4 bg-black/20 rounded-t-3xl">
        <Text className="text-white text-xs text-center">
          Unlock creatures by playing the game and freeing them from bubbles!
        </Text>
      </View>
    </ScreenContainer>
  );
}
