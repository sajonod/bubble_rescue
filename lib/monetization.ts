import AsyncStorage from "@react-native-async-storage/async-storage";

export interface InAppProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  type: "consumable" | "non-consumable";
}

export interface UserPurchases {
  removeAds: boolean;
  bubbleSkins: string[];
  coins: number;
}

export class MonetizationManager {
  private static instance: MonetizationManager;
  private userPurchases: UserPurchases = {
    removeAds: false,
    bubbleSkins: [],
    coins: 0,
  };

  private inAppProducts: InAppProduct[] = [
    {
      id: "remove_ads",
      name: "Remove Ads",
      description: "Remove all ads from the game permanently",
      price: "$4.99",
      type: "non-consumable",
    },
    {
      id: "skin_golden",
      name: "Golden Bubble Skin",
      description: "Exclusive golden bubble appearance",
      price: "$1.99",
      type: "non-consumable",
    },
    {
      id: "skin_rainbow",
      name: "Rainbow Bubble Skin",
      description: "Vibrant rainbow bubble appearance",
      price: "$1.99",
      type: "non-consumable",
    },
    {
      id: "skin_crystal",
      name: "Crystal Bubble Skin",
      description: "Shimmering crystal bubble appearance",
      price: "$1.99",
      type: "non-consumable",
    },
    {
      id: "coins_100",
      name: "100 Coins",
      description: "Use coins to unlock premium features",
      price: "$0.99",
      type: "consumable",
    },
    {
      id: "coins_500",
      name: "500 Coins",
      description: "Use coins to unlock premium features",
      price: "$3.99",
      type: "consumable",
    },
  ];

  private constructor() {}

  static getInstance(): MonetizationManager {
    if (!MonetizationManager.instance) {
      MonetizationManager.instance = new MonetizationManager();
    }
    return MonetizationManager.instance;
  }

  /**
   * Initialize monetization system
   */
  async initialize(): Promise<void> {
    try {
      const saved = await AsyncStorage.getItem("user_purchases");
      if (saved) {
        this.userPurchases = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to initialize monetization:", error);
    }
  }

  /**
   * Get all available products
   */
  getAvailableProducts(): InAppProduct[] {
    return this.inAppProducts;
  }

  /**
   * Get product by ID
   */
  getProduct(id: string): InAppProduct | undefined {
    return this.inAppProducts.find((p) => p.id === id);
  }

  /**
   * Process a purchase (simulated)
   */
  async processPurchase(productId: string): Promise<boolean> {
    try {
      const product = this.getProduct(productId);
      if (!product) return false;

      // Simulate purchase processing
      if (productId === "remove_ads") {
        this.userPurchases.removeAds = true;
      } else if (productId.startsWith("skin_")) {
        const skinName = productId.replace("skin_", "");
        if (!this.userPurchases.bubbleSkins.includes(skinName)) {
          this.userPurchases.bubbleSkins.push(skinName);
        }
      } else if (productId === "coins_100") {
        this.userPurchases.coins += 100;
      } else if (productId === "coins_500") {
        this.userPurchases.coins += 500;
      }

      await this.savePurchases();
      return true;
    } catch (error) {
      console.error("Failed to process purchase:", error);
      return false;
    }
  }

  /**
   * Check if user has removed ads
   */
  hasRemovedAds(): boolean {
    return this.userPurchases.removeAds;
  }

  /**
   * Get user's purchased skins
   */
  getPurchasedSkins(): string[] {
    return this.userPurchases.bubbleSkins;
  }

  /**
   * Get user's coin balance
   */
  getCoinBalance(): number {
    return this.userPurchases.coins;
  }

  /**
   * Add coins (reward from gameplay)
   */
  async addCoins(amount: number): Promise<void> {
    this.userPurchases.coins += amount;
    await this.savePurchases();
  }

  /**
   * Spend coins
   */
  async spendCoins(amount: number): Promise<boolean> {
    if (this.userPurchases.coins >= amount) {
      this.userPurchases.coins -= amount;
      await this.savePurchases();
      return true;
    }
    return false;
  }

  /**
   * Get purchase history
   */
  getPurchases(): UserPurchases {
    return { ...this.userPurchases };
  }

  /**
   * Save purchases to storage
   */
  private async savePurchases(): Promise<void> {
    try {
      await AsyncStorage.setItem("user_purchases", JSON.stringify(this.userPurchases));
    } catch (error) {
      console.error("Failed to save purchases:", error);
    }
  }

  /**
   * Reset purchases (for testing)
   */
  async resetPurchases(): Promise<void> {
    this.userPurchases = {
      removeAds: false,
      bubbleSkins: [],
      coins: 0,
    };
    await this.savePurchases();
  }
}

/**
 * Ad Manager for handling rewarded and interstitial ads
 */
export class AdManager {
  private static instance: AdManager;
  private adShownCount: number = 0;
  private lastAdTime: number = 0;
  private adCooldown: number = 5000; // 5 seconds between ads

  private constructor() {}

  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  /**
   * Check if should show interstitial ad
   * Show every 3-4 games
   */
  shouldShowInterstitialAd(): boolean {
    const monetization = MonetizationManager.getInstance();
    if (monetization.hasRemovedAds()) {
      return false;
    }

    this.adShownCount++;
    return this.adShownCount % 4 === 0;
  }

  /**
   * Show interstitial ad (simulated)
   */
  async showInterstitialAd(): Promise<void> {
    const now = Date.now();
    if (now - this.lastAdTime < this.adCooldown) {
      return;
    }

    this.lastAdTime = now;

    try {
      // Simulate ad display
      console.log("Showing interstitial ad...");
      // In production, integrate with Google Mobile Ads SDK
      // await admob.showInterstitial();
    } catch (error) {
      console.error("Failed to show interstitial ad:", error);
    }
  }

  /**
   * Show rewarded ad for revive feature
   */
  async showRewardedAd(): Promise<boolean> {
    const monetization = MonetizationManager.getInstance();
    if (monetization.hasRemovedAds()) {
      return true; // Skip ad for users who removed ads
    }

    const now = Date.now();
    if (now - this.lastAdTime < this.adCooldown) {
      return false;
    }

    this.lastAdTime = now;

    try {
      // Simulate rewarded ad
      console.log("Showing rewarded ad for revive...");
      // In production, integrate with Google Mobile Ads SDK
      // const rewarded = await admob.showRewardedAd();
      // return rewarded.isRewarded;
      return true;
    } catch (error) {
      console.error("Failed to show rewarded ad:", error);
      return false;
    }
  }

  /**
   * Reset ad counter (for testing)
   */
  resetAdCounter(): void {
    this.adShownCount = 0;
  }

  /**
   * Get ad shown count
   */
  getAdShownCount(): number {
    return this.adShownCount;
  }
}

export const monetizationManager = MonetizationManager.getInstance();
export const adManager = AdManager.getInstance();
