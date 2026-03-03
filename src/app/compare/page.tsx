"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Nav from "@/components/Nav"

interface Product {
  name: string
  price: number
  formattedPrice: string
  image: string
  link: string
  platform: string
  rating: string
}

const HISTORY_KEY = "sabsasta_search_history"

function getHistory(): string[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]")
  } catch {
    return []
  }
}

function saveHistory(query: string) {
  if (typeof window === "undefined") return
  try {
    const history = getHistory().filter((h) => h !== query)
    const updated = [query, ...history].slice(0, 10)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {}
}

function clearHistory() {
  if (typeof window === "undefined") return
  localStorage.removeItem(HISTORY_KEY)
}

const OTHER_PLATFORMS = [
  { name: "Flipkart", emoji: "🛒", color: "text-blue-400", bg: "border-blue-500/20 bg-blue-500/5", url: (q: string) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
  { name: "Meesho", emoji: "🛍️", color: "text-pink-400", bg: "border-pink-500/20 bg-pink-500/5", url: (q: string) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}` },
  { name: "Snapdeal", emoji: "💰", color: "text-red-400", bg: "border-red-500/20 bg-red-500/5", url: (q: string) => `https://www.snapdeal.com/search?keyword=${encodeURIComponent(q)}` },
  { name: "Croma", emoji: "🔌", color: "text-green-400", bg: "border-green-500/20 bg-green-500/5", url: (q: string) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}` },
  { name: "Reliance Digital", emoji: "📱", color: "text-yellow-400", bg: "border-yellow-500/20 bg-yellow-500/5", url: (q: string) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(q)}` },
  { name: "JioMart", emoji: "🏪", color: "text-blue-300", bg: "border-blue-400/20 bg-blue-400/5", url: (q: string) => `https://www.jiomart.com/search/${encodeURIComponent(q)}` },
  { name: "Tata CLiQ", emoji: "⭐", color: "text-purple-400", bg: "border-purple-500/20 bg-purple-500/5", url: (q: string) => `https://www.tatacliq.com/search/?searchCategory=all&text=${encodeURIComponent(q)}` },
  { name: "Myntra", emoji: "👗", color: "text-orange-400", bg: "border-orange-500/20 bg-orange-500/5", url: (q: string) => `https://www.myntra.com/${encodeURIComponent(q)}` },
]

function CompareContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [searchedQuery, setSearchedQuery] = useState("")

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const searchProducts = async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setError("")
    setSearched(true)
    setShowHistory(false)
    setSearchedQuery(q.trim())

    saveHistory(q.trim())
    setHistory(getHistory())

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      const data = await res.json()
      if (data.success) {
        setResults(data.results)
      } else {
        setError("Could not fetch prices. Try again.")
      }
    } catch {
      setError("Something went wrong. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) searchProducts(initialQuery)
  }, [])

  const cheapest = results.length ? results.reduce((a, b) => (a.price < b.price ? a : b)) : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">Product Price Comparison</h1>

      {/* Search bar */}
      <div className="relative mb-3">
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            onKeyDown={(e) => e.key === "Enter" && searchProducts(query)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#FF6B35]/50"
            placeholder="Search Samsung M35, iPhone 15, Redmi Note 13..."
          />
          <button
            onClick={() => searchProducts(query)}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-6 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Compare"}
          </button>
        </div>

        {/* History dropdown */}
        {showHistory && history.length > 0 && (
          <div className="absolute top-full left-0 right-16 mt-1 rounded-xl border border-white/10 bg-[#0D0D1B] shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
              <span className="text-xs text-white/30 uppercase tracking-wider">Recent Searches</span>
              <button onClick={() => { clearHistory(); setHistory([]) }} className="text-xs text-white/30 hover:text-red-400 transition-colors">
                Clear
              </button>
            </div>
            {history.map((h, i) => (
              <button key={i} onClick={() => { setQuery(h); searchProducts(h) }}
                className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                <span className="text-white/20">🕐</span>
                {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent pills */}
      {history.length > 0 && !searched && (
        <div className="mb-6">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Recent</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {history.slice(0, 6).map((h, i) => (
              <button key={i} onClick={() => { setQuery(h); searchProducts(h) }}
                className="shrink-0 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs text-white/60 hover:border-[#FF6B35]/40 hover:text-white transition-all">
                🕐 {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-bounce">🔍</div>
          <p className="text-white/50">Fetching real prices from Amazon...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-6">{error}</div>
      )}

      {cheapest && !loading && (
        <div className="rounded-xl border border-[#00C875]/30 bg-[#00C875]/5 p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#00C875] mb-1 uppercase tracking-wider">Best Price Found</div>
            <div className="font-semibold text-sm text-white/80 line-clamp-1">{cheapest.name}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-[#00C875]">{cheapest.formattedPrice}</div>
            <div className="text-xs text-white/40">on Amazon</div>
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {results.map((product, i) => {
            const isCheapest = product.price === cheapest?.price
            return (
              <div key={i} className={`rounded-2xl border p-4 transition-all ${isCheapest ? "border-[#00C875]/40 bg-[#00C875]/5" : "border-white/7 bg-[#0D0D1B] hover:border-white/15"}`}>
                <div className="flex gap-3 mb-4">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-contain bg-white/5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug line-clamp-3">{product.name}</p>
                    {product.rating !== "N/A" && <p className="text-xs text-yellow-400 mt-1">⭐ {product.rating}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className={`text-2xl font-extrabold ${isCheapest ? "text-[#00C875]" : "text-white"}`}>
                    {product.formattedPrice}
                  </div>
                  {isCheapest && (
                    <span className="rounded-full bg-[#00C875]/15 px-2 py-1 text-[10px] font-bold text-[#00C875]">BEST PRICE</span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#FF9900] font-semibold">📦 Amazon</span>
                </div>

                <div className="flex items-center gap-2">
                  <a href={product.link} target="_blank" rel="noopener noreferrer"
                    className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold text-center hover:opacity-90 transition-opacity ${isCheapest ? "bg-gradient-to-r from-[#FF6B35] to-[#FF9500] text-white" : "bg-white/8 text-white/70"}`}>
                    Buy on Amazon
                  </a>
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(product.name + " review")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="rounded-lg bg-red-600/20 border border-red-600/30 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-600/30 transition-all">
                    ▶ Review
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Other platforms */}
      {searched && !loading && results.length > 0 && (
        <div className="mt-8 rounded-2xl border border-white/7 bg-[#0D0D1B] p-5">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
            Also check on other platforms
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {OTHER_PLATFORMS.map((platform) => (
              <a key={platform.name} href={platform.url(searchedQuery)} target="_blank" rel="noopener noreferrer"
                className={`rounded-xl border ${platform.bg} p-3 flex flex-col items-center gap-1.5 hover:scale-105 transition-all`}>
                <span className="text-2xl">{platform.emoji}</span>
                <span className={`text-xs font-bold ${platform.color} text-center`}>{platform.name}</span>
                <span className="text-[10px] text-white/30">Search →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="text-center py-20 text-white/30">
          <div className="text-5xl mb-3">😕</div>
          <p>No results found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  )
}

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />
      <Suspense fallback={<div className="text-center py-20 text-white/50">Loading...</div>}>
        <CompareContent />
      </Suspense>
    </main>
  )
}