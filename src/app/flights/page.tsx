"use client"

import Nav from "../../components/Nav"  
import SabSastaScore from "../../components/sabsastascore"
import AITip from "../../components/aitip"
import { FLIGHTS } from "../../lib/flights"
import { useState } from "react"

const POPULAR_ROUTES = [
  { from: "DEL", to: "BOM", label: "Delhi → Mumbai" },
  { from: "BOM", to: "BLR", label: "Mumbai → Bengaluru" },
  { from: "DEL", to: "BLR", label: "Delhi → Bengaluru" },
]

export default function FlightsPage() {
  const [from, setFrom] = useState("DEL")
  const [to, setTo] = useState("BOM")
  const [date, setDate] = useState("")
  const [searched, setSearched] = useState(false)

  const results = FLIGHTS.filter(
    (f) => f.from === from.toUpperCase() && f.to === to.toUpperCase()
  )

  const handleSearch = () => setSearched(true)

  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />
      <div className="mx-auto max-w-3xl px-4 py-8">

        <h1 className="text-2xl font-extrabold mb-1">Flight Comparison</h1>
        <p className="text-white/40 text-sm mb-6">Best fare across all booking platforms instantly</p>

        {/* Search box */}
        <div className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-5 mb-6">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">From</div>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full bg-transparent text-xl font-extrabold text-white outline-none uppercase"
                placeholder="DEL"
              />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">To</div>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full bg-transparent text-xl font-extrabold text-white outline-none uppercase"
                placeholder="BOM"
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#FF6B35]/50"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] py-3 text-sm font-bold text-white hover:opacity-90"
          >
            Search Flights
          </button>
        </div>

        {/* Popular routes */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {POPULAR_ROUTES.map((route) => (
            <button
              key={`${route.from}-${route.to}`}
              onClick={() => { setFrom(route.from); setTo(route.to); setSearched(true) }}
              className="shrink-0 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs text-white/60 hover:border-[#FF6B35]/40 hover:text-white transition-all"
            >
              {route.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {(searched || true) && results.length > 0 && (
          <div className="space-y-5">
            {/* AI tip */}
            <AITip recommendation={results[0].aiRecommendation} />

            {results.map((flight) => {
              const cheapest = [...flight.platforms].sort((a, b) => a.price - b.price)[0]
              const mostExpensive = [...flight.platforms].sort((a, b) => b.price - a.price)[0]
              const saving = mostExpensive.price - cheapest.price

              return (
                <div key={flight.id} className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-5">
                  {/* Flight route */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-center">
                      <div className="text-2xl font-extrabold">{flight.from}</div>
                      <div className="text-xs text-white/40">{flight.departure}</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-lg">✈️</div>
                      <div className="h-px bg-white/15 my-1" />
                      <div className="text-xs text-white/40">{flight.duration} · {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-extrabold">{flight.to}</div>
                      <div className="text-xs text-white/40">{flight.airline}</div>
                    </div>
                    <SabSastaScore score={flight.sabsastaScore} size="sm" />
                  </div>

                  {/* Platform comparison */}
                  <div className="space-y-2 mb-4">
                    {flight.platforms.map((platform) => (
                      <div
                        key={platform.platform}
                        className={`flex items-center gap-3 rounded-xl border p-3 ${
                          platform.isBest
                            ? "border-[#00C875]/30 bg-[#00C875]/5"
                            : "border-white/7 bg-white/2"
                        }`}
                      >
                        <span className="text-sm font-semibold flex-1">{platform.platform}</span>
                        {platform.isBest && (
                          <span className="text-[9px] font-bold text-[#00C875] bg-[#00C875]/10 rounded-full px-2 py-0.5">
                            CHEAPEST
                          </span>
                        )}
                        <span className={`text-lg font-extrabold ${platform.isBest ? "text-[#00C875]" : "text-white"}`}>
                          ₹{platform.price.toLocaleString()}
                        </span>
                        <a
                          href={platform.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold hover:opacity-90 ${
                            platform.isBest
                              ? "bg-gradient-to-r from-[#FF6B35] to-[#FF9500] text-white"
                              : "bg-white/8 text-white/60"
                          }`}
                        >
                          Book →
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-white/40 text-right">
                    💰 Save <span className="text-[#FF9500] font-bold">₹{saving.toLocaleString()}</span> by booking on {cheapest.platform}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {searched && results.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-3">✈️</div>
            <p>No flights found for {from} → {to}. Try DEL → BOM or BOM → BLR.</p>
          </div>
        )}

      </div>
    </main>
  )
}