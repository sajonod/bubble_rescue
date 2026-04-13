# Bubble Rescue - Interface Design Document

## Overview

**Bubble Rescue** is a calming, one-tap mobile game designed for portrait orientation (9:16) and one-handed usage. The aesthetic is dreamy, pastel-based, and highly satisfying, with a focus on visual and haptic feedback to create an addictive experience.

## Screen List

The app consists of the following core screens:

1. **Home Screen** - Main menu with play button, high score display, and collection access
2. **Gameplay Screen** - The core game loop with floating bubbles, score display, and combo indicator
3. **Game Over Screen** - Results summary with retry and revive options
4. **Collection Gallery** - Creature unlock gallery showing progress
5. **Settings Screen** - Audio/haptics toggle, remove ads option

## Primary Content & Functionality

### Home Screen
- **Hero Title**: "Bubble Rescue" with soft glow effect
- **Play Button**: Large, glowing bubble-shaped button as primary CTA
- **High Score Display**: Top-right corner showing best score
- **Collection Icon**: Bottom-left linking to creature gallery
- **Settings Icon**: Bottom-right for audio/haptics settings
- **Background**: Animated pastel gradient with floating decorative bubbles
- **Creatures**: Small animated creatures (fairy, butterfly) floating in background

### Gameplay Screen
- **Score Display**: Top center in ornate banner, large golden text
- **Combo Indicator**: Left-center, glowing text (e.g., "Combo x5") that scales up on streak
- **Game Area**: Full-screen canvas for bubble physics and rendering
- **Bubbles**: Floating iridescent bubbles with creatures inside, varying sizes
- **Visual Feedback**: Ripple/sparkle effects on tap, screen shake on combo milestones
- **Background**: Themed (Sky, Forest, Ocean, Night) with parallax effect

### Game Over Screen
- **Mission Complete Title**: Celebratory text with glow
- **Score Summary**: Current score and new best score (if applicable)
- **New Discovery**: Badge showing newly unlocked creature (if any)
- **Retry Button**: Teal bubble-shaped button to play again
- **Watch to Revive**: Golden button with play icon for rewarded video ad
- **Blurred Background**: Faded gameplay behind modal

### Collection Gallery
- **Grid Layout**: 3x3 grid of creature cards
- **Unlocked Creatures**: Show full-color creature art with name
- **Locked Creatures**: Greyed-out silhouette with lock icon and "???" placeholder
- **Progress Bar**: Show collection completion percentage
- **Background**: Night-themed dark gradient with stars

### Settings Screen
- **Audio Toggle**: Switch for background music on/off
- **Haptics Toggle**: Switch for vibration feedback
- **Remove Ads**: IAP button to remove ads permanently
- **About**: Version info and credits

## Key User Flows

### Play Session Flow
1. User taps "Play" on home screen
2. Gameplay screen loads with initial bubbles spawning
3. User taps bubbles to pop them and free creatures
4. Score increases, combo builds on consecutive pops
5. Difficulty increases (faster spawn rate, more bubble types)
6. Game ends on mistake (danger bubble or missed bubble)
7. Game Over screen shows results and new discoveries
8. User chooses to retry or return to home

### Collection Unlock Flow
1. User pops bubbles during gameplay
2. Each creature type has a spawn chance
3. First time a creature appears, it's added to collection
4. Game Over screen shows "New Discovery!" badge
5. Collection gallery updates to show newly unlocked creature
6. Rare creatures (fairy, dragon, spirit) provide extra satisfaction

## Color Choices

### Primary Palette
- **Background Gradient**: Soft pink (#F5D5E8) to lavender (#E8D5F5)
- **Bubble Base**: Translucent white with iridescent shimmer
- **Accent Colors**: 
  - Teal (#4DD9E8) for primary buttons and UI
  - Golden (#FFD700) for score and combo text
  - Soft green (#A8E6CF) for success states
  - Coral (#FF8A80) for danger bubbles

### Theme-Specific Backgrounds
- **Sky**: Light blue with cloud bokeh
- **Forest**: Green with leaf bokeh and warm lighting
- **Ocean**: Deep blue with water ripple effects
- **Night**: Dark purple with stars and moon

### Text Colors
- **Primary Text**: Deep purple (#4A3F7A) on light backgrounds
- **Secondary Text**: Medium purple (#7A6FA0)
- **Accent Text**: Golden (#FFD700) for important values

## Interaction Patterns

### One-Handed Usage
- All primary buttons positioned within thumb reach (center-bottom to center-top)
- Tap targets are large (minimum 44pt) for comfortable interaction
- No complex gestures required; single tap is the primary interaction

### Visual Feedback
- **Tap Response**: Bubble scales slightly and releases creature with animation
- **Combo Feedback**: Text glows brighter, screen shakes subtly, haptic pulse
- **Danger Feedback**: Red flash, error sound, haptic alert
- **Success Feedback**: Sparkles, chime sound, gentle haptic

### Haptic Strategy
- **Pop**: Light impact (15ms)
- **Combo Milestone**: Medium impact (25ms)
- **Danger Hit**: Strong alert (40ms)
- **Game Over**: Gentle notification (20ms)

## Animation Principles

- **Entrance**: Bubbles fade in and float up smoothly
- **Pop**: Ripple expands outward, creature flies away with trail
- **Combo Build**: Glow intensifies, text scales up
- **Transitions**: Smooth fade between screens (300ms)
- **Idle**: Subtle floating motion and gentle rotation

## Accessibility

- **Color Contrast**: All text meets WCAG AA standards
- **Text Sizing**: Minimum 16pt for body text, 24pt for headers
- **Touch Targets**: All interactive elements are 44pt minimum
- **Haptic Feedback**: Can be disabled in settings for users who prefer not to use it
