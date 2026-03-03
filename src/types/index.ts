export interface PlatformPrice {
    platform: string
    price: number
    originalPrice?: number
    deliveryFee?: number
    deliveryTime?: string
    rating?: number
    inStock: boolean
    link: string
    isBest: boolean
    surgeMultiplier?: number
  }
  
  export interface SabSastaScore {
    total: number
    priceScore: number
    qualityScore: number
    reliabilityScore: number
    experienceScore: number
    label: "Excellent Value" | "Good Value" | "Consider Alternatives"
    color: "green" | "orange" | "red"
  }
  
  export interface AIRecommendation {
    action: "BUY NOW" | "WAIT" | "COMPARE MORE"
    reason: string
    confidence: number
    priceTrend: "RISING" | "FALLING" | "STABLE"
    belowAverage: boolean
  }
  
  export interface YouTubeReview {
    channel: string
    views: string
    sentiment: number
    isSponsored: boolean
    link: string
  }
  
  export interface Product {
    id: string
    name: string
    image: string
    category: string
    platforms: PlatformPrice[]
    priceHistory: { week: number; amazon: number; flipkart: number }[]
    sabsastaScore: SabSastaScore
    aiRecommendation: AIRecommendation
    youtubeReviews: YouTubeReview[]
  }
  
  export interface RideOption {
    id: string
    platform: "Uber" | "Ola" | "Rapido"
    type: string
    category: "bike" | "auto" | "cab" | "premium"
    price: number
    eta: number
    surgeMultiplier: number
    hasSurge: boolean
    bookLink: string
    sabsastaScore: SabSastaScore
    platformColor: string
  }
  
  export interface FoodItem {
    id: string
    name: string
    restaurant: string
    rating: number
    totalRatings: number
    image: string
    city: string
    platforms: PlatformPrice[]
    sabsastaScore: SabSastaScore
  }
  
  export interface Flight {
    id: string
    airline: string
    from: string
    to: string
    departure: string
    duration: string
    stops: number
    platforms: PlatformPrice[]
    sabsastaScore: SabSastaScore
    aiRecommendation: AIRecommendation
  }
  
  export interface GroceryItem {
    id: string
    name: string
    unit: string
    image: string
    platforms: PlatformPrice[]
    sabsastaScore: SabSastaScore
  }
  
  export interface PriceAlert {
    id: string
    category: string
    itemName: string
    targetPrice: number
    currentPrice: number
    platform: string
    channel: "whatsapp" | "email" | "both"
    createdAt: string
    isTriggered: boolean
  }