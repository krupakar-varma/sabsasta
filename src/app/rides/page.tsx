"use client"

import { useState } from "react"
import Nav from "@/components/Nav"
import PlacesAutocomplete from "@/components/PlacesAutocomplete"

interface RideResult {
  id: string
  platform: string
  type: string
  emoji: string
  category: string
  price: number
  priceMin: number
  priceMax: number
  priceRange: string
  basePrice: number
  hasSurge: boolean
  surgeMultiplier: number
  savingsVsMax: number
  eta: number
  distanceKm: number
  timeMin: number
  platformColor: string
  bookLink: string
  costPerKm: number
  isCheapest?: boolean
}

type FilterType = "all" | "bike" | "auto" | "cab" | "premium" | "metro" | "ev"

const CITIES = [
  "bengaluru", "mumbai", "delhi", "hyderabad",
  "chennai", "pune", "kolkata", "ahmedabad"
]

const CITY_LABELS: Record<string, string> = {
  bengaluru: "Bengaluru", mumbai: "Mumbai", delhi: "Delhi",
  hyderabad: "Hyderabad", chennai: "Chennai", pune: "Pune",
  kolkata: "Kolkata", ahmedabad: "Ahmedabad"
}

const POPULAR_ROUTES: Record<string, { from: string; to: string; label: string }[]> = {
  bengaluru: [
    { from: "Koramangala", to: "Kempegowda International Airport", label: "Koramangala → Airport" },
    { from: "Indiranagar", to: "Electronic City", label: "Indiranagar → Electronic City" },
    { from: "MG Road", to: "Whitefield", label: "MG Road → Whitefield" },
  ],
  mumbai: [
    { from: "Bandra", to: "Andheri", label: "Bandra → Andheri" },
    { from: "Dadar", to: "Chhatrapati Shivaji International Airport", label: "Dadar → Airport" },
    { from: "Colaba", to: "Powai", label: "Colaba → Powai" },
  ],
  delhi: [
    { from: "Connaught Place", to: "Indira Gandhi International Airport", label: "CP → Airport" },
    { from: "Lajpat Nagar", to: "Cyber City Gurgaon", label: "Lajpat Nagar → Cyber City" },
    { from: "Karol Bagh", to: "Noida Sector 18", label: "Karol Bagh → Noida" },
  ],
  hyderabad: [
    { from: "Hitech City", to: "Rajiv Gandhi International Airport", label: "Hitech City → Airport" },
    { from: "Banjara Hills", to: "Secunderabad", label: "Banjara Hills → Secunderabad" },
    { from: "Gachibowli", to: "Charminar", label: "Gachibowli → Charminar" },
  ],
  chennai: [
    { from: "T Nagar", to: "Chennai International Airport", label: "T Nagar → Airport" },
    { from: "Anna Nagar", to: "OMR", label: "Anna Nagar → OMR" },
    { from: "Adyar", to: "Guindy", label: "Adyar → Guindy" },
  ],
  pune: [
    { from: "Koregaon Park", to: "Pune International Airport", label: "Koregaon Park → Airport" },
    { from: "Hinjewadi", to: "FC Road", label: "Hinjewadi → FC Road" },
    { from: "Kothrud", to: "Viman Nagar", label: "Kothrud → Viman Nagar" },
  ],
  kolkata: [
    { from: "Park Street", to: "Netaji Subhas Chandra Bose International Airport", label: "Park Street → Airport" },
    { from: "Salt Lake", to: "Howrah", label: "Salt Lake → Howrah" },
    { from: "New Town", to: "Esplanade", label: "New Town → Esplanade" },
  ],
  ahmedabad: [
    { from: "Navrangpura", to: "Sardar Vallabhbhai Patel International Airport", label: "Navrangpura → Airport" },
    { from: "Satellite", to: "Maninagar", label: "Satellite → Maninagar" },
    { from: "SG Highway", to: "Old City", label: "SG Highway → Old City" },
  ],
}

const PLATFORM_BORDER: Record<string, string> = {
  Uber: "border-white/15 bg-white/3",
  Ola: "border-yellow-500/20 bg-yellow-500/5",
  Rapido: "border-green-500/20 bg-green-500/5",
  InDrive: "border-blue-500/20 bg-blue-500/5",
  BluSmart: "border-cyan-500/20 bg-cyan-500/5",
  Metro: "border-purple-500/20 bg-purple-500/5",
}

const PLATFORM_BTN: Record<string, string> = {
  Uber: "bg-white text-black",
  Ola: "bg-yellow-400 text-black",
  Rapido: "bg-green-400 text-black",
  InDrive: "bg-blue-500 text-white",
  BluSmart: "bg-cyan-400 text-black",
  Metro: "bg-purple-500 text-white",
}

const PLATFORM_COLORS: Record<string, string> = {
  Uber: "#ffffff", Ola: "#EAB308", Rapido: "#22C55E",
  InDrive: "#3B82F6", BluSmart: "#06B6D4", Metro: "#A855F7",
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "🏍️ Bikes", value: "bike" },
  { label: "🛺 Autos", value: "auto" },
  { label: "🚗 Cabs", value: "cab" },
  { label: "⭐ Premium", value: "premium" },
  { label: "🚇 Metro", value: "metro" },
  { label: "⚡ EV", value: "ev" },
]

const SURGE_HOURS = [
  { hour: "12am", level: 1 }, { hour: "1am", level: 1 }, { hour: "2am", level: 1 },
  { hour: "3am", level: 1 }, { hour: "4am", level: 1 }, { hour: "5am", level: 2 },
  { hour: "6am", level: 2 }, { hour: "7am", level: 3 }, { hour: "8am", level: 4 },
  { hour: "9am", level: 4 }, { hour: "10am", level: 3 }, { hour: "11am", level: 2 },
  { hour: "12pm", level: 2 }, { hour: "1pm", level: 2 }, { hour: "2pm", level: 1 },
  { hour: "3pm", level: 1 }, { hour: "4pm", level: 2 }, { hour: "5pm", level: 4 },
  { hour: "6pm", level: 4 }, { hour: "7pm", level: 4 }, { hour: "8pm", level: 3 },
  { hour: "9pm", level: 2 }, { hour: "10pm", level: 2 }, { hour: "11pm", level: 1 },
]

const SURGE_BG: Record<number, string> = {
  1: "bg-[#00C875]", 2: "bg-[#FF9500]", 3: "bg-[#FF6B35]", 4: "bg-red-500",
}

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
  const [copied, setCopied] = useState(false)
  const [showSurgeChart, setShowSurgeChart] = useState(false)
  const [showCostBreakdown, setShowCostBreakdown] = useState<string | null>(null)

  const currentHour = new Date().getHours()

  const fetchRides = async (f: string, t: string, c: string) => {
    if (!f.trim() || !t.trim()) { setError("Please enter both from and to locations"); return }
    setLoading(true); setSearched(true); setError(""); setResults([])
    try {
      const res = await fetch(`/api/rides?city=${c}&from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}`)
      const data = await res.json()
      if (data.success) {
        setResults(data.results)
        setIsRushHour(data.isRushHour)
        setRouteInfo({ distanceKm: data.distanceKm, timeMin: data.timeMin, from: data.from, to: data.to })
      } else {
        setError("Could not calculate route. Try again.")
      }
    } catch { setError("Something went wrong.") }
    finally { setLoading(false) }
  }

  const swapLocations = () => { const tmp = from; setFrom(to); setTo(tmp) }

  const filtered = filter === "all" ? results : results.filter((r) => r.category === filter)
  const cheapest = results[0] || null
  const surgeRides = results.filter((r) => r.hasSurge)

  const handleWhatsAppShare = () => {
    if (!cheapest) return
    const msg = `🚗 SabSasta Ride Comparison\n\n📍 ${routeInfo.from.split(",")[0]} → ${routeInfo.to.split(",")[0]}\n📏 ${routeInfo.distanceKm} km · ⏱ ${routeInfo.timeMin} min\n\n💰 Cheapest: ${cheapest.type} at ${cheapest.priceRange}\n\nCheck all prices: https://sabsasta-rho.vercel.app/rides`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank")
  }

  const handleCopyPrice = () => {
    if (!cheapest) return
    navigator.clipboard.writeText(`${cheapest.type}: ${cheapest.priceRange}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openGoogleMaps = () => {
    if (!routeInfo.from || !routeInfo.to) return
    window.open(`https://www.google.com/maps/dir/${encodeURIComponent(routeInfo.from)}/${encodeURIComponent(routeInfo.to)}`, "_blank")
  }

  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />
      <div className="mx-auto max-w-2xl px-4 py-8">

        <h1 className="text-2xl font-extrabold mb-1">Ride Price Comparison</h1>
        <p className="text-white/40 text-sm mb-6">Uber · Ola · Rapido · InDrive · BluSmart · Metro</p>

        {isRushHour && (
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-3 mb-5 flex items-center gap-2 text-sm">
            <span>⚠️</span>
            <span className="text-orange-400 font-semibold">Rush hour active</span>
            <span className="text-white/50">— surge on some platforms</span>
            <button onClick={() => setShowSurgeChart(!showSurgeChart)} className="ml-auto text-xs text-[#FF9500] underline">Best times →</button>
          </div>
        )}

        {/* Input form */}
        <div className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-4 mb-5">
          <div className="mb-4">
            <div className="text-[10px] text-white/35 uppercase tracking-wider mb-2">Select City</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CITIES.map((c) => (
                <button key={c} onClick={() => setCity(c)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${city === c ? "border-[#FF6B35] bg-[#FF6B35]/15 text-[#FF9500]" : "border-white/10 text-white/50 hover:text-white"}`}>
                  {CITY_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1">
              <PlacesAutocomplete
                value={from}
                onChange={setFrom}
                onSelect={(val) => setFrom(val)}
                label="FROM"
                placeholder={`e.g. Koramangala, ${CITY_LABELS[city]}`}
                city={CITY_LABELS[city]}
                showDetect={true}
              />
            </div>
            <button onClick={swapLocations} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xl hover:border-[#FF6B35]/40 transition-all mt-5">⇅</button>
          </div>

          <PlacesAutocomplete
            value={to}
            onChange={setTo}
            onSelect={(val) => setTo(val)}
            label="TO"
            placeholder={`e.g. Kempegowda Airport, Whitefield`}
            city={CITY_LABELS[city]}
            className="mb-4"
          />

          {error && <p className="text-xs text-red-400 mb-3">⚠️ {error}</p>}

          <button onClick={() => fetchRides(from, to, city)} disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] py-3.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all">
            {loading ? "Finding cheapest ride..." : "🔍 Compare All Rides →"}
          </button>
        </div>

        {/* Popular routes */}
        <div className="mb-5">
          <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Popular in {CITY_LABELS[city]}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(POPULAR_ROUTES[city] || []).map((route) => (
              <button key={route.label}
                onClick={() => { setFrom(route.from); setTo(route.to); fetchRides(route.from, route.to, city) }}
                className="shrink-0 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs text-white/60 hover:border-[#FF6B35]/40 hover:text-white transition-all">
                {route.label}
              </button>
            ))}
          </div>
        </div>

        {/* Surge chart */}
        <div className="mb-5">
          <button onClick={() => setShowSurgeChart(!showSurgeChart)}
            className="w-full rounded-xl border border-white/7 bg-white/2 p-3 flex items-center justify-between text-sm hover:border-[#FF6B35]/30 transition-all">
            <span className="font-semibold">📊 Best Time to Book — Surge Chart</span>
            <span className="text-white/40 text-xs">{showSurgeChart ? "Hide ▲" : "Show ▼"}</span>
          </button>
          {showSurgeChart && (
            <div className="rounded-xl border border-white/7 bg-[#0D0D1B] p-4 mt-2">
              <p className="text-xs text-white/40 mb-3">Typical surge pattern. Green = cheap, Red = expensive.</p>
              <div className="flex items-end gap-0.5 h-16 mb-2">
                {SURGE_HOURS.map((h, i) => (
                  <div key={i} className="flex-1">
                    <div className={`w-full rounded-sm ${SURGE_BG[h.level]} ${i === currentHour ? "ring-1 ring-white" : ""}`}
                      style={{ height: `${h.level * 14}px` }} title={h.hour} />
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5 mb-3">
                {SURGE_HOURS.map((h, i) => (
                  <div key={i} className="flex-1 text-center">
                    {i % 6 === 0 && <span className={`text-[8px] ${i === currentHour ? "text-white font-bold" : "text-white/25"}`}>{h.hour}</span>}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap text-xs mb-3">
                {[{ level: 1, label: "Low — Best" }, { level: 2, label: "Medium" }, { level: 3, label: "High" }, { level: 4, label: "Rush Hour" }].map((l) => (
                  <div key={l.level} className="flex items-center gap-1.5">
                    <div className={`h-2.5 w-2.5 rounded-sm ${SURGE_BG[l.level]}`} />
                    <span className="text-white/40">{l.label}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-[#00C875]/10 border border-[#00C875]/20 p-2.5">
                <p className="text-xs text-[#00C875]">💡 Best times today: <strong>12am, 1am, 2am, 3am, 2pm, 3pm, 11pm</strong> — no surge</p>
              </div>
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
          {FILTERS.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${filter === f.value ? "border-[#FF6B35] bg-[#FF6B35]/15 text-[#FF9500]" : "border-white/10 text-white/50 hover:text-white"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">🚗</div>
            <p className="text-white/50">Calculating best prices...</p>
          </div>
        )}

        {!loading && routeInfo.distanceKm > 0 && (
          <div className="rounded-xl border border-white/7 bg-white/3 p-3 mb-5 flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs text-white/50">
              <span className="text-white font-semibold">{routeInfo.from.split(",")[0]}</span> → <span className="text-white font-semibold">{routeInfo.to.split(",")[0]}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-xs text-white/40">📍 {routeInfo.distanceKm} km</span>
              <span className="text-xs text-white/40">⏱ ~{routeInfo.timeMin} min</span>
              <button onClick={openGoogleMaps} className="text-xs text-[#FF9500] border border-[#FF9500]/30 rounded-full px-2.5 py-1 hover:bg-[#FF9500]/10 transition-all">🗺️ Map</button>
            </div>
          </div>
        )}

        {cheapest && !loading && (
          <div className="rounded-xl border border-[#00C875]/30 bg-[#00C875]/5 p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-bold text-[#00C875] mb-1 uppercase tracking-wider">Cheapest Option</div>
                <div className="font-semibold text-sm">{cheapest.type}</div>
                <div className="text-xs text-white/40 mt-0.5">{cheapest.eta} min away · Rs.{cheapest.costPerKm}/km</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-[#00C875]">{cheapest.priceRange}</div>
                {cheapest.savingsVsMax > 0 && <div className="text-xs text-[#00C875]/70 mt-0.5">Save Rs.{cheapest.savingsVsMax} vs costliest</div>}
              </div>
            </div>
            <div className="flex gap-2">
              <a href={cheapest.bookLink} target="_blank" rel="noopener noreferrer"
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold text-center hover:opacity-90 ${PLATFORM_BTN[cheapest.platform] || "bg-white text-black"}`}>
                Book {cheapest.platform} →
              </a>
              <button onClick={openGoogleMaps} className="rounded-lg bg-blue-500/20 border border-blue-500/30 px-3 py-2.5 text-xs font-bold text-blue-400">🗺️</button>
              <button onClick={handleWhatsAppShare} className="rounded-lg bg-[#25D366]/20 border border-[#25D366]/30 px-3 py-2.5 text-xs font-bold text-[#25D366]">📲</button>
              <button onClick={handleCopyPrice} className="rounded-lg bg-white/8 border border-white/10 px-3 py-2.5 text-xs font-bold text-white/60">{copied ? "✓" : "📋"}</button>
            </div>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-3 mb-6">
            {filtered.map((ride) => (
              <div key={ride.id} className={`rounded-2xl border p-4 transition-all ${ride.isCheapest ? "border-[#00C875]/40 bg-[#00C875]/5" : PLATFORM_BORDER[ride.platform] || "border-white/7 bg-white/2"}`}>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_COLORS[ride.platform] || "#fff" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-sm">{ride.type}</span>
                      {ride.isCheapest && <span className="rounded-full bg-[#00C875]/15 px-2 py-0.5 text-[9px] font-bold text-[#00C875]">CHEAPEST</span>}
                      {ride.hasSurge && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-400">{ride.surgeMultiplier}x SURGE</span>}
                      {ride.savingsVsMax > 50 && !ride.isCheapest && <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[9px] font-bold text-blue-400">Save Rs.{ride.savingsVsMax}</span>}
                    </div>
                    <div className="text-xs text-white/40 flex items-center gap-2">
                      <span>{ride.eta} min away</span>·
                      <button onClick={() => setShowCostBreakdown(showCostBreakdown === ride.id ? null : ride.id)} className="text-[#FF9500] hover:underline">Rs.{ride.costPerKm}/km ▾</button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-lg font-extrabold ${ride.isCheapest ? "text-[#00C875]" : "text-white"}`}>{ride.priceRange}</div>
                    <a href={ride.bookLink} target="_blank" rel="noopener noreferrer"
                      className={`mt-1 inline-block rounded-lg px-3 py-1.5 text-xs font-bold hover:opacity-90 ${ride.isCheapest ? PLATFORM_BTN[ride.platform] || "bg-white text-black" : "bg-white/8 text-white/60"}`}>
                      Book →
                    </a>
                  </div>
                </div>
                {showCostBreakdown === ride.id && (
                  <div className="mt-3 pt-3 border-t border-white/7 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-white/3 p-2.5 text-center">
                      <div className="text-xs text-white/30 mb-1">Base Fare</div>
                      <div className="text-sm font-bold">Rs.{ride.basePrice}</div>
                    </div>
                    <div className="rounded-lg bg-white/3 p-2.5 text-center">
                      <div className="text-xs text-white/30 mb-1">Per km</div>
                      <div className="text-sm font-bold">Rs.{ride.costPerKm}</div>
                    </div>
                    <div className="rounded-lg bg-white/3 p-2.5 text-center">
                      <div className="text-xs text-white/30 mb-1">Distance</div>
                      <div className="text-sm font-bold">{ride.distanceKm} km</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="rounded-xl border border-white/7 bg-white/2 p-3 mb-5">
              <p className="text-xs text-white/35 leading-relaxed">
                💡 Estimates based on {CITY_LABELS[city]} base rates. Click <strong className="text-white/60">Book →</strong> to see exact price in app.
              </p>
            </div>
            <div className="rounded-xl border border-[#FF6B35]/20 bg-[#FF6B35]/5 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <p className="text-sm text-white/70 leading-relaxed">
                  {surgeRides.length > 0 ? `${surgeRides.map((r) => r.platform).filter((v, i, a) => a.indexOf(v) === i).join(" & ")} has surge. ` : "No surge active. "}
                  {cheapest && `${cheapest.type} is cheapest at ${cheapest.priceRange} (Rs.${cheapest.costPerKm}/km). `}
                  {surgeRides.length > 0 ? "Try Rapido or Ola." : "Good time to book!"}
                </p>
              </div>
            </div>
          </>
        )}

        {!searched && !loading && (
          <div className="text-center py-16 text-white/30">
            <div className="text-5xl mb-3">🚗</div>
            <p className="text-sm">Enter your route above to compare prices</p>
            <p className="text-xs mt-2 text-white/20">8 cities · Uber, Ola, Rapido, InDrive, BluSmart, Metro</p>
          </div>
        )}

      </div>
    </main>
  )
}