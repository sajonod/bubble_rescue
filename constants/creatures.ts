/**
 * Creature data for Bubble Rescue
 * Defines all creatures, their properties, and unlock conditions
 */

export interface Creature {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  unlockCondition?: string; // How to unlock this creature
}

export const CREATURES: Record<string, Creature> = {
  butterfly: {
    id: "butterfly",
    name: "Butterfly",
    emoji: "🦋",
    description: "A colorful butterfly on a delicate journey",
    rarity: "common",
  },
  bird: {
    id: "bird",
    name: "Bird",
    emoji: "🐦",
    description: "A chirpy little bird ready to fly free",
    rarity: "common",
  },
  firefly: {
    id: "firefly",
    name: "Firefly",
    emoji: "✨",
    description: "A glowing firefly lighting up the night",
    rarity: "common",
  },
  fairy: {
    id: "fairy",
    name: "Fairy",
    emoji: "🧚",
    description: "A magical fairy with sparkly wings",
    rarity: "uncommon",
    unlockCondition: "Get 3x combo",
  },
  dragon: {
    id: "dragon",
    name: "Dragon",
    emoji: "🐉",
    description: "A tiny but mighty dragon ready for adventure",
    rarity: "rare",
    unlockCondition: "Get 10x combo",
  },
  spirit: {
    id: "spirit",
    name: "Moon Spirit",
    emoji: "🌙",
    description: "A mystical spirit of the night sky",
    rarity: "rare",
    unlockCondition: "Rescue 50 creatures",
  },
  phoenix: {
    id: "phoenix",
    name: "Phoenix",
    emoji: "🔥",
    description: "A legendary bird of fire and rebirth",
    rarity: "legendary",
    unlockCondition: "Reach 5000 score",
  },
  unicorn: {
    id: "unicorn",
    name: "Unicorn",
    emoji: "🦄",
    description: "A magical unicorn with a shimmering horn",
    rarity: "legendary",
    unlockCondition: "Get 20 perfect combos",
  },
  owl: {
    id: "owl",
    name: "Owl",
    emoji: "🦉",
    description: "A wise owl watching over the night",
    rarity: "uncommon",
    unlockCondition: "Play 5 games",
  },
  penguin: {
    id: "penguin",
    name: "Penguin",
    emoji: "🐧",
    description: "A adorable waddling penguin",
    rarity: "uncommon",
    unlockCondition: "Score 1000 points",
  },
  whale: {
    id: "whale",
    name: "Whale",
    emoji: "🐋",
    description: "A majestic whale from ocean depths",
    rarity: "rare",
    unlockCondition: "Play for 10 minutes",
  },
};

// Get all creatures
export const getAllCreatures = (): Creature[] => {
  return Object.keys(CREATURES).map((key) => CREATURES[key as keyof typeof CREATURES]);
};

// Get creatures by rarity
export const getCreaturesByRarity = (
  rarity: "common" | "uncommon" | "rare" | "legendary"
): Creature[] => {
  return Object.keys(CREATURES)
    .map((key) => CREATURES[key as keyof typeof CREATURES])
    .filter((c: Creature) => c.rarity === rarity);
};

// Get common creatures (for initial unlock)
export const getCommonCreatures = (): Creature[] => {
  return getCreaturesByRarity("common");
};

// Get creature by id
export const getCreature = (id: string): Creature | undefined => {
  return CREATURES[id as keyof typeof CREATURES];
};

// Get emoji for creature
export const getCreatureEmoji = (id: string): string => {
  return CREATURES[id as keyof typeof CREATURES]?.emoji || "✨";
};

// Get name for creature
export const getCreatureName = (id: string): string => {
  return CREATURES[id as keyof typeof CREATURES]?.name || "Unknown";
};
