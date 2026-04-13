import { setAudioModeAsync } from "expo-audio";
import { Platform } from "react-native";

export class AudioManager {
  private static instance: AudioManager;
  private soundEnabled = true;

  private constructor() {
    this.initializeAudio();
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private async initializeAudio() {
    try {
      if (Platform.OS !== "web") {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      }
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  /**
   * Play a pop sound effect
   * For now, we'll use a simple beep-like sound
   * In production, you'd load actual audio files
   */
  playPopSound() {
    if (!this.soundEnabled) return;
    // Placeholder for actual sound playback
    // In production: load and play pop.mp3
  }

  /**
   * Play combo milestone sound
   */
  playComboSound() {
    if (!this.soundEnabled) return;
    // Placeholder for actual sound playback
    // In production: load and play chime.mp3
  }

  /**
   * Play danger/error sound
   */
  playErrorSound() {
    if (!this.soundEnabled) return;
    // Placeholder for actual sound playback
    // In production: load and play error.mp3
  }

  /**
   * Play background music
   */
  playBackgroundMusic() {
    if (!this.soundEnabled) return;
    // Placeholder for actual sound playback
    // In production: load and play background-music.mp3 with loop
  }

  /**
   * Stop all sounds
   */
  stopAllSounds() {
    // Placeholder for stopping all audio
  }
}

export const audioManager = AudioManager.getInstance();
