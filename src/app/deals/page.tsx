"use client"

import { useState } from "react"
import Nav from "@/components/Nav"
import { DEALS, Deal } from "../../lib/deals"

type Category = "all" | "food" | "grocery" | "rides" | "shopping"

const CATEGORIES: { label: string; value: Category; emoji: string }[] = [
  { label: "All Deals", value: "all", emoji: "🔥" },
  { label: "Food", value: "food", emoji: "🍕" },
  { label: "Grocery", value: "grocery", emoji: "🛒" },
  { label: "Rides", value: "rides", emoji: "🚗" },
  { label: "Shopping", value: "shopping", emoji: "🛍️" },
]

function DealCard({ deal, copied, setCopied }: {
  deal: Deal
  copied: string
  setCopied: (id: string) => void
}) {
  const handleCopy = () => {
    if (!deal.code) return
    navigator.clipboard.writeText(deal.code)
    setCopied(deal.id)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className={`rounded-2xl border p-4 ${deal.platformBg}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold" style={{ color: deal.platformColor }}>
            {deal.platform}
          </span>
          {deal.isHot && (
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-400">
              HOT
            </span>
          )}
        </div>
        <span className="rounded-full bg-[#00C875]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#00C875]">
          {deal.discount}
        </span>
      </div>

      <h3 className="font-bold text-sm mb-1">{deal.title}</h3>
      <p className="text-xs text-white/40 mb-3">{deal.description}</p>

      <div className="flex items-center gap-3 mb-3 text-xs text-white/30">
        {deal.minOrder && <span>Min: Rs.{deal.minOrder}</span>}
        {deal.maxDiscount && <span>Max: Rs.{deal.maxDiscount}</span>}
        <span>Valid: {deal.validUntil}</span>
      </div>

      <div className="flex items-center gap-2">
        {deal.code && (
          <button
            onClick={handleCopy}
            className="flex-1 rounded-lg border border-dashed border-white/20 bg-white/5 py-2 text-xs font-bold text-white/70 hover:border-white/40 hover:text-white transition-all"
          >
            {copied === deal.id ? "Copied!" : `${deal.code} — Copy`}
          </button>
        )}
        <a
          href={deal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
        >
          {deal.code ? "Open App" : "Get Deal"}
        </a>
      </div>
    </div>
  )
}

export default function DealsPage() {
  const [category, setCategory] = useState<Category>("all")
  const [copied, setCopied] = useState("")

  const filtered = category === "all"
    ? DEALS
    : DEALS.filter((d) => d.category === category)

  const hotDeals = filtered.filter((d) => d.isHot)
  const otherDeals = filtered.filter((d) => !d.isHot)

  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />
      <div className="mx-auto max-w-3xl px-4 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold mb-1">Today&apos;s Best Deals</h1>
          <p className="text-white/40 text-sm">
            All coupons across Swiggy, Zomato, Blinkit, Zepto, Uber, Ola — in one place
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                category === cat.value
                  ? "border-[#FF6B35] bg-[#FF6B35]/15 text-[#FF9500]"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Hot deals */}
        {hotDeals.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔥</span>
              <h2 className="font-extrabold text-sm uppercase tracking-wider text-[#FF9500]">
                Hot Right Now
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hotDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} copied={copied} setCopied={setCopied} />
              ))}
            </div>
          </div>
        )}

        {/* Other deals */}
        {otherDeals.length > 0 && (
          <div>
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-white/40 mb-3">
              More Deals
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {otherDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} copied={copied} setCopied={setCopied} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-3">🎫</div>
            <p>No deals in this category right now</p>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-white/7 bg-white/3 p-4 text-center">
          <p className="text-xs text-white/40">
            Deals updated daily by the SabSasta team · Last updated: Today
          </p>
        </div>

      </div>
    </main>
  )
}