import { FoodItem } from "@/types"

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "pepperoni-pizza",
    name: "Pepperoni Pizza (Medium)",
    restaurant: "Domino's",
    rating: 4.5,
    totalRatings: 2840,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    city: "bengaluru",
    platforms: [
      {
        platform: "Zomato",
        price: 199,
        deliveryFee: 30,
        deliveryTime: "25 min",
        rating: 4.5,
        inStock: true,
        link: "https://www.zomato.com",
        isBest: true,
      },
      {
        platform: "Swiggy",
        price: 249,
        deliveryFee: 40,
        deliveryTime: "28 min",
        rating: 4.5,
        inStock: true,
        link: "https://www.swiggy.com",
        isBest: false,
      },
      {
        platform: "Magicpin",
        price: 229,
        deliveryFee: 25,
        deliveryTime: "35 min",
        rating: 4.3,
        inStock: true,
        link: "https://www.magicpin.in",
        isBest: false,
      },
    ],
    sabsastaScore: {
      total: 91, priceScore: 94, qualityScore: 90,
      reliabilityScore: 88, experienceScore: 86,
      label: "Excellent Value", color: "green",
    },
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken + Naan",
    restaurant: "Punjab Grill",
    rating: 4.7,
    totalRatings: 1420,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
    city: "bengaluru",
    platforms: [
      {
        platform: "Magicpin",
        price: 299,
        deliveryFee: 20,
        deliveryTime: "40 min",
        rating: 4.6,
        inStock: true,
        link: "https://www.magicpin.in",
        isBest: true,
      },
      {
        platform: "Swiggy",
        price: 320,
        deliveryFee: 40,
        deliveryTime: "30 min",
        rating: 4.7,
        inStock: true,
        link: "https://www.swiggy.com",
        isBest: false,
      },
      {
        platform: "Zomato",
        price: 340,
        deliveryFee: 30,
        deliveryTime: "28 min",
        rating: 4.7,
        inStock: true,
        link: "https://www.zomato.com",
        isBest: false,
      },
    ],
    sabsastaScore: {
      total: 88, priceScore: 86, qualityScore: 94,
      reliabilityScore: 86, experienceScore: 84,
      label: "Excellent Value", color: "green",
    },
  },
  {
    id: "chicken-biryani",
    name: "Chicken Dum Biryani",
    restaurant: "Behrouz Biryani",
    rating: 4.6,
    totalRatings: 5230,
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80",
    city: "bengaluru",
    platforms: [
      {
        platform: "Swiggy",
        price: 299,
        deliveryFee: 30,
        deliveryTime: "35 min",
        rating: 4.6,
        inStock: true,
        link: "https://www.swiggy.com",
        isBest: true,
      },
      {
        platform: "Zomato",
        price: 319,
        deliveryFee: 30,
        deliveryTime: "32 min",
        rating: 4.6,
        inStock: true,
        link: "https://www.zomato.com",
        isBest: false,
      },
      {
        platform: "Magicpin",
        price: 289,
        deliveryFee: 40,
        deliveryTime: "45 min",
        rating: 4.4,
        inStock: true,
        link: "https://www.magicpin.in",
        isBest: false,
      },
    ],
    sabsastaScore: {
      total: 90, priceScore: 92, qualityScore: 92,
      reliabilityScore: 86, experienceScore: 84,
      label: "Excellent Value", color: "green",
    },
  },
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    restaurant: "MTR Restaurant",
    rating: 4.8,
    totalRatings: 3840,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
    city: "bengaluru",
    platforms: [
      {
        platform: "Zomato",
        price: 89,
        deliveryFee: 20,
        deliveryTime: "20 min",
        rating: 4.8,
        inStock: true,
        link: "https://www.zomato.com",
        isBest: true,
      },
      {
        platform: "Swiggy",
        price: 99,
        deliveryFee: 25,
        deliveryTime: "22 min",
        rating: 4.8,
        inStock: true,
        link: "https://www.swiggy.com",
        isBest: false,
      },
    ],
    sabsastaScore: {
      total: 95, priceScore: 98, qualityScore: 96,
      reliabilityScore: 92, experienceScore: 90,
      label: "Excellent Value", color: "green",
    },
  },
]

export function searchFood(query: string, city: string): FoodItem[] {
  const q = query.toLowerCase()
  return FOOD_ITEMS.filter(
    (item) =>
      item.city === city.toLowerCase() &&
      (item.name.toLowerCase().includes(q) ||
        item.restaurant.toLowerCase().includes(q))
  )
}