"use client"

import { useState } from "react"
import Nav from "../../components/Nav"
import { GROCERY_ITEMS, PRESET_BASKETS } from "../../lib/grocery"
import { GroceryItem } from "../../types"

const PLATFORMS = ["Blinkit", "Zepto", "BigBasket", "JioMart"]
const platformColors: Record<string, string> = {
  Blinkit: "text-[#F8C301]",
  Zepto: "text-[#8B5CF6]",
  BigBasket: "text-[#84CC16]",
  JioMart: "text-[#006DB7]",
}
const platformDelivery: Record<string, string> = {
  Blinkit: "10 min",
  Zepto: "10 min",
  BigBasket: "2 hrs",
  JioMart: "4 hrs",
}

export default function GroceryPage() {
  const [basket, setBasket] = useState<string[]>(["milk-1l", "eggs-12", "banana-6", "tomato-500g", "oil-1l"])
  const [search, setSearch] = useState("")

  const basketItems: GroceryItem[] = GROCERY_ITEMS.filter((item) => basket.includes(item.id))

  const totals = PLATFORMS.map((platform) => {
    const total = basketItems.reduce((sum, item) => {
      const p = item.platforms.find((pl) => pl.platform === platform)
      return sum + (p?.price || 0)
    }, 0)
    return { platform, total }
  })
  const cheapestPlatform = totals.reduce((a, b) => (a.total < b.total ? a : b))

  const filteredItems = GROCERY_ITEMS.filter(
    (item) =>
      !basket.includes(item.id) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  )

  const addItem = (id: string) => setBasket([...basket, id])
  const removeItem = (id: string) => setBasket(basket.filter((i) => i !== id))

  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />
      <div className="mx-auto max-w-4xl px-4 py-8">

        <h1 className="text-2xl font-extrabold mb-1">Grocery Comparison</h1>
        <p className="text-white/40 text-sm mb-6">Compare basket total across Blinkit, Zepto, BigBasket & JioMart</p>

        {/* Preset baskets */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
          {Object.keys(PRESET_BASKETS).map((name) => (
            <button
              key={name}
              onClick={() => setBasket(PRESET_BASKETS[name])}
              className="shrink-0 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs text-white/60 hover:border-[#FF6B35]/40 hover:text-white transition-all"
            >
              {name}
            </button>
          ))}
        </div>

        {/* Current basket */}
        <div className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-4 mb-5">
          <p className="text-sm font-bold mb-3">🛒 Your Basket ({basketItems.length} items)</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {basketItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs"
              >
                <span>{item.name}</span>
                <button onClick={() => removeItem(item.id)} className="text-white/30 hover:text-red-400 ml-1">×</button>
              </div>
            ))}
          </div>

          {/* Add items */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-8 pr-4 text-sm text-white placeholder-white/30 outline-none"
              placeholder="Add item to basket..."
            />
          </div>
          {search && filteredItems.length > 0 && (
            <div className="mt-2 rounded-xl border border-white/10 bg-[#0D0D1B] overflow-hidden">
              {filteredItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => { addItem(item.id); setSearch("") }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white flex items-center justify-between"
                >
                  <span>{item.name} · {item.unit}</span>
                  <span className="text-[#FF9500] text-xs">+ Add</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Platform totals summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
          {totals.map(({ platform, total }) => (
            <div
              key={platform}
              className={`rounded-2xl border p-4 text-center ${
                platform === cheapestPlatform.platform
                  ? "border-[#00C875]/40 bg-[#00C875]/5"
                  : "border-white/7 bg-[#0D0D1B]"
              }`}
            >
              <div className={`text-sm font-bold mb-1 ${platformColors[platform]}`}>{platform}</div>
              <div className="text-xs text-white/35 mb-2">⏱ {platformDelivery[platform]}</div>
              <div className={`text-2xl font-extrabold ${platform === cheapestPlatform.platform ? "text-[#00C875]" : "text-white"}`}>
                ₹{total}
              </div>
              {platform === cheapestPlatform.platform && (
                <div className="text-[10px] text-[#00C875] font-bold mt-1">CHEAPEST</div>
              )}
              <a
                href={`https://www.${platform.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 block rounded-lg py-1.5 text-xs font-bold hover:opacity-90 ${
                  platform === cheapestPlatform.platform
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#FF9500] text-white"
                    : "bg-white/8 text-white/60"
                }`}
              >
                Order All →
              </a>
            </div>
          ))}
        </div>

        {/* Item-by-item table */}
        <div className="rounded-2xl border border-white/7 bg-[#0D0D1B] overflow-hidden">
          <div className="grid grid-cols-5 border-b border-white/7 px-4 py-3 text-xs font-bold text-white/40 uppercase tracking-wider">
            <div>Item</div>
            {PLATFORMS.map((p) => (
              <div key={p} className={`text-right ${platformColors[p]}`}>{p}</div>
            ))}
          </div>
          {basketItems.map((item, i) => (
            <div
              key={item.id}
              className={`grid grid-cols-5 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white/1" : ""}`}
            >
              <div className="text-white/70">{item.name}<span className="text-white/30 ml-1 text-xs">({item.unit})</span></div>
              {PLATFORMS.map((platform) => {
                const p = item.platforms.find((pl) => pl.platform === platform)
                const isCheapest = p?.isBest
                return (
                  <div key={platform} className={`text-right font-semibold ${isCheapest ? "text-[#00C875]" : "text-white"}`}>
                    {p ? `₹${p.price}` : "—"}
                    {isCheapest && <span className="ml-1 text-[#00C875] text-xs">✓</span>}
                  </div>
                )
              })}
            </div>
          ))}
          {/* Total row */}
          <div className="grid grid-cols-5 border-t border-white/10 bg-white/3 px-4 py-3 text-sm font-extrabold">
            <div className="text-white">TOTAL</div>
            {totals.map(({ platform, total }) => (
              <div
                key={platform}
                className={`text-right text-base ${platform === cheapestPlatform.platform ? "text-[#00C875]" : "text-white"}`}
              >
                ₹{total}
              </div>
            ))}
          </div>
        </div>

        {/* AI tip */}
        <div className="mt-5 rounded-xl border border-[#FF6B35]/20 bg-[#FF6B35]/5 p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">🤖</span>
            <p className="text-sm text-white/70">
              <span className="text-[#00C875] font-semibold">{cheapestPlatform.platform}</span> is cheapest for this basket at ₹{cheapestPlatform.total}.{" "}
              You save ₹{Math.max(...totals.map((t) => t.total)) - cheapestPlatform.total} vs most expensive.{" "}
              {cheapestPlatform.platform === "BigBasket" ? "Note: 2hr delivery. Switch to Blinkit if you need items now." : ""}
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}