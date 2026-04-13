import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { monetizationManager, InAppProduct } from "@/lib/monetization";

export default function StoreScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<InAppProduct[]>([]);
  const [coinBalance, setCoinBalance] = useState(0);
  const [purchasedSkins, setPurchasedSkins] = useState<string[]>([]);

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    await monetizationManager.initialize();
    setProducts(monetizationManager.getAvailableProducts());
    setCoinBalance(monetizationManager.getCoinBalance());
    setPurchasedSkins(monetizationManager.getPurchasedSkins());
  };

  const handlePurchase = async (productId: string) => {
    const success = await monetizationManager.processPurchase(productId);
    if (success) {
      setCoinBalance(monetizationManager.getCoinBalance());
      setPurchasedSkins(monetizationManager.getPurchasedSkins());
    }
  };

  const renderProductCard = (product: InAppProduct) => {
    const isSkin = product.id.startsWith("skin_");
    const isPurchased = isSkin && purchasedSkins.includes(product.id.replace("skin_", ""));

    return (
      <View key={product.id} className="bg-white rounded-2xl p-4 mb-4 shadow-md">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">{product.name}</Text>
            <Text className="text-sm text-gray-600 mt-1">{product.description}</Text>
          </View>
          {isPurchased && (
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-green-700">Owned</Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-2xl font-bold text-purple-600">{product.price}</Text>
          <TouchableOpacity
            onPress={() => handlePurchase(product.id)}
            disabled={isPurchased}
            className={`px-6 py-2 rounded-full ${
              isPurchased ? "bg-gray-300" : "bg-purple-500"
            }`}
          >
            <Text className="text-white font-semibold">
              {isPurchased ? "Owned" : "Buy"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="flex-1 bg-gradient-to-b from-purple-100 to-pink-100">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-purple-700">Store</Text>
          <View className="w-10" />
        </View>

        {/* Coin Balance */}
        <View className="px-6 mb-6">
          <View className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl p-6">
            <Text className="text-sm text-yellow-800 font-semibold">Your Coins</Text>
            <Text className="text-4xl font-bold text-yellow-900 mt-2">
              💰 {coinBalance}
            </Text>
          </View>
        </View>

        {/* Products Section */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Available Items</Text>

          {products.map((product) => renderProductCard(product))}

          {/* Info Section */}
          <View className="bg-blue-50 rounded-2xl p-4 mt-6 border border-blue-200">
            <Text className="text-sm font-semibold text-blue-700 mb-2">💡 About Purchases</Text>
            <Text className="text-xs text-blue-600 leading-relaxed">
              • Remove Ads: Permanently remove all advertisements{"\n"}• Bubble Skins: Change the
              appearance of your bubbles{"\n"}• Coins: Earn from gameplay or purchase here
            </Text>
          </View>

          {/* Terms */}
          <Text className="text-xs text-gray-500 text-center mt-6">
            All purchases are non-refundable. By purchasing, you agree to our Terms of Service.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
