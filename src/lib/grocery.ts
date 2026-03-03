import { GroceryItem } from "@/types"

export const GROCERY_ITEMS: GroceryItem[] = [
  {
    id: "milk-1l",
    name: "Amul Milk",
    unit: "1 Litre",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
    platforms: [
      { platform: "Blinkit", price: 68, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://blinkit.com", isBest: false },
      { platform: "Zepto", price: 65, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://www.zepto.com", isBest: true },
      { platform: "BigBasket", price: 62, deliveryTime: "2 hrs", deliveryFee: 0, inStock: true, link: "https://www.bigbasket.com", isBest: false },
      { platform: "JioMart", price: 70, deliveryTime: "4 hrs", deliveryFee: 0, inStock: true, link: "https://www.jiomart.com", isBest: false },
    ],
    sabsastaScore: { total: 88, priceScore: 90, qualityScore: 88, reliabilityScore: 86, experienceScore: 84, label: "Excellent Value", color: "green" },
  },
  {
    id: "eggs-12",
    name: "Farm Fresh Eggs",
    unit: "12 pieces",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
    platforms: [
      { platform: "Blinkit", price: 89, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://blinkit.com", isBest: false },
      { platform: "Zepto", price: 92, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://www.zepto.com", isBest: false },
      { platform: "BigBasket", price: 85, deliveryTime: "2 hrs", deliveryFee: 0, inStock: true, link: "https://www.bigbasket.com", isBest: true },
      { platform: "JioMart", price: 88, deliveryTime: "4 hrs", deliveryFee: 0, inStock: true, link: "https://www.jiomart.com", isBest: false },
    ],
    sabsastaScore: { total: 85, priceScore: 88, qualityScore: 84, reliabilityScore: 82, experienceScore: 80, label: "Excellent Value", color: "green" },
  },
  {
    id: "banana-6",
    name: "Banana",
    unit: "6 pieces",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
    platforms: [
      { platform: "Blinkit", price: 29, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://blinkit.com", isBest: true },
      { platform: "Zepto", price: 32, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://www.zepto.com", isBest: false },
      { platform: "BigBasket", price: 35, deliveryTime: "2 hrs", deliveryFee: 0, inStock: true, link: "https://www.bigbasket.com", isBest: false },
      { platform: "JioMart", price: 30, deliveryTime: "4 hrs", deliveryFee: 0, inStock: true, link: "https://www.jiomart.com", isBest: false },
    ],
    sabsastaScore: { total: 90, priceScore: 95, qualityScore: 86, reliabilityScore: 88, experienceScore: 84, label: "Excellent Value", color: "green" },
  },
  {
    id: "tomato-500g",
    name: "Tomato",
    unit: "500 grams",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",
    platforms: [
      { platform: "Blinkit", price: 24, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://blinkit.com", isBest: true },
      { platform: "Zepto", price: 26, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://www.zepto.com", isBest: false },
      { platform: "BigBasket", price: 22, deliveryTime: "2 hrs", deliveryFee: 0, inStock: true, link: "https://www.bigbasket.com", isBest: false },
      { platform: "JioMart", price: 28, deliveryTime: "4 hrs", deliveryFee: 0, inStock: true, link: "https://www.jiomart.com", isBest: false },
    ],
    sabsastaScore: { total: 87, priceScore: 92, qualityScore: 84, reliabilityScore: 84, experienceScore: 82, label: "Excellent Value", color: "green" },
  },
  {
    id: "oil-1l",
    name: "Fortune Sunflower Oil",
    unit: "1 Litre",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    platforms: [
      { platform: "Blinkit", price: 149, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://blinkit.com", isBest: false },
      { platform: "Zepto", price: 152, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://www.zepto.com", isBest: false },
      { platform: "BigBasket", price: 144, deliveryTime: "2 hrs", deliveryFee: 0, inStock: true, link: "https://www.bigbasket.com", isBest: true },
      { platform: "JioMart", price: 155, deliveryTime: "4 hrs", deliveryFee: 0, inStock: true, link: "https://www.jiomart.com", isBest: false },
    ],
    sabsastaScore: { total: 84, priceScore: 86, qualityScore: 84, reliabilityScore: 82, experienceScore: 80, label: "Excellent Value", color: "green" },
  },
  {
    id: "atta-5kg",
    name: "Aashirvaad Atta",
    unit: "5 kg",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
    platforms: [
      { platform: "Blinkit", price: 259, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://blinkit.com", isBest: false },
      { platform: "Zepto", price: 265, deliveryTime: "10 min", deliveryFee: 0, inStock: true, link: "https://www.zepto.com", isBest: false },
      { platform: "BigBasket", price: 249, deliveryTime: "2 hrs", deliveryFee: 0, inStock: true, link: "https://www.bigbasket.com", isBest: true },
      { platform: "JioMart", price: 255, deliveryTime: "4 hrs", deliveryFee: 0, inStock: true, link: "https://www.jiomart.com", isBest: false },
    ],
    sabsastaScore: { total: 86, priceScore: 88, qualityScore: 86, reliabilityScore: 84, experienceScore: 82, label: "Excellent Value", color: "green" },
  },
]

export const PRESET_BASKETS: Record<string, string[]> = {
  "Morning Essentials": ["milk-1l", "eggs-12", "banana-6"],
  "Weekly Staples": ["milk-1l", "eggs-12", "tomato-500g", "oil-1l", "atta-5kg"],
  "Breakfast Basket": ["milk-1l", "banana-6", "eggs-12"],
}

export function getBasket(itemIds: string[]): GroceryItem[] {
  return GROCERY_ITEMS.filter((item) => itemIds.includes(item.id))
}