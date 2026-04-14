/**
 * Bubble Rescue - Core Game Engine
 * Handles physics, bubble spawning, collision detection, and game state
 */

import { getCommonCreatures } from "@/constants/creatures";

export interface Bubble {
  id: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  type: "normal" | "bonus" | "danger" | "timed";
  creature: CreatureType;
  createdAt: number;
  timedDuration?: number; // For timed bubbles
  isPopped: boolean;
}

export type CreatureType =
  | "butterfly"
  | "bird"
  | "firefly"
  | "fairy"
  | "dragon"
  | "spirit";

export interface GameState {
  score: number;
  combo: number;
  comboMultiplier: number;
  isGameOver: boolean;
  bubbles: Bubble[];
  spawnRate: number;
  difficulty: number;
  sessionTime: number;
  lastSpawnTime: number;
  newCreatures: CreatureType[];
}

export class GameEngine {
  private gameState: GameState;
  private readonly SCREEN_WIDTH: number;
  private readonly SCREEN_HEIGHT: number;
  private readonly BUBBLE_RADIUS_MIN = 30;
  private readonly BUBBLE_RADIUS_MAX = 50;
  private readonly INITIAL_SPAWN_RATE = 1500; // ms between spawns
  private readonly MIN_SPAWN_RATE = 500; // ms
  private readonly GRAVITY = 0.3;
  private readonly DRIFT_SPEED = 0.5;
  private readonly MAX_BUBBLES = 15;
  private readonly COMBO_THRESHOLD_X2 = 3;
  private readonly COMBO_THRESHOLD_X3 = 6;
  private bubbleIdCounter = 0;
  private unlockedCreatures: Set<CreatureType> = new Set();

  constructor(screenWidth: number, screenHeight: number, unlockedCreatures?: Set<CreatureType>) {
    this.SCREEN_WIDTH = screenWidth;
    this.SCREEN_HEIGHT = screenHeight;

    this.gameState = {
      score: 0,
      combo: 0,
      comboMultiplier: 1,
      isGameOver: false,
      bubbles: [],
      spawnRate: this.INITIAL_SPAWN_RATE,
      difficulty: 0,
      sessionTime: 0,
      lastSpawnTime: 0,
      newCreatures: [],
    };

    // Initialize with common creatures or provided set
    if (unlockedCreatures) {
      this.unlockedCreatures = unlockedCreatures;
    } else {
      // Initialize with common creatures
      getCommonCreatures().forEach(c => {
        this.unlockedCreatures.add(c.id as CreatureType);
      });
    }
  }

  /**
   * Update game state for a single frame
   */
  update(deltaTime: number): void {
    if (this.gameState.isGameOver) return;

    this.gameState.sessionTime += deltaTime;

    // Update difficulty based on time
    this.gameState.difficulty = Math.floor(this.gameState.sessionTime / 5000); // Increase every 5 seconds
    this.gameState.spawnRate = Math.max(
      this.MIN_SPAWN_RATE,
      this.INITIAL_SPAWN_RATE - this.gameState.difficulty * 100
    );

    // Update bubbles
    this.updateBubbles(deltaTime);

    // Spawn new bubbles
    if (
      this.gameState.sessionTime - this.gameState.lastSpawnTime >
      this.gameState.spawnRate
    ) {
      this.spawnBubble();
      this.gameState.lastSpawnTime = this.gameState.sessionTime;
    }

    // Check for missed bubbles (reached top of screen)
    this.checkMissedBubbles();
  }

  /**
   * Update physics for all bubbles
   */
  private updateBubbles(deltaTime: number): void {
    this.gameState.bubbles = this.gameState.bubbles.filter((bubble) => {
      if (bubble.isPopped) return false;

      // Apply gravity (upward movement)
      bubble.vy -= this.GRAVITY;

      // Apply drift (horizontal movement)
      bubble.vx += (Math.random() - 0.5) * this.DRIFT_SPEED;
      bubble.vx *= 0.95; // Dampen horizontal movement

      // Update position
      bubble.x += bubble.vx;
      bubble.y += bubble.vy;

      // Bounce off sides
      if (bubble.x - bubble.radius < 0) {
        bubble.x = bubble.radius;
        bubble.vx = Math.abs(bubble.vx);
      }
      if (bubble.x + bubble.radius > this.SCREEN_WIDTH) {
        bubble.x = this.SCREEN_WIDTH - bubble.radius;
        bubble.vx = -Math.abs(bubble.vx);
      }

      // Keep bubble in bounds vertically (don't let it go below screen)
      if (bubble.y + bubble.radius > this.SCREEN_HEIGHT) {
        bubble.y = this.SCREEN_HEIGHT - bubble.radius;
        bubble.vy = 0;
      }

      return true;
    });
  }

  /**
   * Spawn a new bubble
   */
  private spawnBubble(): void {
    if (this.gameState.bubbles.length >= this.MAX_BUBBLES) return;

    const radius = this.BUBBLE_RADIUS_MIN +
      Math.random() * (this.BUBBLE_RADIUS_MAX - this.BUBBLE_RADIUS_MIN);

    const x = radius + Math.random() * (this.SCREEN_WIDTH - 2 * radius);
    const y = this.SCREEN_HEIGHT + radius; // Spawn below screen

    // Determine bubble type based on difficulty
    let type: Bubble["type"] = "normal";
    const rand = Math.random();

    if (this.gameState.difficulty > 3) {
      if (rand < 0.1) type = "danger";
      else if (rand < 0.2) type = "bonus";
      else if (rand < 0.25) type = "timed";
    } else if (this.gameState.difficulty > 1) {
      if (rand < 0.05) type = "danger";
      else if (rand < 0.15) type = "bonus";
    }

    // Select a creature
    const creatures = Array.from(this.unlockedCreatures);
    const creature = creatures[Math.floor(Math.random() * creatures.length)];

    const bubble: Bubble = {
      id: `bubble-${this.bubbleIdCounter++}`,
      x,
      y,
      radius,
      vx: (Math.random() - 0.5) * 2,
      vy: -2 - Math.random() * 2, // Initial upward velocity
      type,
      creature,
      createdAt: this.gameState.sessionTime,
      timedDuration: type === "timed" ? 3000 : undefined, // 3 seconds for timed bubbles
      isPopped: false,
    };

    this.gameState.bubbles.push(bubble);
  }

  /**
   * Check if any bubbles have been missed (reached top of screen)
   */
  private checkMissedBubbles(): void {
    for (const bubble of this.gameState.bubbles) {
      if (bubble.y < -bubble.radius && !bubble.isPopped) {
        // Bubble missed
        this.endGame();
        return;
      }

      // Check for timed bubble timeout
      if (bubble.type === "timed" && bubble.timedDuration) {
        const elapsed = this.gameState.sessionTime - bubble.createdAt;
        if (elapsed > bubble.timedDuration && !bubble.isPopped) {
          this.endGame();
          return;
        }
      }
    }
  }

  /**
   * Handle bubble tap
   */
  popBubble(bubbleId: string): boolean {
    const bubble = this.gameState.bubbles.find((b) => b.id === bubbleId);
    if (!bubble || bubble.isPopped) return false;

    // Check for danger bubble
    if (bubble.type === "danger") {
      this.endGame();
      return false;
    }

    // Pop the bubble
    bubble.isPopped = true;

    // Check if this is a new creature
    if (!this.unlockedCreatures.has(bubble.creature)) {
      this.unlockedCreatures.add(bubble.creature);
      this.gameState.newCreatures.push(bubble.creature);
    }

    // Calculate score
    let points = 1;
    if (bubble.type === "bonus") {
      points = 3;
    }

    // Update combo
    this.gameState.combo++;
    if (this.gameState.combo >= this.COMBO_THRESHOLD_X3) {
      this.gameState.comboMultiplier = 3;
    } else if (this.gameState.combo >= this.COMBO_THRESHOLD_X2) {
      this.gameState.comboMultiplier = 2;
    } else {
      this.gameState.comboMultiplier = 1;
    }

    // Add score
    this.gameState.score += points * this.gameState.comboMultiplier;

    return true;
  }

  /**
   * Reset combo when a bubble is missed or danger is hit
   */
  resetCombo(): void {
    this.gameState.combo = 0;
    this.gameState.comboMultiplier = 1;
  }

  /**
   * End the game
   */
  endGame(): void {
    this.gameState.isGameOver = true;
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return this.gameState;
  }

  /**
   * Get bubble at position (for hit testing)
   */
  getBubbleAtPosition(x: number, y: number): Bubble | undefined {
    // Check bubbles in reverse order (top to bottom)
    for (let i = this.gameState.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.gameState.bubbles[i];
      if (bubble.isPopped) continue;

      const distance = Math.sqrt(
        Math.pow(bubble.x - x, 2) + Math.pow(bubble.y - y, 2)
      );

      if (distance <= bubble.radius) {
        return bubble;
      }
    }

    return undefined;
  }

  /**
   * Reset game for a new session
   */
  reset(): void {
    this.gameState = {
      score: 0,
      combo: 0,
      comboMultiplier: 1,
      isGameOver: false,
      bubbles: [],
      spawnRate: this.INITIAL_SPAWN_RATE,
      difficulty: 0,
      sessionTime: 0,
      lastSpawnTime: 0,
      newCreatures: [],
    };
    this.bubbleIdCounter = 0;
  }

  /**
   * Get unlocked creatures
   */
  getUnlockedCreatures(): CreatureType[] {
    return Array.from(this.unlockedCreatures);
  }

  /**
   * Manually unlock a creature (for testing)
   */
  unlockCreature(creature: CreatureType): void {
    this.unlockedCreatures.add(creature);
  }
}
