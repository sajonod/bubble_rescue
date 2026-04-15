/**
 * Bubble Rescue - Core Game Engine
 * Handles physics, bubble spawning, collision detection, and game state
 */

import { getCommonCreatures, getAllCreatures } from "@/constants/creatures";

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

export interface FlyingCreature {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  creature: CreatureType;
  rotation: number;
  scale: number;
  opacity: number;
  life: number;
  swayOffset: number;
}

export type CreatureType =
  | "butterfly"
  | "bird"
  | "firefly"
  | "fairy"
  | "dragon"
  | "spirit"
  | "phoenix"
  | "unicorn"
  | "owl"
  | "penguin"
  | "whale";

export interface GameState {
  score: number;
  combo: number;
  comboMultiplier: number;
  isGameOver: boolean;
  bubbles: Bubble[];
  flyingCreatures: FlyingCreature[];
  spawnRate: number;
  difficulty: number;
  sessionTime: number;
  lastSpawnTime: number;
  newCreatures: CreatureType[];
  timeScale: number;
  slowMoTimer: number;
  shakeIntensity: number;
}

export class GameEngine {
  private gameState: GameState;
  private readonly SCREEN_WIDTH: number;
  private readonly SCREEN_HEIGHT: number;
  private readonly BUBBLE_RADIUS_MIN = 35;
  private readonly BUBBLE_RADIUS_MAX = 55;
  private readonly INITIAL_SPAWN_RATE = 1800;
  private readonly MIN_SPAWN_RATE = 600;
  private readonly GRAVITY = 0.05;
  private readonly DRIFT_SPEED = 0.02;
  private readonly MAX_BUBBLES = 15;
  private readonly COMBO_THRESHOLD_X2 = 3;
  private readonly COMBO_THRESHOLD_X3 = 6;
  private bubbleIdCounter = 0;
  private creatureIdCounter = 0;
  private unlockedCreatures: Set<CreatureType> = new Set();
  private allCreatureIds: CreatureType[] = [];

  constructor(screenWidth: number, screenHeight: number, unlockedCreatures?: Set<CreatureType>) {
    this.SCREEN_WIDTH = screenWidth;
    this.SCREEN_HEIGHT = screenHeight;
    this.allCreatureIds = getAllCreatures().map(c => c.id as CreatureType);

    this.gameState = {
      score: 0,
      combo: 0,
      comboMultiplier: 1,
      isGameOver: false,
      bubbles: [],
      flyingCreatures: [],
      spawnRate: 1800,
      difficulty: 0,
      sessionTime: 0,
      lastSpawnTime: -1800,
      newCreatures: [],
      timeScale: 1.0,
      slowMoTimer: 0,
      shakeIntensity: 0,
    };

    if (unlockedCreatures && unlockedCreatures.size > 0) {
      this.unlockedCreatures = unlockedCreatures;
    } else {
      getCommonCreatures().forEach(c => {
        this.unlockedCreatures.add(c.id as CreatureType);
      });
    }
  }

  update(deltaTime: number): void {
    if (this.gameState.isGameOver) return;

    const scaledDelta = deltaTime * this.gameState.timeScale;
    this.gameState.sessionTime += scaledDelta;

    if (this.gameState.slowMoTimer > 0) {
      this.gameState.slowMoTimer -= deltaTime;
      if (this.gameState.slowMoTimer <= 0) {
        this.gameState.timeScale = 1.0;
        this.gameState.slowMoTimer = 0;
      }
    }

    if (this.gameState.shakeIntensity > 0) {
      this.gameState.shakeIntensity *= 0.85;
      if (this.gameState.shakeIntensity < 0.1) this.gameState.shakeIntensity = 0;
    }

    this.gameState.difficulty = Math.floor(this.gameState.sessionTime / 8000);
    this.gameState.spawnRate = Math.max(
      this.MIN_SPAWN_RATE,
      this.INITIAL_SPAWN_RATE - this.gameState.difficulty * 150
    );

    this.updateBubbles(scaledDelta);
    this.updateFlyingCreatures(scaledDelta);

    if (
      this.gameState.sessionTime - this.gameState.lastSpawnTime >
      this.gameState.spawnRate
    ) {
      this.spawnBubble();
      this.gameState.lastSpawnTime = this.gameState.sessionTime;
    }

    this.checkFailConditions();
  }

  private updateBubbles(deltaTime: number): void {
    this.gameState.bubbles = this.gameState.bubbles.filter((bubble) => {
      if (bubble.isPopped) return false;

      bubble.vy -= this.GRAVITY * (deltaTime / 16);
      bubble.vx += (Math.random() - 0.5) * this.DRIFT_SPEED * (deltaTime / 16);
      bubble.vx *= 0.98;

      bubble.x += bubble.vx * (deltaTime / 16);
      bubble.y += bubble.vy * (deltaTime / 16);

      if (bubble.x - bubble.radius < 0) {
        bubble.x = bubble.radius;
        bubble.vx = Math.abs(bubble.vx) * 0.8;
      }
      if (bubble.x + bubble.radius > this.SCREEN_WIDTH) {
        bubble.x = this.SCREEN_WIDTH - bubble.radius;
        bubble.vx = -Math.abs(bubble.vx) * 0.8;
      }

      return true;
    });
  }

  private updateFlyingCreatures(deltaTime: number): void {
    this.gameState.flyingCreatures = this.gameState.flyingCreatures.filter((c) => {
      c.life -= deltaTime / 1500;
      if (c.life <= 0) return false;

      // Unique swaying movement
      const sway = Math.sin(this.gameState.sessionTime / 200 + c.swayOffset) * 2;

      c.x += (c.vx + sway) * (deltaTime / 16);
      c.y += c.vy * (deltaTime / 16);
      c.vy -= 0.04 * (deltaTime / 16);
      c.opacity = c.life;
      c.scale = 1 + (1 - c.life) * 0.5;
      c.rotation = Math.sin(this.gameState.sessionTime / 100) * 10;

      return true;
    });
  }

  private spawnBubble(): void {
    const radius = this.BUBBLE_RADIUS_MIN +
      Math.random() * (this.BUBBLE_RADIUS_MAX - this.BUBBLE_RADIUS_MIN);

    const x = radius + Math.random() * (this.SCREEN_WIDTH - 2 * radius);
    const y = this.SCREEN_HEIGHT + radius;

    let type: Bubble["type"] = "normal";
    const rand = Math.random();

    if (this.gameState.difficulty > 4) {
      if (rand < 0.12) type = "danger";
      else if (rand < 0.25) type = "bonus";
      else if (rand < 0.35) type = "timed";
    } else if (this.gameState.difficulty > 1) {
      if (rand < 0.08) type = "danger";
      else if (rand < 0.20) type = "bonus";
    }

    // Creature Selection: 80% unlocked, 20% random (discovery)
    let creature: CreatureType;
    if (Math.random() < 0.8) {
      const unlocked = Array.from(this.unlockedCreatures);
      creature = unlocked[Math.floor(Math.random() * unlocked.length)];
    } else {
      creature = this.allCreatureIds[Math.floor(Math.random() * this.allCreatureIds.length)];
    }

    const bubble: Bubble = {
      id: `bubble-${this.bubbleIdCounter++}`,
      x,
      y,
      radius,
      vx: (Math.random() - 0.5) * 2.5,
      vy: -1.8 - Math.random() * 1.5,
      type,
      creature,
      createdAt: this.gameState.sessionTime,
      timedDuration: type === "timed" ? 4000 : undefined,
      isPopped: false,
    };

    this.gameState.bubbles.push(bubble);
  }

  private checkFailConditions(): void {
    if (this.gameState.bubbles.filter(b => !b.isPopped).length >= this.MAX_BUBBLES) {
      this.endGame();
      return;
    }

    for (const bubble of this.gameState.bubbles) {
      if (bubble.y < -bubble.radius && !bubble.isPopped) {
        if (bubble.type !== "danger") {
          this.endGame();
          return;
        }
      }

      if (bubble.type === "timed" && bubble.timedDuration) {
        const elapsed = this.gameState.sessionTime - bubble.createdAt;
        if (elapsed > bubble.timedDuration && !bubble.isPopped) {
          this.endGame();
          return;
        }
      }
    }
  }

  popBubble(bubbleId: string): boolean {
    const bubble = this.gameState.bubbles.find((b) => b.id === bubbleId);
    if (!bubble || bubble.isPopped) return false;

    if (bubble.type === "danger") {
      this.endGame();
      return false;
    }

    bubble.isPopped = true;
    this.gameState.shakeIntensity = 6;

    // Track discovery
    if (!this.unlockedCreatures.has(bubble.creature)) {
      this.unlockedCreatures.add(bubble.creature);
      this.gameState.newCreatures.push(bubble.creature);
    }

    this.gameState.flyingCreatures.push({
      id: `creature-${this.creatureIdCounter++}`,
      x: bubble.x,
      y: bubble.y,
      vx: (Math.random() - 0.5) * 5,
      vy: -4 - Math.random() * 3,
      creature: bubble.creature,
      rotation: 0,
      scale: 1,
      opacity: 1,
      life: 1,
      swayOffset: Math.random() * 10,
    });

    let points = 1;
    if (bubble.type === "bonus") {
      points = 3;
      this.activateSlowMo();
    }

    this.gameState.combo++;
    if (this.gameState.combo >= this.COMBO_THRESHOLD_X3) {
      this.gameState.comboMultiplier = 3;
    } else if (this.gameState.combo >= this.COMBO_THRESHOLD_X2) {
      this.gameState.comboMultiplier = 2;
    } else {
      this.gameState.comboMultiplier = 1;
    }

    this.gameState.score += points * this.gameState.comboMultiplier;

    return true;
  }

  private activateSlowMo(): void {
    this.gameState.timeScale = 0.4;
    this.gameState.slowMoTimer = 2500;
  }

  endGame(): void {
    this.gameState.isGameOver = true;
  }

  getState(): GameState {
    return this.gameState;
  }

  getBubbleAtPosition(x: number, y: number): Bubble | undefined {
    for (let i = this.gameState.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.gameState.bubbles[i];
      if (bubble.isPopped) continue;

      const distance = Math.sqrt(
        Math.pow(bubble.x - x, 2) + Math.pow(bubble.y - y, 2)
      );

      if (distance <= bubble.radius + 15) {
        return bubble;
      }
    }
    return undefined;
  }

  reset(): void {
    this.gameState = {
      score: 0,
      combo: 0,
      comboMultiplier: 1,
      isGameOver: false,
      bubbles: [],
      flyingCreatures: [],
      spawnRate: this.INITIAL_SPAWN_RATE,
      difficulty: 0,
      sessionTime: 0,
      lastSpawnTime: -1800,
      newCreatures: [],
      timeScale: 1.0,
      slowMoTimer: 0,
      shakeIntensity: 0,
    };
    this.bubbleIdCounter = 0;
    this.creatureIdCounter = 0;
  }
}
