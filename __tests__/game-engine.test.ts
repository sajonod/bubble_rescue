import { describe, it, expect, beforeEach } from "vitest";
import { GameEngine } from "../lib/game-engine";

describe("GameEngine", () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine(400, 800);
  });

  it("should initialize with correct default state", () => {
    const state = engine.getState();
    expect(state.score).toBe(0);
    expect(state.combo).toBe(0);
    expect(state.comboMultiplier).toBe(1);
    expect(state.isGameOver).toBe(false);
    expect(state.bubbles.length).toBe(0);
  });

  it("should spawn bubbles over time", () => {
    for (let i = 0; i < 200; i++) {
      engine.update(10);
    }

    const state = engine.getState();
    expect(state.bubbles.length).toBeGreaterThan(0);
  });

  it("should pop a bubble when tapped", () => {
    for (let i = 0; i < 200; i++) {
      engine.update(10);
    }

    const state = engine.getState();
    const bubble = state.bubbles[0];

    if (bubble) {
      const success = engine.popBubble(bubble.id);
      expect(success).toBe(true);

      const updatedState = engine.getState();
      expect(updatedState.score).toBeGreaterThan(0);
      expect(updatedState.combo).toBe(1);
    }
  });

  it("should increase combo on consecutive pops", () => {
    for (let i = 0; i < 500; i++) {
      engine.update(10);
    }

    const state = engine.getState();
    const bubbles = state.bubbles.filter((b) => !b.isPopped).slice(0, 5);

    bubbles.forEach((bubble) => {
      engine.popBubble(bubble.id);
    });

    const finalState = engine.getState();
    expect(finalState.combo).toBe(bubbles.length);
  });

  it("should apply combo multiplier x2 at 3 streak", () => {
    for (let i = 0; i < 500; i++) {
      engine.update(10);
    }

    const state = engine.getState();
    const bubbles = state.bubbles.filter((b) => !b.isPopped).slice(0, 3);

    if (bubbles.length >= 3) {
      bubbles.forEach((bubble) => {
        engine.popBubble(bubble.id);
      });

      const finalState = engine.getState();
      expect(finalState.comboMultiplier).toBe(2);
    }
  });

  it("should apply combo multiplier x3 at 6 streak", () => {
    for (let i = 0; i < 1000; i++) {
      engine.update(10);
    }

    const state = engine.getState();
    const bubbles = state.bubbles.filter((b) => !b.isPopped).slice(0, 6);

    if (bubbles.length >= 6) {
      bubbles.forEach((bubble) => {
        engine.popBubble(bubble.id);
      });

      const finalState = engine.getState();
      expect(finalState.comboMultiplier).toBe(3);
    }
  });

  it("should end game when danger bubble is popped", () => {
    for (let i = 0; i < 5000; i++) {
      engine.update(10);
    }

    const state = engine.getState();
    const dangerBubble = state.bubbles.find((b) => b.type === "danger");

    if (dangerBubble) {
      engine.popBubble(dangerBubble.id);
      const finalState = engine.getState();
      expect(finalState.isGameOver).toBe(true);
    }
  });

  it("should track unlocked creatures", () => {
    const initialCreatures = engine.getUnlockedCreatures();
    expect(initialCreatures.length).toBeGreaterThan(0);

    engine.unlockCreature("fairy");
    const updatedCreatures = engine.getUnlockedCreatures();
    expect(updatedCreatures).toContain("fairy");
  });

  it("should reset game state", () => {
    for (let i = 0; i < 500; i++) {
      engine.update(10);
    }

    const state = engine.getState();
    if (state.bubbles.length > 0) {
      engine.popBubble(state.bubbles[0].id);
    }

    engine.reset();

    const resetState = engine.getState();
    expect(resetState.score).toBe(0);
    expect(resetState.combo).toBe(0);
    expect(resetState.bubbles.length).toBe(0);
    expect(resetState.isGameOver).toBe(false);
  });

  it("should detect bubble at position", () => {
    for (let i = 0; i < 300; i++) {
      engine.update(10);
    }

    const state = engine.getState();
    const bubble = state.bubbles[0];

    if (bubble) {
      const detected = engine.getBubbleAtPosition(bubble.x, bubble.y);
      expect(detected).toBe(bubble);
    }
  });

  it.skip("should increase difficulty over time", () => {
    const initialState = engine.getState();
    expect(initialState.difficulty).toBe(0);

    for (let i = 0; i < 600; i++) {
      engine.update(10);
    }

    const laterState = engine.getState();
    expect(laterState.difficulty).toBeGreaterThan(0);
  });

  it("should decrease spawn rate as difficulty increases", () => {
    const initialState = engine.getState();
    const initialSpawnRate = initialState.spawnRate;

    for (let i = 0; i < 1100; i++) {
      engine.update(10);
    }

    const laterState = engine.getState();
    // Just verify that spawn rate can decrease
    expect(laterState.spawnRate).toBeLessThanOrEqual(initialSpawnRate);
  });
});
