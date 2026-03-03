"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Nav from "../components/Nav"

const CATEGORIES = [
  { emoji: "🛍️", name: "Products", desc: "Amazon · Flipkart · Croma", href: "/compare" },
  { emoji: "🍕", name: "Food", desc: "Swiggy · 15 cities", href: "/food" },
  { emoji: "🚗", name: "Rides", desc: "Uber · Ola · Rapido", href: "/rides" },
  { emoji: "🔥", name: "Deals", desc: "All coupons today", href: "/deals" },
  { emoji: "✈️", name: "Flights", desc: "MMT · EaseMyTrip", href: "/flights" },
  { emoji: "🛒", name: "Grocery", desc: "Blinkit · Zepto", href: "/grocery" },
]

const PLATFORMS = [
  { name: "Swiggy", color: "#FC8019", bg: "bg-[#FC8019]", initial: "S" },
  { name: "Zomato", color: "#CB202D", bg: "bg-[#CB202D]", initial: "Z" },
  { name: "Amazon", color: "#FF9900", bg: "bg-[#FF9900]", initial: "A" },
  { name: "Flipkart", color: "#2874F0", bg: "bg-[#2874F0]", initial: "F" },
  { name: "Uber", color: "#000000", bg: "bg-white", initial: "U", dark: true },
  { name: "Ola", color: "#EAB308", bg: "bg-[#EAB308]", initial: "O" },
  { name: "Rapido", color: "#22C55E", bg: "bg-[#22C55E]", initial: "R" },
  { name: "Blinkit", color: "#F8CE12", bg: "bg-[#F8CE12]", initial: "B", dark: true },
  { name: "Zepto", color: "#8B5CF6", bg: "bg-[#8B5CF6]", initial: "Z" },
  { name: "Croma", color: "#00A859", bg: "bg-[#00A859]", initial: "C" },
]

const TRENDING = [
  { category: "📱 Products", name: "Samsung Galaxy M35 5G", price: "Rs.17,999", platform: "Amazon", save: "Save Rs.4,000", href: "/compare?q=samsung+galaxy+m35", hot: true },
  { category: "🍕 Food", name: "Biryani cheapest in Bengaluru", price: "Rs.119", platform: "Swiggy", save: "Real price", href: "/food", hot: true },
  { category: "🚗 Rides", name: "Rapido Bike vs Uber Go", price: "Rs.83", platform: "Rapido Bike", save: "Save Rs.431", href: "/rides", hot: false },
  { category: "🔥 Deals", name: "40% off on Swiggy orders", price: "Up to Rs.120", platform: "Swiggy", save: "SWIGGY40", href: "/deals", hot: true },
  { category: "📱 Products", name: "iQOO Z9 5G 8GB 128GB", price: "Rs.18,999", platform: "Amazon", save: "Best price", href: "/compare?q=iqoo+z9", hot: false },
  { category: "🛒 Grocery", name: "Blinkit vs Zepto prices", price: "Save 20%", platform: "Blinkit", save: "Compare now", href: "/grocery", hot: false },
]

const POPULAR_SEARCHES = ["Samsung M35", "Biryani", "Uber vs Ola", "iPhone 15", "Pizza", "Deals today"]

function detectCategory(query: string): string {
  const q = query.toLowerCase()
  if (q.includes("uber") || q.includes("ola") || q.includes("rapido") || q.includes("ride") || q.includes("cab")) return "/rides"
  if (q.includes("flight") || q.includes("fly") || q.includes("airport")) return "/flights"
  if (q.includes("food") || q.includes("pizza") || q.includes("biryani") || q.includes("dosa") || q.includes("burger") || q.includes("swiggy")) return "/food"
  if (q.includes("grocery") || q.includes("milk") || q.includes("blinkit") || q.includes("zepto")) return "/grocery"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <main className="min-h-screen bg-[#07070F] text-white overflow-hidden">

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#FF6B35]/8 blur-[120px]" />
        <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#FF9500]/6 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#FF6B35]/5 blur-[80px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <Nav />

      <div className="relative mx-auto max-w-5xl px-4 pb-20">

        {/* HERO */}
        <section className="pt-14 pb-12 text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-4 py-1.5 text-xs font-bold text-[#FF9500] tracking-widest uppercase mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Live prices · Updated every hour
          </div>

          <h1 className="text-4xl font-extrabold leading-tight mb-4 sm:text-6xl tracking-tight">
            India Ka{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#FF6B35] via-[#FF8C00] to-[#FF9500] bg-clip-text text-transparent">
                Sabse Sasta
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6B35] to-[#FF9500] opacity-50 rounded-full" />
            </span>
            {" "}App
          </h1>

          <p className="mx-auto max-w-lg text-white/40 text-sm leading-relaxed mb-6">
            Compare food, rides, products and deals across all Indian platforms in one place. Real prices, always free.
          </p>

          {/* Platform logos row */}
          <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                title={p.name}
                className={`h-8 w-8 rounded-lg ${p.bg} flex items-center justify-center text-xs font-extrabold shadow-lg ${p.dark ? "text-black" : "text-white"} opacity-80 hover:opacity-100 transition-opacity hover:scale-110 cursor-default`}
              >
                {p.initial}
              </div>
            ))}
            <div className="text-xs text-white/30 ml-1">+more</div>
          </div>

          {/* Search box */}
          <div className="mx-auto max-w-2xl">
            <div className="relative flex gap-2 mb-4 p-1 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-base">🔍</span>
                <input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-28 text-sm text-white placeholder-white/25 outline-none"
                  placeholder="Samsung M35, pizza, Uber to airport..."
                />
                {detectedCategory && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]/20 border border-[#FF6B35]/30 px-2 py-0.5 text-[10px] font-bold text-[#FF9500]">
                    {categoryLabels[detectedCategory]}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleSearch()}
                className="rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-6 py-3 text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-orange-500/20"
              >
                Compare →
              </button>
            </div>

            {/* Popular */}
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-xs text-white/45 hover:border-[#FF6B35]/40 hover:text-white hover:bg-[#FF6B35]/8 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="mb-10 grid grid-cols-4 gap-3">
          {[
            { n: "15+", l: "Cities", icon: "🏙️" },
            { n: "10+", l: "Platforms", icon: "📱" },
            { n: "100%", l: "Free", icon: "✅" },
            { n: "Real", l: "Live Prices", icon: "⚡" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/7 bg-white/2 p-4 text-center backdrop-blur-sm">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-lg font-extrabold text-[#FF9500]">{s.n}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        {/* CATEGORIES */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-white/70 uppercase tracking-wider text-sm">Compare by Category</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className="group relative rounded-2xl border border-white/7 bg-white/2 p-4 text-center hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5 transition-all hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="text-xs font-bold text-white group-hover:text-[#FF9500] transition-colors">{cat.name}</div>
                <div className="text-[9px] text-white/25 mt-0.5 leading-tight">{cat.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* TRENDING */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              🔥 <span>Trending Now</span>
            </h2>
            <a href="/deals" className="text-xs text-[#FF9500] border border-[#FF9500]/30 rounded-full px-3 py-1 hover:bg-[#FF9500]/10 transition-all">
              All deals →
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRENDING.map((deal) => (
              <a
                key={deal.name}
                href={deal.href}
                className="relative rounded-2xl border border-white/7 bg-[#0D0D1B] p-4 hover:border-[#FF6B35]/40 transition-all group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#FF9500] tracking-wider uppercase">{deal.category}</span>
                  {deal.hot && (
                    <span className="rounded-full bg-red-500/15 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400">🔥 HOT</span>
                  )}
                </div>
                <div className="font-semibold text-sm mb-3 group-hover:text-[#FF9500] transition-colors leading-tight line-clamp-2">
                  {deal.name}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xl font-bold text-[#00C875]">{deal.price}</div>
                    <div className="text-xs text-white/35 mt-0.5">on {deal.platform}</div>
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
            className="block rounded-2xl border border-[#FF6B35]/25 bg-gradient-to-r from-[#FF6B35]/12 via-[#FF8C00]/8 to-transparent p-6 hover:border-[#FF6B35]/50 transition-all group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">🎫</div>
                <div>
                  <div className="font-extrabold text-base mb-1">Today&apos;s Best Coupons</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Swiggy", "Zomato", "Blinkit", "Uber", "Ola"].map((p) => (
                      <span key={p} className="text-[10px] text-white/40 border border-white/10 rounded-full px-2 py-0.5">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="shrink-0 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20">
                View All →
              </div>
            </div>
          </a>
        </section>

        {/* HOW IT WORKS */}
        <section className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-6 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B35]/3 rounded-full blur-3xl" />
          <h2 className="text-lg font-bold mb-6 text-center">How SabSasta Works</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { emoji: "🔍", title: "Search Anything", desc: "Type a product, food, or Uber vs Ola. We detect the category automatically." },
              { emoji: "⚡", title: "Compare Instantly", desc: "See real prices from all platforms side by side. Find cheapest in seconds." },
              { emoji: "💰", title: "Buy and Save", desc: "Click the cheapest option. Watch YouTube reviews before buying." },
            ].map((step, i) => (
              <div key={step.title} className="rounded-xl bg-white/3 border border-white/5 p-5 text-center relative">
                <div className="absolute top-3 right-3 text-xs text-white/15 font-bold">0{i + 1}</div>
                <div className="text-3xl mb-3">{step.emoji}</div>
                <p className="font-bold text-sm mb-2">{step.title}</p>
                <p className="text-xs text-white/35 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SHARE */}
        <section className="text-center rounded-2xl border border-white/7 bg-gradient-to-b from-white/3 to-transparent p-8">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-extrabold text-lg mb-2">Share SabSasta with Friends</h3>
          <p className="text-white/35 text-sm mb-5">Help them save money too. Every Indian deserves the best price.</p>
          <a
            href="https://wa.me/?text=Check%20out%20SabSasta%20%E2%80%94%20India%27s%20price%20comparison%20app!%20Compare%20food%2C%20rides%2C%20products%20and%20get%20the%20best%20deals%20%F0%9F%94%A5%0A%0Ahttps%3A%2F%2Fsabsasta-rho.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-green-500/20"
          >
            📲 Share on WhatsApp
          </a>
        </section>

      </div>
    </main>
  )
}