#!/usr/bin/env python3
"""
Generate sound effects for Bubble Rescue using numpy and scipy
"""

import numpy as np
from scipy.io import wavfile
import os

def generate_pop_sound(filename, duration=0.1, frequency=800):
    """Generate a pop sound effect"""
    sample_rate = 44100
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Create a decaying sine wave
    envelope = np.exp(-5 * t / duration)
    wave = np.sin(2 * np.pi * frequency * t) * envelope
    
    # Add some harmonics for richness
    wave += 0.5 * np.sin(2 * np.pi * frequency * 1.5 * t) * envelope
    wave += 0.3 * np.sin(2 * np.pi * frequency * 2 * t) * envelope
    
    # Normalize
    wave = (wave / np.max(np.abs(wave)) * 32767).astype(np.int16)
    
    wavfile.write(filename, sample_rate, wave)
    print(f"Generated {filename}")

def generate_chime_sound(filename, duration=0.3, base_freq=1000):
    """Generate a chime/combo sound effect"""
    sample_rate = 44100
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Create a decaying combination of frequencies
    envelope = np.exp(-3 * t / duration)
    
    # Multiple frequencies for a chime effect
    wave = (
        0.5 * np.sin(2 * np.pi * base_freq * t) +
        0.3 * np.sin(2 * np.pi * base_freq * 1.25 * t) +
        0.2 * np.sin(2 * np.pi * base_freq * 1.5 * t)
    ) * envelope
    
    # Normalize
    wave = (wave / np.max(np.abs(wave)) * 32767).astype(np.int16)
    
    wavfile.write(filename, sample_rate, wave)
    print(f"Generated {filename}")

def generate_danger_sound(filename, duration=0.2, base_freq=300):
    """Generate a danger/error sound effect"""
    sample_rate = 44100
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Create a warning beep
    envelope = np.exp(-4 * t / duration)
    
    # Lower frequency for danger
    wave = (
        0.7 * np.sin(2 * np.pi * base_freq * t) +
        0.3 * np.sin(2 * np.pi * base_freq * 0.8 * t)
    ) * envelope
    
    # Normalize
    wave = (wave / np.max(np.abs(wave)) * 32767).astype(np.int16)
    
    wavfile.write(filename, sample_rate, wave)
    print(f"Generated {filename}")

def generate_background_music(filename, duration=30, tempo_bpm=120):
    """Generate simple background music loop"""
    sample_rate = 44100
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # Simple melody pattern
    beat_duration = 60 / tempo_bpm
    beats = int(duration / beat_duration)
    
    # Create a simple pattern
    wave = np.zeros_like(t)
    
    # Base frequencies for a simple tune
    frequencies = [262, 294, 330, 349, 392, 440, 494, 523]  # C major scale
    
    for i, beat_time in enumerate(np.linspace(0, duration, beats)):
        beat_idx = i % len(frequencies)
        freq = frequencies[beat_idx]
        
        beat_start = int(beat_time * sample_rate)
        beat_end = int((beat_time + beat_duration * 0.8) * sample_rate)
        
        if beat_end <= len(t):
            beat_t = t[beat_start:beat_end]
            beat_envelope = np.exp(-2 * (beat_t - beat_time) / beat_duration)
            wave[beat_start:beat_end] += 0.3 * np.sin(2 * np.pi * freq * beat_t) * beat_envelope
    
    # Add some bass
    bass_freq = 110
    wave += 0.2 * np.sin(2 * np.pi * bass_freq * t) * np.exp(-0.5 * t / duration)
    
    # Normalize
    wave = (wave / np.max(np.abs(wave)) * 32767).astype(np.int16)
    
    wavfile.write(filename, sample_rate, wave)
    print(f"Generated {filename}")

if __name__ == "__main__":
    sounds_dir = os.path.dirname(os.path.abspath(__file__)) + "/../assets/sounds"
    os.makedirs(sounds_dir, exist_ok=True)
    
    print("Generating sound effects...")
    
    generate_pop_sound(f"{sounds_dir}/pop.wav", duration=0.1, frequency=800)
    generate_pop_sound(f"{sounds_dir}/pop2.wav", duration=0.08, frequency=900)
    generate_pop_sound(f"{sounds_dir}/pop3.wav", duration=0.12, frequency=700)
    
    generate_chime_sound(f"{sounds_dir}/chime.wav", duration=0.3, base_freq=1000)
    generate_chime_sound(f"{sounds_dir}/combo.wav", duration=0.4, base_freq=1200)
    
    generate_danger_sound(f"{sounds_dir}/danger.wav", duration=0.2, base_freq=300)
    
    generate_background_music(f"{sounds_dir}/background.wav", duration=30, tempo_bpm=120)
    
    print("All sounds generated successfully!")
