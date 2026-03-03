"use client"

import { useState, useEffect } from "react"
import Nav from "@/components/Nav"

interface FoodResult {
  id: string
  name: string
  restaurantName: string
  price: number | null
  finalPrice: number | null
  rating: string
  image: string
  platform: string
  link: string
  deliveryTime: string
  isVeg?: boolean
}

function getCheapest(results: FoodResult[]): FoodResult | null {
  const withPrices = results.filter((r) => r.price !== null)
  if (withPrices.length === 0) return null
  let cheapest = withPrices[0]
  for (const item of withPrices) {
    const itemPrice = item.finalPrice ?? item.price ?? 0
    const cheapestPrice = cheapest.finalPrice ?? cheapest.price ?? 0
    if (itemPrice < cheapestPrice) cheapest = item
  }
  return cheapest
}

const CITIES = [
  "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Kochi",
  "Goa", "Chandigarh", "Lucknow", "Indore", "Surat",
]

const POPULAR = ["Biryani", "Pizza", "Burger", "Dosa", "Noodles", "Rolls", "Paneer", "Chicken", "Idli", "Sandwich"]

export default function FoodPage() {
  const [query, setQuery] = useState("biryani")
  const [city, setCity] = useState("Bengaluru")
  const [results, setResults] = useState<FoodResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)
  const [currentCity, setCurrentCity] = useState("Bengaluru")

  const searchFood = async (q: string, c: string) => {
    if (!q.trim()) return
    setLoading(true)
    setError("")
    setSearched(true)

    try {
      const res = await fetch(
        `/api/food?q=${encodeURIComponent(q.trim())}&city=${c.toLowerCase()}`
      )
      const data = await res.json()

      if (data.success && data.results.length > 0) {
        setResults(data.results)
        setCurrentCity(data.city || c)
      } else {
        setError("No results found. Try a different dish.")
        setResults([])
      }
    } catch {
      setError("Something went wrong. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchFood("biryani", "Bengaluru")
  }, [])

  const cheapest = getCheapest(results)

  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />
      <div className="mx-auto max-w-3xl px-4 py-8">

        <h1 className="text-2xl font-extrabold mb-1">Food Price Comparison</h1>
        <p className="text-white/40 text-sm mb-6">Real prices from Swiggy · {currentCity}</p>

        {/* City selector */}
        <div className="mb-4">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Select City</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCity(c); searchFood(query, c) }}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                  city === c
                    ? "border-[#FF6B35] bg-[#FF6B35]/15 text-[#FF9500]"
                    : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchFood(query, city)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#FF6B35]/50"
            placeholder="Search biryani, pizza, dosa..."
          />
          <button
            onClick={() => searchFood(query, city)}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-6 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {/* Popular */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {POPULAR.map((item) => (
            <button
              key={item}
              onClick={() => { setQuery(item); searchFood(item, city) }}
              className="shrink-0 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs text-white/60 hover:border-[#FF6B35]/40 hover:text-white transition-all"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">🍕</div>
            <p className="text-white/50">Finding best prices in {city}...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Best deal banner */}
        {cheapest && !loading && (
          <div className="rounded-xl border border-[#00C875]/30 bg-[#00C875]/5 p-4 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {cheapest.image && (
                <img src={cheapest.image} alt={cheapest.name} className="h-12 w-12 rounded-xl object-cover" />
              )}
              <div>
                <div className="text-xs font-bold text-[#00C875] mb-0.5 uppercase tracking-wider">
                  Cheapest in {currentCity}
                </div>
                <div className="font-semibold text-sm line-clamp-1">{cheapest.name}</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-extrabold text-[#00C875]">
                Rs.{cheapest.finalPrice ?? cheapest.price}
              </div>
              <div className="text-xs text-white/40">on Swiggy</div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {results.map((item) => {
              const displayPrice = item.finalPrice ?? item.price
              const isCheapest = cheapest?.id === item.id
              const hasDiscount =
                item.finalPrice !== null &&
                item.price !== null &&
                item.finalPrice < item.price

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isCheapest
                      ? "border-[#00C875]/40 bg-[#00C875]/5"
                      : "border-white/7 bg-[#0D0D1B] hover:border-white/15"
                  }`}
                >
                  <div className="flex gap-3 mb-3">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="h-20 w-20 rounded-xl bg-white/5 shrink-0 flex items-center justify-center text-3xl">
                        🍽️
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.isVeg !== undefined && (
                          <span className={`text-xs ${item.isVeg ? "text-green-400" : "text-red-400"}`}>
                            {item.isVeg ? "🟢" : "🔴"}
                          </span>
                        )}
                        {isCheapest && (
                          <span className="rounded-full bg-[#00C875]/15 px-2 py-0.5 text-[9px] font-bold text-[#00C875]">
                            CHEAPEST
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold leading-snug line-clamp-2">{item.name}</p>
                      {item.restaurantName && (
                        <p className="text-xs text-white/35 mt-0.5">{item.restaurantName}</p>
                      )}
                      {item.rating !== "N/A" && (
                        <p className="text-xs text-yellow-400 mt-1">⭐ {item.rating}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-2xl font-extrabold ${isCheapest ? "text-[#00C875]" : "text-white"}`}>
                      Rs.{displayPrice}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-white/30 line-through">Rs.{item.price}</span>
                    )}
                    {hasDiscount && (
                      <span className="text-xs font-bold text-[#FF9500] bg-[#FF9500]/10 rounded-full px-2 py-0.5">
                        Save Rs.{(item.price ?? 0) - (item.finalPrice ?? 0)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/40">
                      <span className="text-[#FC8019] font-semibold">Swiggy</span>
                      {" · "}⏱ {item.deliveryTime}
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-lg px-4 py-2 text-xs font-bold hover:opacity-90 transition-opacity ${
                        isCheapest
                          ? "bg-gradient-to-r from-[#FF6B35] to-[#FF9500] text-white"
                          : "bg-white/8 text-white/70"
                      }`}
                    >
                      Order →
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-3">🍽️</div>
            <p>No results for "{query}" in {city}</p>
            <p className="text-sm mt-2">Try biryani, pizza, or dosa</p>
          </div>
        )}

      </div>
    </main>
  )
}