"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Nav from "../components/Nav"  

const CATEGORIES = [
  { emoji: "🛍️", name: "Products", desc: "Amazon · Flipkart · Meesho", href: "/compare", count: "4 platforms" },
  { emoji: "🍕", name: "Food", desc: "Swiggy · Zomato · Magicpin", href: "/food", count: "3 platforms" },
  { emoji: "🚗", name: "Rides", desc: "Uber · Ola · Rapido", href: "/rides", count: "3 platforms" },
  { emoji: "✈️", name: "Flights", desc: "MMT · EaseMyTrip · GoIbibo", href: "/flights", count: "4 platforms" },
  { emoji: "🛒", name: "Grocery", desc: "Blinkit · Zepto · BigBasket", href: "/grocery", count: "4 platforms" },
  { emoji: "🚌", name: "Bus", desc: "RedBus · AbhiBus · KSRTC", href: "/bus", count: "3 platforms" },
  { emoji: "🚂", name: "Train", desc: "IRCTC + operators", href: "/train", count: "Coming soon" },
  { emoji: "🏨", name: "Hotels", desc: "OYO · Booking.com · MMT", href: "/hotels", count: "Coming soon" },
  { emoji: "💊", name: "Medicine", desc: "1mg · PharmEasy · Netmeds", href: "/medicine", count: "Coming soon" },
]

const TRENDING = [
  { category: "📱 Products", name: "Samsung Galaxy M35 5G", price: "₹17,999", platform: "Flipkart", save: "Save ₹4,000", href: "/compare?q=samsung+galaxy+m35" },
  { category: "🍕 Food", name: "Pepperoni Pizza (Medium)", price: "₹199", platform: "Zomato", save: "Save ₹50", href: "/food?q=pizza&city=bengaluru" },
  { category: "🚗 Rides", name: "Koramangala → Airport", price: "₹89", platform: "Rapido Bike", save: "Save ₹431 vs Uber", href: "/rides?from=koramangala&to=airport" },
  { category: "✈️ Flights", name: "DEL → BOM · Mar 15", price: "₹3,299", platform: "EaseMyTrip", save: "Save ₹700", href: "/flights?from=DEL&to=BOM" },
  { category: "🛒 Grocery", name: "Weekly Basket (5 items)", price: "₹376", platform: "BigBasket", save: "Save ₹83", href: "/grocery" },
  { category: "📱 Products", name: "iQOO Z9 (8GB/128GB)", price: "₹18,999", platform: "Flipkart", save: "Save ₹4,000", href: "/compare?q=iqoo+z9" },
]

function detectCategory(query: string): string {
  const q = query.toLowerCase()
  if (q.includes("uber") || q.includes("ola") || q.includes("rapido") || q.includes("ride") || q.includes("cab") || q.includes("auto")) return "/rides"
  if (q.includes("flight") || q.includes("fly") || q.match(/[a-z]{3}\s*[-→]\s*[a-z]{3}/i)) return "/flights"
  if (q.includes("swiggy") || q.includes("zomato") || q.includes("food") || q.includes("pizza") || q.includes("biryani") || q.includes("dosa")) return "/food"
  if (q.includes("blinkit") || q.includes("zepto") || q.includes("grocery") || q.includes("milk") || q.includes("vegetable")) return "/grocery"
  return "/compare"
}

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [detectedCategory, setDetectedCategory] = useState("")

  const handleQueryChange = (val: string) => {
    setQuery(val)
    if (val.length > 2) {
      const cat = detectCategory(val)
      setDetectedCategory(cat)
    } else {
      setDetectedCategory("")
    }
  }

  const handleSearch = () => {
    if (!query.trim()) return
    const category = detectCategory(query)
    if (category === "/compare") {
      router.push(`/compare?q=${encodeURIComponent(query.trim())}`)
    } else if (category === "/food") {
      router.push(`/food?q=${encodeURIComponent(query.trim())}&city=bengaluru`)
    } else if (category === "/rides") {
      router.push(`/rides`)
    } else if (category === "/flights") {
      router.push(`/flights`)
    } else {
      router.push(category)
    }
  }

  const categoryLabels: Record<string, string> = {
    "/compare": "🛍️ Products",
    "/food": "🍕 Food",
    "/rides": "🚗 Rides",
    "/flights": "✈️ Flights",
    "/grocery": "🛒 Grocery",
  }

  return (
    <main className="min-h-screen bg-[#07070F] text-white">
      <Nav />

      <div className="mx-auto max-w-6xl px-4 pb-20">

        {/* HERO */}
        <section className="pt-16 pb-12 text-center">
          <div className="inline-block rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/10 px-4 py-1.5 text-xs font-bold text-[#FF9500] tracking-widest uppercase mb-6">
            🇮🇳 India का #1 Compare Everything App
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4 sm:text-6xl">
            Sab Kuch{" "}
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF9500] bg-clip-text text-transparent">
              Sabse Sasta
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-white/45 text-base leading-relaxed mb-10">
            Compare products, food, rides, flights, grocery — all in one place.
            Real prices. AI-powered. Always free.
          </p>

          {/* Search */}
          <div className="mx-auto max-w-2xl">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">🔍</span>
                <input
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/30 transition-all"
                  placeholder="Search Samsung phone, Uber vs Ola, Swiggy pizza, Delhi flight..."
                />
                {detectedCategory && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF9500]">
                    {categoryLabels[detectedCategory]}
                  </div>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-6 py-4 text-sm font-bold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Compare →
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-white/35">
              <span>✓ 12+ platforms</span>
              <span>✓ 9 categories</span>
              <span>✓ Real-time prices</span>
              <span>✓ Always free</span>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5">What to Compare?</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-9">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                className="group rounded-2xl border border-white/7 bg-white/3 p-4 text-center hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/5 transition-all"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="text-xs font-bold text-white group-hover:text-[#FF9500] transition-colors">{cat.name}</div>
                <div className="text-[9px] text-white/30 mt-0.5">{cat.count}</div>
              </a>
            ))}
          </div>
        </section>

        {/* AI AGENT BANNER */}
        <section className="mb-12">
          <div className="rounded-2xl border border-[#FF6B35]/20 bg-gradient-to-r from-[#FF6B35]/8 to-[#FF9500]/8 p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🤖</div>
              <div>
                <div className="font-bold text-base mb-1">SabSasta AI Deal Butler</div>
                <div className="text-sm text-white/50">Set price alerts · Get WhatsApp notifications · 24/7 deal hunting</div>
              </div>
            </div>
            <button className="shrink-0 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity">
              Set Up Alerts →
            </button>
          </div>
        </section>

        {/* TRENDING DEALS */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">🔥 Trending Deals</h2>
            <span className="text-sm text-white/35">All categories</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRENDING.map((deal) => (
              <a
                key={deal.name}
                href={deal.href}
                className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-4 hover:border-[#FF6B35]/30 transition-all group"
              >
                <div className="text-[10px] font-bold text-[#FF9500] mb-2 tracking-wider uppercase">{deal.category}</div>
                <div className="font-semibold text-sm mb-3 group-hover:text-[#FF9500] transition-colors leading-tight">{deal.name}</div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-[#00C875]">{deal.price}</div>
                    <div className="text-xs text-white/40 mt-0.5">on {deal.platform}</div>
                  </div>
                  <div className="rounded-lg bg-[#00C875]/10 px-3 py-1.5 text-xs font-bold text-[#00C875]">
                    {deal.save}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="rounded-2xl border border-white/7 bg-[#0D0D1B] p-8">
          <h2 className="text-xl font-bold mb-6 text-center">How SabSasta Works</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { n: "1", title: "Search Anything", desc: "Type a product, food item, destination, or say 'Uber vs Ola'. We detect the category automatically." },
              { n: "2", title: "Compare Instantly", desc: "See real prices from all platforms side by side. SabSasta Score tells you the best option immediately." },
              { n: "3", title: "Buy & Save", desc: "Click to buy on the cheapest platform. Set an alert to get WhatsApp notification when price drops further." },
            ].map((step) => (
              <div key={step.n} className="rounded-xl bg-white/3 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF9500] text-sm font-bold text-white">
                    {step.n}
                  </div>
                  <p className="font-bold text-sm">{step.title}</p>
                </div>
                <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}