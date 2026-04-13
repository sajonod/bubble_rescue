import { describe, it, expect, beforeEach } from "vitest";
import { MonetizationManager, AdManager } from "../lib/monetization";

describe("MonetizationManager", () => {
  let manager: MonetizationManager;

  beforeEach(async () => {
    manager = MonetizationManager.getInstance();
    await manager.resetPurchases();
  });

  it("should initialize with default values", async () => {
    await manager.initialize();
    const purchases = manager.getPurchases();
    expect(purchases.removeAds).toBe(false);
    expect(purchases.bubbleSkins).toHaveLength(0);
    expect(purchases.coins).toBe(0);
  });

  it("should get available products", () => {
    const products = manager.getAvailableProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products.some((p) => p.id === "remove_ads")).toBe(true);
  });

  it("should get product by id", () => {
    const product = manager.getProduct("remove_ads");
    expect(product).toBeDefined();
    expect(product?.name).toBe("Remove Ads");
  });

  it("should process remove ads purchase", async () => {
    const success = await manager.processPurchase("remove_ads");
    expect(success).toBe(true);
    expect(manager.hasRemovedAds()).toBe(true);
  });

  it("should process skin purchase", async () => {
    const success = await manager.processPurchase("skin_golden");
    expect(success).toBe(true);

    const skins = manager.getPurchasedSkins();
    expect(skins).toContain("golden");
  });

  it("should add coins from purchase", async () => {
    const success = await manager.processPurchase("coins_100");
    expect(success).toBe(true);
    expect(manager.getCoinBalance()).toBe(100);
  });

  it("should add coins from reward", async () => {
    await manager.addCoins(50);
    expect(manager.getCoinBalance()).toBe(50);

    await manager.addCoins(30);
    expect(manager.getCoinBalance()).toBe(80);
  });

  it("should spend coins successfully", async () => {
    await manager.addCoins(100);
    const success = await manager.spendCoins(30);
    expect(success).toBe(true);
    expect(manager.getCoinBalance()).toBe(70);
  });

  it("should fail to spend coins if insufficient balance", async () => {
    await manager.addCoins(50);
    const success = await manager.spendCoins(100);
    expect(success).toBe(false);
    expect(manager.getCoinBalance()).toBe(50);
  });

  it("should not purchase same skin twice", async () => {
    await manager.processPurchase("skin_rainbow");
    const skins1 = manager.getPurchasedSkins();
    expect(skins1).toHaveLength(1);

    await manager.processPurchase("skin_rainbow");
    const skins2 = manager.getPurchasedSkins();
    expect(skins2).toHaveLength(1); // Should still be 1, not 2
  });

  it("should return false for invalid product", async () => {
    const success = await manager.processPurchase("invalid_product");
    expect(success).toBe(false);
  });

  it("should reset purchases", async () => {
    await manager.processPurchase("remove_ads");
    await manager.addCoins(100);

    await manager.resetPurchases();

    const purchases = manager.getPurchases();
    expect(purchases.removeAds).toBe(false);
    expect(purchases.coins).toBe(0);
    expect(purchases.bubbleSkins).toHaveLength(0);
  });
});

describe("AdManager", () => {
  beforeEach(() => {
    // Reset the ad manager before each test
    const adManager = AdManager.getInstance();
    adManager.resetAdCounter();
  });

  it("should not show ad on first game", () => {
    const adManager = AdManager.getInstance();
    const shouldShow = adManager.shouldShowInterstitialAd();
    expect(shouldShow).toBe(false);
  });

  it("should show ad every 4 games", () => {
    const adManager = AdManager.getInstance();
    // Games 1-3: no ad
    expect(adManager.shouldShowInterstitialAd()).toBe(false);
    expect(adManager.shouldShowInterstitialAd()).toBe(false);
    expect(adManager.shouldShowInterstitialAd()).toBe(false);

    // Game 4: show ad
    expect(adManager.shouldShowInterstitialAd()).toBe(true);

    // Games 5-7: no ad
    expect(adManager.shouldShowInterstitialAd()).toBe(false);
    expect(adManager.shouldShowInterstitialAd()).toBe(false);
    expect(adManager.shouldShowInterstitialAd()).toBe(false);

    // Game 8: show ad
    expect(adManager.shouldShowInterstitialAd()).toBe(true);
  });

  it("should not show interstitial ad if ads are removed", async () => {
    const adManager = AdManager.getInstance();
    const monetization = MonetizationManager.getInstance();
    await monetization.processPurchase("remove_ads");

    // Even after 4 games, should not show ad
    for (let i = 0; i < 4; i++) {
      adManager.shouldShowInterstitialAd();
    }

    const shouldShow = adManager.shouldShowInterstitialAd();
    expect(shouldShow).toBe(false);
  });

  it.skip("should track ad shown count", () => {
    const adManager = AdManager.getInstance();
    expect(adManager.getAdShownCount()).toBe(0);

    adManager.shouldShowInterstitialAd();
    expect(adManager.getAdShownCount()).toBe(1);

    adManager.shouldShowInterstitialAd();
    expect(adManager.getAdShownCount()).toBe(2);
  });

  it.skip("should reset ad counter", () => {
    const adManager = AdManager.getInstance();
    adManager.shouldShowInterstitialAd();
    adManager.shouldShowInterstitialAd();
    expect(adManager.getAdShownCount()).toBe(2);

    adManager.resetAdCounter();
    expect(adManager.getAdShownCount()).toBe(0);
  });

  it("should show rewarded ad", async () => {
    const adManager = AdManager.getInstance();
    const result = await adManager.showRewardedAd();
    expect(result).toBe(true);
  });
});
