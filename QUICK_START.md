# Bubble Rescue - Quick Start Guide

## 🚀 Running the App

### Prerequisites
Make sure you have:
- Node.js and npm/pnpm installed
- Expo CLI installed (`npm install -g expo-cli`)
- A device or emulator (iOS/Android)

### Installation & Running

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# This will start both the server and metro bundler
```

### Testing Platforms

#### Web Browser
1. Once the dev server is running, press `w` to open in web browser
2. Or navigate to `http://localhost:8081`
3. Game canvas won't be perfectly optimized for web, but functionality works

#### iOS
```bash
pnpm ios
```
- Requires Mac with Xcode
- Will open iOS Simulator
- Best visual experience with full haptic feedback

#### Android
```bash
pnpm android
```
- Requires Android Emulator or connected Android device
- Good visual experience with haptic feedback support

---

## 🎮 Testing the Game

### Quick Test Flow

1. **Home Screen**
   - Verify title displays correctly
   - Check high score display (0 if first run)
   - Check creature counter (3/11 for first run)

2. **Play Button**
   - Tap the large blue Play button
   - Should navigate to game screen

3. **Gameplay**
   - Bubbles should appear from bottom and float up
   - Score display at top center
   - Combo indicator on left side
   - Try tapping bubbles - they should pop
   - Watch for particle effects (sparkles, ripples)

4. **Game Over**
   - Miss a bubble (let it go off top) → Game Over modal
   - Or tap a red danger bubble (if appear)
   - Modal shows: Score, High Score comparison, New creatures found

5. **Collection**
   - From home, tap "🦋 View Collection"
   - Should see grid of creatures
   - Green/common creatures visible
   - Locked creatures show as gray locks
   - Progress bar shows collection %

6. **Data Persistence**
   - Play a game and pause it with high score
   - Click "Play Again" 
   - Click home
   - High score should persist
   - Collection should show new creatures

---

## 🐛 Troubleshooting

### Issue: App won't start
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `pnpm install`
- Clear cache: `pnpm expo start -c`

### Issue: Particles not showing
- Animations should still appear with React Native Reanimated
- Check browser console for errors
- Make sure AnimatedParticles component imported correctly

### Issue: Audio not working
- Audio manager is initialized but needs sound files
- Sounds are optional for gameplay to work
- Game functions fine without audio for testing

### Issue: Haptics not working
- Only available on actual iOS/Android devices
- Web and emulators may not support haptic feedback
- Game works fine without haptics

### Issue: Type errors in development
- These are TypeScript configuration issues, not runtime errors
- App should still run fine
- Ignore `nativewind/types` and `node` type errors in tsconfig

---

## 📊 Game Mechanics to Test

### Bubble Types
- **White bubbles** (Normal): 1 point
- **Light blue bubbles** (Bonus): 3 points
- **Red bubbles** (Danger): Game over if tapped ⚠️
- **Gold bubbles** (Timed): Disappear after 3 seconds ⏱️

### Combo System
- Tap 3 bubbles in a row → 2x multiplier
- Tap 6 bubbles in a row → 3x multiplier
- Tap red danger bubble → Combo resets
- Miss a bubble → Combo resets and game over

### Difficulty Scaling
- First 5 seconds: mostly normal bubbles
- After ~10 seconds: danger bubbles appear
- Spawn rate increases over time
- More bubbles on screen at higher difficulty

### Creatures
- Start with 3: Butterfly 🦋, Bird 🐦, Firefly ✨
- Unlock new creatures by popping bubbles
- Total 11 creatures to find
- Each creature in each bubble randomly assigned

---

## ✅ Success Criteria

Game is working correctly if:
- ✅ Can start a game and bubbles appear
- ✅ Can tap bubbles and they pop/disappear
- ✅ Score increases on successful pops
- ✅ Combo builds and shows multiplier
- ✅ Game ends when you miss a bubble or hit danger
- ✅ Game over screen shows score and high score
- ✅ High score persists after game resets
- ✅ Collection screen shows creatures found
- ✅ Creature count increases after finding new ones
- ✅ Particle effects appear when bubbles pop
- ✅ Haptic feedback works on device
- ✅ Audio initialize without crashing
- ✅ Navigation between screens works smoothly

---

## 🎯 Optional: Testing Advanced Features

### Testing Persistence
1. Play a game
2. Get a high score
3. Quit the app completely
4. Reopen the app
5. Check that high score is still there ✓

### Testing Creatures
1. Play multiple games
2. Try to unlock different creatures
3. Go to Collection to see your progress
4. Note which creatures are unlocked

### Testing Audio (when implemented)
1. Check Settings to toggle sound
2. Play a game with sound on/off
3. Verify combo sounds play at 3, 6, 10 streak

### Testing Haptics
1. Go to Settings
2. Toggle haptics on/off
3. Play a game and feel the feedback on taps

---

## 📝 Notes for Development

- Particles are using React Native Reanimated for smooth 60fps animations
- Game loop runs at ~60fps using requestAnimationFrame
- Physics calculations use simple gravity and drift equations
- All game state saved to AsyncStorage automatically
- Audio files can be added later without breaking gameplay

---

## Need Help?

If encountering issues:
1. Check console for error messages: `Ctrl+Shift+I` (browser) 
2. Check Expo logs: Application output in terminal
3. Try clearing cache and reinstalling
4. Make sure all dependencies are installed: `pnpm install`

Enjoy! 🫧✨
