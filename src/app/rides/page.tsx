"use client"

import { useState, useEffect } from "react"
import Nav from "@/components/Nav"

interface RideResult {
  id: string
  platform: string
  type: string
  category: string
  price: number
  basePrice: number
  hasSurge: boolean
  surgeMultiplier: number
  eta: number
  distanceKm: number
  timeMin: number
  platformColor: string
  bookLink: string
  isCheapest?: boolean
}

type FilterType = "all" | "bike" | "auto" | "cab" | "premium"

const CITIES = ["bengaluru", "mumbai", "delhi", "hyderabad"]

const POPULAR_ROUTES: Record<string, { from: string; to: string; label: string }[]> = {
  bengaluru: [
    { from: "Koramangala", to: "Kempegowda Airport", label: "Koramangala → Airport" },
    { from: "Indiranagar", to: "Electronic City", label: "Indiranagar → Electronic City" },
    { from: "MG Road", to: "Whitefield", label: "MG Road → Whitefield" },
  ],
  mumbai: [
    { from: "Bandra", to: "Andheri", label: "Bandra → Andheri" },
    { from: "Dadar", to: "Chhatrapati Shivaji Airport", label: "Dadar → Airport" },
    { from: "Colaba", to: "Powai", label: "Colaba → Powai" },
  ],
  delhi: [
    { from: "Connaught Place", to: "Indira Gandhi Airport", label: "CP → Airport" },
    { from: "Lajpat Nagar", to: "Cyber City Gurgaon", label: "Lajpat Nagar → Cyber City" },
    { from: "Karol Bagh", to: "Noida Sector 18", label: "Karol Bagh → Noida" },
  ],
  hyderabad: [
    { from: "Hitech City", to: "Rajiv Gandhi Airport", label: "Hitech City → Airport" },
    { from: "Banjara Hills", to: "Secunderabad", label: "Banjara Hills → Secunderabad" },
    { from: "Gachibowli", to: "Charminar", label: "Gachibowli → Charminar" },
  ],
}

const PLATFORM_TEXT: Record<string, string> = {
  Uber: "text-white",
  Ola: "text-yellow-400",
  Rapido: "text-green-400",
}

const PLATFORM_BORDER: Record<string, string> = {
  Uber: "border-white/15 bg-white/3",
  Ola: "border-yellow-500/20 bg-yellow-500/5",
  Rapido: "border-green-500/20 bg-green-500/5",
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Bikes", value: "bike" },
  { label: "Autos", value: "auto" },
  { label: "Cabs", value: "cab" },
  { label: "Premium", value: "premium" },
]

export default function RidesPage() {
  const [city, setCity] = useState("bengaluru")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [results, setResults] = useState<RideResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isRushHour, setIsRushHour] = useState(false)
  const [searched, setSearched] = useState(false)
  const [routeInfo, setRouteInfo] = useState({ distanceKm: 0, timeMin: 0, from: "", to: "" })
  const [error, setError] = useState("")

  const fetchRides = async (f: string, t: string, c: string) => {
    if (!f.trim() || !t.trim()) {
      setError("Please enter both from and to locations")
      return
    }
    setLoading(true)
    setSearched(true)
    setError("")

    try {
      const res = await fetch(
        `/api/rides?city=${c}&from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}`
      )
      const data = await res.json()

      if (data.success) {
        setResults(data.results)
        setIsRushHour(data.isRushHour)
        setRouteInfo({
          distanceKm: data.distanceKm,
          timeMin: data.timeMin,
          from: data.from,
          to: data.to,
        })
      } else {
        setError("Could not calculate route. Try again.")
      }
    } catch {
      setError("Something went wrong. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === "all" ? results : results.filter((r) => r.category === filter)
  const cheapest = results[0] || null
  const surgeRides = results.filter((r) => r.hasSurge)

  const swapLocations = () => {
    const tmp = from
    setFrom(to)
    setTo(tmp)
  }

  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />
      <div className="mx-auto max-w-2xl px-4 py-8">

        <h1 className="text-2xl font-extrabold mb-1">Ride Comparison</h1>
        <p className="text-white/40 text-sm mb-6">
          Uber vs Ola vs Rapido — enter your route, find cheapest ride
        </p>

        {/* Rush hour warning */}
        {isRushHour && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 mb-5 flex items-center gap-2 text-sm">
            <span className="text-red-400 font-semibold">Rush hour active</span>
            <span className="text-white/50">— some platforms have surge pricing</span>
          </div>
        )}

        {/* Input form */}
        <div className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-4 mb-5">

          {/* City selector */}
          <div className="mb-3">
            <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1.5">City</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all capitalize ${
                    city === c
                      ? "border-[#FF6B35] bg-[#FF6B35]/15 text-[#FF9500]"
                      : "border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* From / To inputs */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 space-y-2">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">From</div>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchRides(from, to, city)}
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder-white/30"
                  placeholder="Koramangala, Indiranagar..."
                />
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">To</div>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchRides(from, to, city)}
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder-white/30"
                  placeholder="Airport, Whitefield, MG Road..."
                />
              </div>
            </div>
            <button
              onClick={swapLocations}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-xl hover:border-[#FF6B35]/40 transition-all"
            >
              ⇅
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 mb-3">⚠️ {error}</p>
          )}

          <button
            onClick={() => fetchRides(from, to, city)}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Finding cheapest ride..." : "Compare Rides →"}
          </button>
        </div>

        {/* Popular routes */}
        <div className="mb-5">
          <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Popular routes</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(POPULAR_ROUTES[city] || []).map((route) => (
              <button
                key={route.label}
                onClick={() => {
                  setFrom(route.from)
                  setTo(route.to)
                  fetchRides(route.from, route.to, city)
                }}
                className="shrink-0 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs text-white/60 hover:border-[#FF6B35]/40 hover:text-white transition-all"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                filter === f.value
                  ? "border-[#FF6B35] bg-[#FF6B35]/15 text-[#FF9500]"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">🚗</div>
            <p className="text-white/50">Calculating best prices for your route...</p>
          </div>
        )}

        {/* Route info */}
        {!loading && routeInfo.distanceKm > 0 && (
          <div className="rounded-xl border border-white/7 bg-white/3 p-3 mb-5 flex items-center justify-between text-sm">
            <div className="text-white/50 text-xs">
              <span className="text-white font-semibold">{routeInfo.from.split(",")[0]}</span>
              {" → "}
              <span className="text-white font-semibold">{routeInfo.to.split(",")[0]}</span>
            </div>
            <div className="flex gap-3 text-xs text-white/40">
              <span>📍 {routeInfo.distanceKm} km</span>
              <span>⏱ ~{routeInfo.timeMin} min drive</span>
            </div>
          </div>
        )}

        {/* Best deal banner */}
        {cheapest && !loading && (
          <div className="rounded-xl border border-[#00C875]/30 bg-[#00C875]/5 p-4 mb-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#00C875] mb-1 uppercase tracking-wider">
                Cheapest Option
              </div>
              <div className="font-semibold text-sm">{cheapest.type}</div>
              <div className="text-xs text-white/40 mt-0.5">{cheapest.eta} min away</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-[#00C875]">
                ₹{cheapest.price}
              </div>
              <div className="text-xs text-white/40">{routeInfo.distanceKm} km</div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3 mb-6">
            {filtered.map((ride) => (
              <div
                key={ride.id}
                className={`rounded-2xl border p-4 flex items-center gap-3 transition-all ${
                  ride.isCheapest
                    ? "border-[#00C875]/40 bg-[#00C875]/5"
                    : PLATFORM_BORDER[ride.platform] || "border-white/7 bg-white/2"
                }`}
              >
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: ride.platformColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-sm ${PLATFORM_TEXT[ride.platform] || "text-white"}`}>
                      {ride.type}
                    </span>
                    {ride.isCheapest && (
                      <span className="rounded-full bg-[#00C875]/15 px-2 py-0.5 text-[9px] font-bold text-[#00C875]">
                        CHEAPEST
                      </span>
                    )}
                    {ride.hasSurge && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-400">
                        {ride.surgeMultiplier}x SURGE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {ride.eta} min away
                    {ride.hasSurge && (
                      <span className="ml-2 text-white/30">(Base ₹{ride.basePrice})</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xl font-extrabold ${ride.isCheapest ? "text-[#00C875]" : "text-white"}`}>
                    ₹{ride.price}
                  </div>
                  <a
                    href={ride.bookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-1 inline-block rounded-lg px-3 py-1.5 text-xs font-bold hover:opacity-90 transition-opacity ${
                      ride.isCheapest
                        ? "bg-gradient-to-r from-[#FF6B35] to-[#FF9500] text-white"
                        : "bg-white/8 text-white/60"
                    }`}
                  >
                    Book →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Tip */}
        {!loading && results.length > 0 && (
          <div className="rounded-xl border border-[#FF6B35]/20 bg-[#FF6B35]/5 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🤖</span>
              <p className="text-sm text-white/70 leading-relaxed">
                {surgeRides.length > 0
                  ? `${surgeRides.map((r) => r.platform).filter((v, i, a) => a.indexOf(v) === i).join(" & ")} has surge pricing right now. `
                  : "No surge pricing active right now. "}
                {cheapest && `${cheapest.type} is cheapest at ₹${cheapest.price}. `}
                {surgeRides.length > 0
                  ? "Try Rapido or Ola to save money."
                  : "Good time to book — prices are normal."}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!searched && !loading && (
          <div className="text-center py-16 text-white/30">
            <div className="text-5xl mb-3">🚗</div>
            <p className="text-sm">Enter your route above to compare prices</p>
          </div>
        )}

      </div>
    </main>
  )
}