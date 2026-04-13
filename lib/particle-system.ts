/**
 * Particle System for Bubble Rescue
 * Handles visual effects like sparkles, pop ripples, and trails
 */

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0 to 1, where 1 is fully alive
  maxLife: number;
  size: number;
  color: string;
  type: "sparkle" | "ripple" | "trail";
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private particleIdCounter = 0;

  /**
   * Create sparkle particles for a pop effect
   */
  createPopEffect(x: number, y: number, count: number = 12): void {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const particle: Particle = {
        id: `particle-${this.particleIdCounter++}`,
        x,
        y,
        vx,
        vy,
        life: 1,
        maxLife: 0.6, // 600ms
        size: 4 + Math.random() * 4,
        color: this.getRandomSparkleColor(),
        type: "sparkle",
      };

      this.particles.push(particle);
    }
  }

  /**
   * Create a ripple effect
   */
  createRippleEffect(x: number, y: number): void {
    const particle: Particle = {
      id: `particle-${this.particleIdCounter++}`,
      x,
      y,
      vx: 0,
      vy: 0,
      life: 1,
      maxLife: 0.4, // 400ms
      size: 20,
      color: "rgba(255, 255, 255, 0.6)",
      type: "ripple",
    };

    this.particles.push(particle);
  }

  /**
   * Create a trail effect (for creatures flying away)
   */
  createTrailEffect(x: number, y: number, vx: number, vy: number): void {
    const particle: Particle = {
      id: `particle-${this.particleIdCounter++}`,
      x,
      y,
      vx: vx * 0.5,
      vy: vy * 0.5,
      life: 1,
      maxLife: 0.3,
      size: 6 + Math.random() * 4,
      color: this.getRandomCreatureColor(),
      type: "trail",
    };

    this.particles.push(particle);
  }

  /**
   * Update all particles
   */
  update(deltaTime: number): void {
    this.particles = this.particles.filter((p) => {
      p.life -= deltaTime / (p.maxLife * 1000);

      if (p.life <= 0) {
        return false;
      }

      // Apply gravity
      p.vy += 0.1;

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      return true;
    });
  }

  /**
   * Get all particles for rendering
   */
  getParticles(): Particle[] {
    return this.particles;
  }

  /**
   * Get particle opacity based on life
   */
  getParticleOpacity(particle: Particle): number {
    // Fade out at the end
    const fadeStart = 0.2;
    if (particle.life < fadeStart) {
      return particle.life / fadeStart;
    }
    return 1;
  }

  /**
   * Get particle size based on life (sparkles shrink)
   */
  getParticleSize(particle: Particle): number {
    if (particle.type === "sparkle") {
      return particle.size * particle.life;
    }
    if (particle.type === "ripple") {
      // Ripples expand
      return particle.size * (1 + (1 - particle.life) * 3);
    }
    return particle.size;
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }

  private getRandomSparkleColor(): string {
    const colors = [
      "rgba(255, 215, 0, 0.8)",    // Gold
      "rgba(255, 192, 203, 0.8)",  // Pink
      "rgba(173, 216, 230, 0.8)",  // Light blue
      "rgba(144, 238, 144, 0.8)",  // Light green
      "rgba(255, 182, 193, 0.8)",  // Light pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private getRandomCreatureColor(): string {
    const colors = [
      "rgba(255, 215, 0, 0.6)",    // Gold
      "rgba(255, 105, 180, 0.6)",  // Hot pink
      "rgba(0, 191, 255, 0.6)",    // Deep sky blue
      "rgba(50, 205, 50, 0.6)",    // Lime green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
