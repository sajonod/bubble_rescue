import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface GameData {
  highScore: number;
  unlockedCreatures: string[];
  totalGamesPlayed: number;
  totalScore: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

const DEFAULT_GAME_DATA: GameData = {
  highScore: 0,
  unlockedCreatures: ["butterfly", "bird", "firefly"],
  totalGamesPlayed: 0,
  totalScore: 0,
  soundEnabled: true,
  hapticsEnabled: true,
};

export function useGameState() {
  const [gameData, setGameData] = useState<GameData>(DEFAULT_GAME_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load game data from storage
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      const saved = await AsyncStorage.getItem("gameData");
      if (saved) {
        setGameData(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGameData = useCallback(
    async (data: Partial<GameData>) => {
      try {
        const updated = { ...gameData, ...data };
        setGameData(updated);
        await AsyncStorage.setItem("gameData", JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save game data:", error);
      }
    },
    [gameData]
  );

  const updateHighScore = useCallback(
    async (score: number) => {
      if (score > gameData.highScore) {
        await saveGameData({ highScore: score });
      }
    },
    [gameData.highScore, saveGameData]
  );

  const unlockCreature = useCallback(
    async (creature: string) => {
      if (!gameData.unlockedCreatures.includes(creature)) {
        const updated = [...gameData.unlockedCreatures, creature];
        await saveGameData({ unlockedCreatures: updated });
      }
    },
    [gameData.unlockedCreatures, saveGameData]
  );

  const recordGameSession = useCallback(
    async (score: number) => {
      await saveGameData({
        totalGamesPlayed: gameData.totalGamesPlayed + 1,
        totalScore: gameData.totalScore + score,
      });
    },
    [gameData.totalGamesPlayed, gameData.totalScore, saveGameData]
  );

  const toggleSound = useCallback(async () => {
    await saveGameData({ soundEnabled: !gameData.soundEnabled });
  }, [gameData.soundEnabled, saveGameData]);

  const toggleHaptics = useCallback(async () => {
    await saveGameData({ hapticsEnabled: !gameData.hapticsEnabled });
  }, [gameData.hapticsEnabled, saveGameData]);

  return {
    gameData,
    isLoading,
    updateHighScore,
    unlockCreature,
    recordGameSession,
    toggleSound,
    toggleHaptics,
  };
}
