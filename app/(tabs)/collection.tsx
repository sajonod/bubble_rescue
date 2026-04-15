import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CREATURES, getAllCreatures } from "@/constants/creatures";

export default function CollectionScreen() {
  const router = useRouter();
  const [unlockedCreatures, setUnlockedCreatures] = useState<Set<string>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadUnlockedCreatures();
  }, []);

  const loadUnlockedCreatures = async () => {
    const saved = await AsyncStorage.getItem("unlockedCreatures");
    if (saved) {
      const creatures = new Set(JSON.parse(saved));
      setUnlockedCreatures(creatures);
      setProgress(Math.round((creatures.size / getAllCreatures().length) * 100));
    } else {
      // Initialize with common creatures
      const fromEngine = await AsyncStorage.getItem("commonCreatures");
      if (fromEngine) {
        const creatures = new Set(JSON.parse(fromEngine));
        setUnlockedCreatures(creatures);
      } else {
        // Default common creatures
        setUnlockedCreatures(
          new Set(["butterfly", "bird", "firefly"])
        );
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderCreatureCard = ({ item }: { item: (typeof CREATURES)[keyof typeof CREATURES] }) => {
    const isUnlocked = unlockedCreatures.has(item.id);

    return (
      <View className="flex-1 m-2">
        <TouchableOpacity
          disabled
          className={`rounded-2xl p-4 aspect-square justify-center items-center shadow-md overflow-hidden ${
            isUnlocked
              ? item.rarity === "legendary"
                ? "bg-gradient-to-br from-yellow-300 to-orange-400"
                : item.rarity === "rare"
                  ? "bg-gradient-to-br from-purple-300 to-pink-300"
                  : item.rarity === "uncommon"
                    ? "bg-gradient-to-br from-blue-300 to-cyan-300"
                    : "bg-gradient-to-br from-green-200 to-emerald-300"
              : "bg-gray-400"
          }`}
        >
          {isUnlocked ? (
            <>
              <Text className="text-5xl mb-2">{item.emoji}</Text>
              <Text className="text-xs font-bold text-center text-white" numberOfLines={1}>
                {item.name}
              </Text>
            </>
          ) : (
            <>
              <Text className="text-5xl mb-2 opacity-30">🔒</Text>
              <Text className="text-xs font-bold text-center text-white">?</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenContainer className="flex-1 bg-gradient-to-b from-purple-100 to-pink-100">
      {/* Header */}
      <View className="pt-6 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={handleBack}>
            <Text className="text-2xl">← Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-purple-600">🦋 Collection</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress */}
        <View className="bg-white/70 rounded-full px-4 py-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-semibold text-gray-700">Creatures Found</Text>
            <Text className="font-bold text-lg text-purple-600">
              {unlockedCreatures.size}/{getAllCreatures().length}
            </Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-center text-xs text-gray-600 mt-2">{progress}% Complete</Text>
        </View>
      </View>

      {/* Creatures Grid */}
      <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
        <FlatList
          data={getAllCreatures()}
          renderItem={renderCreatureCard}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={{ flexWrap: "wrap" }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>

      {/* Legend */}
      <View className="bg-white/60 px-4 py-4 border-t border-white/30">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Rarity Levels:</Text>
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded bg-gradient-to-br from-green-200 to-emerald-300" />
            <Text className="text-xs text-gray-600">Common</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded bg-gradient-to-br from-blue-300 to-cyan-300" />
            <Text className="text-xs text-gray-600">Uncommon</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded bg-gradient-to-br from-purple-300 to-pink-300" />
            <Text className="text-xs text-gray-600">Rare</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded bg-gradient-to-br from-yellow-300 to-orange-400" />
            <Text className="text-xs text-gray-600">Legendary</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
