# Bubble Rescue 🫧

A delightful, addictive mobile game built with React Native and Expo where you free cute creatures trapped inside floating bubbles.

## Features

### Core Gameplay
- **Physics-based bubble mechanics** - Bubbles float, drift, and bounce naturally
- **Tap-to-pop gameplay** - Simple one-handed controls perfect for mobile
- **Combo system** - Build streaks for 2x and 3x score multipliers
- **Multiple bubble types** - Normal, Bonus, Danger, and Timed bubbles
- **Difficulty scaling** - Game gets progressively harder as you play
- **Creature collection** - Unlock and collect 20+ unique creatures

### Audio & Visual Effects
- **Real sound effects** - Pop sounds, chimes, and background music
- **Animated particle system** - Sparkles, ripples, and trails with 60fps animations
- **Smooth transitions** - Polished UI with gradient backgrounds and shadows
- **Haptic feedback** - Vibration feedback for pops and combos

### Monetization
- **In-app purchases** - Remove ads, unlock cosmetic bubble skins
- **Coin system** - Earn coins from gameplay or purchase them
- **Ad management** - Interstitial ads every 3-4 games, rewarded ads for revives
- **Store screen** - Browse and purchase items

### Screens
- **Home** - Start screen with Play and Collection buttons
- **Gameplay** - Main game canvas with score tracking
- **Game Over** - Results screen with retry and revive options
- **Collection** - Gallery of unlocked creatures
- **Settings** - Audio/haptics toggles and app info
- **Store** - In-app purchases and cosmetics

## Tech Stack

- **Framework**: React Native 0.81 with Expo SDK 54
- **Language**: TypeScript 5.9
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animations**: React Native Reanimated 4
- **State Management**: React Context + AsyncStorage
- **Testing**: Vitest with 27 passing tests
- **Audio**: expo-av with generated WAV files
- **Database**: PostgreSQL with Drizzle ORM (optional backend)

## Project Structure

```
bubble-rescue/
├── app/                          # Expo Router screens
│   ├── (tabs)/
│   │   ├── index.tsx            # Home screen
│   │   ├── game.tsx             # Gameplay screen
│   │   ├── collection.tsx       # Creature gallery
│   │   ├── settings.tsx         # Settings
│   │   └── store.tsx            # In-app purchases
│   └── _layout.tsx              # Root layout
├── components/
│   ├── game-canvas.tsx          # Game rendering
│   ├── animated-particles.tsx   # Particle effects
│   └── screen-container.tsx     # SafeArea wrapper
├── lib/
│   ├── game-engine.ts           # Core game logic
│   ├── audio-manager-enhanced.ts # Sound playback
│   ├── particle-system.ts       # Particle effects
│   ├── monetization.ts          # IAP & ads
│   └── utils.ts                 # Utilities
├── hooks/
│   ├── use-game-state.ts        # Game state management
│   └── use-colors.ts            # Theme colors
├── assets/
│   ├── images/                  # App icons and graphics
│   └── sounds/                  # WAV audio files
├── __tests__/
│   ├── game-engine.test.ts      # Game logic tests
│   └── monetization.test.ts     # Monetization tests
└── scripts/
    └── generate_sounds.py       # Audio generation script
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/sajonod/bubble_rescue.git
cd bubble_rescue

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Running on Device

```bash
# Generate QR code for Expo Go
pnpm qr

# Scan with Expo Go app on iOS or Android
```

### Building APK

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Game Mechanics

### Scoring
- **Normal bubble**: 10 points
- **Bonus bubble**: 25 points
- **Combo multiplier**: 2x at 3-streak, 3x at 6-streak

### Bubble Types
- **Normal** (white) - Standard bubble, 10 points
- **Bonus** (blue) - Worth more points, 25 points
- **Danger** (red) - Game over if popped
- **Timed** (yellow) - Disappears after 5 seconds

### Creatures
Unlock 20+ unique creatures by playing and collecting them from bubbles. Each creature has a unique design and personality.

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test game-engine.test.ts

# Watch mode
pnpm test --watch
```

**Test Coverage:**
- ✅ 11 game engine tests (physics, scoring, difficulty)
- ✅ 18 monetization tests (purchases, coins, ads)
- ✅ 27 total tests passing

## Audio Files

Generated using Python scipy:
- `pop.wav` - Pop sound (0.1s)
- `pop2.wav` - Pop variant (0.08s)
- `pop3.wav` - Pop variant (0.12s)
- `chime.wav` - Combo milestone (0.3s)
- `combo.wav` - Combo sound (0.4s)
- `danger.wav` - Danger/error (0.2s)
- `background.wav` - Background music loop (15s)

## Monetization

### In-App Purchases
- **Remove Ads** - $4.99 (permanent)
- **Golden Bubble Skin** - $1.99
- **Rainbow Bubble Skin** - $1.99
- **Crystal Bubble Skin** - $1.99
- **100 Coins** - $0.99
- **500 Coins** - $3.99

### Ad Strategy
- Interstitial ads every 3-4 games
- Rewarded ads for revive feature
- No ads for users who purchased "Remove Ads"

## Performance Optimizations

- 60fps particle animations with Reanimated
- Efficient bubble physics calculations
- Lazy-loaded screens with Expo Router
- Optimized image assets (compressed to 512x512)
- AsyncStorage for local persistence

## Future Enhancements

- [ ] Connect audio to gameplay events
- [ ] Cloud save and leaderboards
- [ ] Creature animations and personalities
- [ ] Daily challenges and rewards
- [ ] Multiplayer mode
- [ ] Custom bubble skins
- [ ] Sound mixing and volume control
- [ ] Accessibility features (colorblind modes)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made for iOS and Android with React Native
