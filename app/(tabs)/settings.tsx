import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useGameState } from "@/hooks/use-game-state";

export default function SettingsScreen() {
  const router = useRouter();
  const { gameData, toggleSound, toggleHaptics } = useGameState();
  const [soundEnabled, setSoundEnabled] = useState(gameData.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState(gameData.hapticsEnabled);

  const handleSoundToggle = async () => {
    setSoundEnabled(!soundEnabled);
    await toggleSound();
  };

  const handleHapticsToggle = async () => {
    setHapticsEnabled(!hapticsEnabled);
    await toggleHaptics();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenContainer className="flex-1 bg-gradient-to-b from-purple-200 to-pink-200">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={handleBack} className="p-2">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-purple-700">Settings</Text>
          <View className="w-10" />
        </View>

        {/* Settings Sections */}
        <View className="px-6 gap-6 py-4">
          {/* Audio Section */}
          <View className="bg-white rounded-2xl p-6 shadow-md">
            <Text className="text-lg font-bold text-gray-800 mb-4">Audio</Text>

            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-700">
                  🎵 Background Music
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Calming background music during gameplay
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: "#ccc", true: "#4ade80" }}
                thumbColor={soundEnabled ? "#22c55e" : "#999"}
              />
            </View>

            <View className="border-t border-gray-200 pt-4 flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-700">
                  🔊 Sound Effects
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Pop sounds and chimes
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: "#ccc", true: "#4ade80" }}
                thumbColor={soundEnabled ? "#22c55e" : "#999"}
              />
            </View>
          </View>

          {/* Haptics Section */}
          <View className="bg-white rounded-2xl p-6 shadow-md">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Haptics
            </Text>

            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-700">
                  📳 Vibration Feedback
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Feel bubbles pop and combos build
                </Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={handleHapticsToggle}
                trackColor={{ false: "#ccc", true: "#4ade80" }}
                thumbColor={hapticsEnabled ? "#22c55e" : "#999"}
              />
            </View>
          </View>

          {/* About Section */}
          <View className="bg-white rounded-2xl p-6 shadow-md">
            <Text className="text-lg font-bold text-gray-800 mb-4">About</Text>

            <View className="gap-3">
              <View>
                <Text className="text-xs text-gray-500">Version</Text>
                <Text className="text-base font-semibold text-gray-700">
                  1.0.0
                </Text>
              </View>

              <View className="border-t border-gray-200 pt-3">
                <Text className="text-xs text-gray-500">Developer</Text>
                <Text className="text-base font-semibold text-gray-700">
                  Manus AI
                </Text>
              </View>

              <View className="border-t border-gray-200 pt-3">
                <Text className="text-xs text-gray-500">Description</Text>
                <Text className="text-sm text-gray-700 mt-1">
                  A calming, addictive mobile game where you free cute creatures
                  trapped inside floating bubbles.
                </Text>
              </View>
            </View>
          </View>

          {/* Tips Section */}
          <View className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <Text className="text-lg font-bold text-blue-700 mb-3">💡 Tips</Text>
            <Text className="text-sm text-blue-600 leading-relaxed">
              • Build combos by popping bubbles in succession{"\n"}• Avoid danger
              bubbles (red ones){"\n"}• Bonus bubbles (blue) give extra points
              {"\n"}• Unlock rare creatures by playing more{"\n"}• Check your
              collection to see what you've found
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
