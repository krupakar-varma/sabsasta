"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Nav from "../components/Nav"

const CATEGORIES = [
  { emoji: "🛍️", name: "Products", desc: "Amazon · Flipkart", href: "/compare" },
  { emoji: "🍕", name: "Food", desc: "Swiggy · 15 cities", href: "/food" },
  { emoji: "🚗", name: "Rides", desc: "Uber · Ola · Rapido", href: "/rides" },
  { emoji: "🔥", name: "Deals", desc: "All coupons today", href: "/deals" },
  { emoji: "✈️", name: "Flights", desc: "MMT · EaseMyTrip", href: "/flights" },
  { emoji: "🛒", name: "Grocery", desc: "Blinkit · Zepto", href: "/grocery" },
]

const TRENDING = [
  { category: "📱 Products", name: "Samsung Galaxy M35 5G", price: "Rs.17,999", platform: "Amazon", save: "Save Rs.4,000", href: "/compare?q=samsung+galaxy+m35", hot: true },
  { category: "🍕 Food", name: "Biryani — Cheapest in Bengaluru", price: "Rs.119", platform: "Swiggy", save: "Real price", href: "/food", hot: true },
  { category: "🚗 Rides", name: "Koramangala to Airport", price: "Rs.83", platform: "Rapido Bike", save: "Save Rs.431 vs Uber", href: "/rides", hot: false },
  { category: "🔥 Deals", name: "40% off on Swiggy orders", price: "Up to Rs.120", platform: "Swiggy", save: "Code: SWIGGY40", href: "/deals", hot: true },
  { category: "📱 Products", name: "iQOO Z9 5G 8GB 128GB", price: "Rs.18,999", platform: "Amazon", save: "Best price now", href: "/compare?q=iqoo+z9", hot: false },
  { category: "🚗 Rides", name: "Rapido Bike Flat Rs.40 off", price: "Rs.40 OFF", platform: "Rapido", save: "Code: RAPIDO40", href: "/deals", hot: false },
]

const POPULAR_SEARCHES = ["Samsung M35", "Biryani", "Uber vs Ola", "iPhone 15", "Pizza", "Swiggy deals"]

const STATS = [
  { number: "15+", label: "Cities" },
  { number: "8+", label: "Platforms" },
  { number: "100%", label: "Free" },
  { number: "Real", label: "Prices" },
]

function detectCategory(query: string): string {
  const q = query.toLowerCase()
  if (q.includes("uber") || q.includes("ola") || q.includes("rapido") || q.includes("ride") || q.includes("cab")) return "/rides"
  if (q.includes("flight") || q.includes("fly") || q.includes("airport")) return "/flights"
  if (q.includes("food") || q.includes("pizza") || q.includes("biryani") || q.includes("dosa") || q.includes("burger") || q.includes("swiggy")) return "/food"
  if (q.includes("grocery") || q.includes("milk") || q.includes("vegetable") || q.includes("blinkit") || q.includes("zepto")) return "/grocery"
  if (q.includes("deal") || q.includes("coupon") || q.includes("offer")) return "/deals"
  return "/compare"
}

const categoryLabels: Record<string, string> = {
  "/compare": "🛍️ Products",
  "/food": "🍕 Food",
  "/rides": "🚗 Rides",
  "/flights": "✈️ Flights",
  "/grocery": "🛒 Grocery",
  "/deals": "🔥 Deals",
}

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [detectedCategory, setDetectedCategory] = useState("")

  const handleQueryChange = (val: string) => {
    setQuery(val)
    if (val.length > 2) {
      setDetectedCategory(detectCategory(val))
    } else {
      setDetectedCategory("")
    }
  }

  const handleSearch = (q?: string) => {
    const searchQuery = q || query
    if (!searchQuery.trim()) return
    const category = detectCategory(searchQuery)
    if (category === "/compare") {
      router.push("/compare?q=" + encodeURIComponent(searchQuery.trim()))
    } else {
      router.push(category)
    }
  }

  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />
      <div className="mx-auto max-w-5xl px-4 pb-20">

        {/* HERO */}
        <section className="pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/10 px-4 py-1.5 text-xs font-bold text-[#FF9500] tracking-widest uppercase mb-6">
            <span className="animate-pulse">🟢</span>
            Live prices updated in real-time
          </div>

          <h1 className="text-4xl font-extrabold leading-tight mb-3 sm:text-6xl">
            India Ka{" "}
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF9500] bg-clip-text text-transparent">
              Sabse Sasta
            </span>
            <br />Compare App
          </h1>

          <p className="mx-auto max-w-lg text-white/40 text-sm leading-relaxed mb-8">
            Food, rides, products, deals — compare everything across all Indian platforms. Always free.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-extrabold text-[#FF9500]">{stat.number}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="mx-auto max-w-2xl">
            <div className="relative flex gap-2 mb-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
                <input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-11 pr-32 text-sm text-white placeholder-white/30 outline-none focus:border-[#FF6B35]/50 transition-all"
                  placeholder="Samsung M35, pizza, Uber to airport..."
                />
                {detectedCategory && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF9500]">
                    {categoryLabels[detectedCategory]}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleSearch()}
                className="rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-6 py-4 text-sm font-bold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Compare
              </button>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-white/50 hover:border-[#FF6B35]/40 hover:text-white transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-white/80">Compare by Category</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className="group rounded-2xl border border-white/7 bg-white/3 p-4 text-center hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/5 transition-all hover:scale-105"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="text-xs font-bold text-white group-hover:text-[#FF9500] transition-colors">{cat.name}</div>
                <div className="text-[9px] text-white/30 mt-0.5 leading-tight">{cat.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* TRENDING */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">🔥 Trending Now</h2>
            <a href="/deals" className="text-xs text-[#FF9500] hover:underline">All deals</a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRENDING.map((deal) => (
              <a
                key={deal.name}
                href={deal.href}
                className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-4 hover:border-[#FF6B35]/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#FF9500] tracking-wider uppercase">{deal.category}</span>
                  {deal.hot && (
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-400">HOT</span>
                  )}
                </div>
                <div className="font-semibold text-sm mb-3 group-hover:text-[#FF9500] transition-colors leading-tight line-clamp-2">
                  {deal.name}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xl font-bold text-[#00C875]">{deal.price}</div>
                    <div className="text-xs text-white/40 mt-0.5">on {deal.platform}</div>
                  </div>
                  <div className="rounded-lg bg-[#00C875]/10 border border-[#00C875]/20 px-2 py-1 text-[10px] font-bold text-[#00C875]">
                    {deal.save}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* DEALS BANNER */}
        <section className="mb-10">
          <a
            href="/deals"
            className="block rounded-2xl border border-[#FF6B35]/20 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF9500]/5 p-6 hover:border-[#FF6B35]/40 transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎫</div>
                <div>
                  <div className="font-extrabold text-base mb-1">Today&apos;s Best Coupons</div>
                  <div className="text-sm text-white/50">Swiggy · Zomato · Blinkit · Zepto · Uber · Ola</div>
                </div>
              </div>
              <div className="shrink-0 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-5 py-2.5 text-sm font-bold text-white">
                View Deals
              </div>
            </div>
          </a>
        </section>

        {/* HOW IT WORKS */}
        <section className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-6 mb-10">
          <h2 className="text-lg font-bold mb-5 text-center">How SabSasta Works</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { emoji: "🔍", title: "Search Anything", desc: "Type a product, food, or say Uber vs Ola. We detect the category automatically." },
              { emoji: "⚡", title: "Compare Instantly", desc: "See real prices from all platforms side by side. Find the cheapest in seconds." },
              { emoji: "💰", title: "Buy and Save", desc: "Click to buy on the cheapest platform. Watch YouTube reviews before buying." },
            ].map((step) => (
              <div key={step.title} className="rounded-xl bg-white/3 p-5 text-center">
                <div className="text-3xl mb-3">{step.emoji}</div>
                <p className="font-bold text-sm mb-2">{step.title}</p>
                <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SHARE */}
        <section className="text-center rounded-2xl border border-white/7 bg-white/2 p-8">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-extrabold text-lg mb-2">Share SabSasta with Friends</h3>
          <p className="text-white/40 text-sm mb-5">Help them save money too.</p>
          <a
            href="https://wa.me/?text=Check%20out%20SabSasta%20%E2%80%94%20India%27s%20price%20comparison%20app!%20Compare%20food%2C%20rides%2C%20products%20and%20get%20the%20best%20deals%20%F0%9F%94%A5%0A%0Ahttps%3A%2F%2Fsabsasta-rho.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            📲 Share on WhatsApp
          </a>
        </section>

      </div>
    </main>
  )
}