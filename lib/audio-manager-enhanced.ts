import { Audio } from "expo-av";
import { Platform } from "react-native";

interface SoundPlayer {
  sound: Audio.Sound;
  isPlaying: boolean;
}

export class AudioManagerEnhanced {
  private static instance: AudioManagerEnhanced;
  private soundEnabled: boolean = true;
  private hapticsEnabled: boolean = true;
  private soundPlayers: Map<string, SoundPlayer> = new Map();
  private backgroundMusic: Audio.Sound | null = null;
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): AudioManagerEnhanced {
    if (!AudioManagerEnhanced.instance) {
      AudioManagerEnhanced.instance = new AudioManagerEnhanced();
    }
    return AudioManagerEnhanced.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      if (Platform.OS !== "web") {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
        });
      }

      // Preload essential sounds
      const soundsToLoad = {
        pop: require("@/assets/sounds/pop.wav"),
        pop2: require("@/assets/sounds/pop2.wav"),
        pop3: require("@/assets/sounds/pop3.wav"),
        combo: require("@/assets/sounds/combo.wav"),
        danger: require("@/assets/sounds/danger.wav"),
        background: require("@/assets/sounds/background.wav"),
      };

      for (const [key, source] of Object.entries(soundsToLoad)) {
        await this.loadSound(key, source);
      }

      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  setHapticsEnabled(enabled: boolean): void {
    this.hapticsEnabled = enabled;
  }

  /**
   * Load a sound file
   */
  async loadSound(key: string, source: any): Promise<void> {
    try {
      // Check if already loaded
      if (this.soundPlayers.has(key)) return;

      const { sound } = await Audio.Sound.createAsync(source);
      this.soundPlayers.set(key, { sound, isPlaying: false });
    } catch (error) {
      console.error(`Failed to load sound ${key}:`, error);
    }
  }

  /**
   * Play a pop sound effect (random variation)
   */
  async playPopSound(): Promise<void> {
    if (!this.soundEnabled) return;

    const popVariations = ["pop", "pop2", "pop3"];
    const randomPop = popVariations[Math.floor(Math.random() * popVariations.length)];

    try {
      const player = this.soundPlayers.get(randomPop);
      if (player) {
        await player.sound.replayAsync();
      }
    } catch (error) {
      console.error("Failed to play pop sound:", error);
    }
  }

  /**
   * Play combo milestone sound
   */
  async playComboSound(): Promise<void> {
    if (!this.soundEnabled) return;

    try {
      const player = this.soundPlayers.get("combo");
      if (player) {
        await player.sound.replayAsync();
      }
    } catch (error) {
      console.error("Failed to play combo sound:", error);
    }
  }

  /**
   * Play danger/error sound
   */
  async playErrorSound(): Promise<void> {
    if (!this.soundEnabled) return;

    try {
      const player = this.soundPlayers.get("danger");
      if (player) {
        await player.sound.replayAsync();
      }
    } catch (error) {
      console.error("Failed to play error sound:", error);
    }
  }

  /**
   * Alias for playErrorSound
   */
  async playDangerSound(): Promise<void> {
    return this.playErrorSound();
  }

  /**
   * Play background music (looped)
   */
  async playBackgroundMusic(): Promise<void> {
    if (!this.soundEnabled) return;

    try {
      const player = this.soundPlayers.get("background");
      if (player) {
        await player.sound.setIsLoopingAsync(true);
        await player.sound.playAsync();
        player.isPlaying = true;
      }
    } catch (error) {
      console.error("Failed to play background music:", error);
    }
  }

  /**
   * Stop background music
   */
  async stopBackgroundMusic(): Promise<void> {
    try {
      const player = this.soundPlayers.get("background");
      if (player && player.isPlaying) {
        await player.sound.stopAsync();
        player.isPlaying = false;
      }
    } catch (error) {
      console.error("Failed to stop background music:", error);
    }
  }

  /**
   * Stop all sounds
   */
  async stopAllSounds(): Promise<void> {
    try {
      for (const [, player] of this.soundPlayers) {
        await player.sound.stopAsync();
        player.isPlaying = false;
      }
    } catch (error) {
      console.error("Failed to stop all sounds:", error);
    }
  }

  /**
   * Cleanup and release all audio resources
   */
  async cleanup(): Promise<void> {
    try {
      await this.stopAllSounds();
      for (const [, player] of this.soundPlayers) {
        await player.sound.unloadAsync();
      }
      this.soundPlayers.clear();
      this.initialized = false;
    } catch (error) {
      console.error("Failed to cleanup audio:", error);
    }
  }

  /**
   * Get sound player for direct control
   */
  getSoundPlayer(key: string): SoundPlayer | undefined {
    return this.soundPlayers.get(key);
  }

  /**
   * Get all loaded sounds
   */
  getLoadedSounds(): string[] {
    return Array.from(this.soundPlayers.keys());
  }

  /**
   * Check if a sound is currently playing
   */
  isPlaying(key: string): boolean {
    const player = this.soundPlayers.get(key);
    return player?.isPlaying ?? false;
  }
}

export const audioManagerEnhanced = AudioManagerEnhanced.getInstance();
