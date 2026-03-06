/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

const RATES: Record<string, any> = {
  bengaluru: {
    Rapido: {
      Bike:  { base: 15, perKm: 7,  perMin: 0.5,  minFare: 25,  surge: 1.0, rangePercent: 8,  category: "bike"    },
      Auto:  { base: 20, perKm: 12, perMin: 0.75, minFare: 40,  surge: 1.0, rangePercent: 10, category: "auto"    },
    },
    Ola: {
      Auto:  { base: 25, perKm: 13, perMin: 1,    minFare: 50,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Mini:  { base: 40, perKm: 14, perMin: 1.25, minFare: 80,  surge: 1.0, rangePercent: 12, category: "cab"     },
      Prime: { base: 50, perKm: 18, perMin: 1.5,  minFare: 100, surge: 1.0, rangePercent: 15, category: "premium" },
    },
    Uber: {
      Moto:    { base: 15, perKm: 8,  perMin: 0.75, minFare: 30,  surge: 1.2, rangePercent: 10, category: "bike"    },
      Auto:    { base: 25, perKm: 14, perMin: 1,    minFare: 50,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Go:      { base: 45, perKm: 16, perMin: 1.5,  minFare: 90,  surge: 1.3, rangePercent: 15, category: "cab"     },
      Premier: { base: 60, perKm: 22, perMin: 2,    minFare: 120, surge: 1.0, rangePercent: 18, category: "premium" },
    },
    InDrive: {
      Sedan: { base: 35, perKm: 13, perMin: 1, minFare: 70, surge: 1.0, rangePercent: 20, category: "cab" },
      SUV:   { base: 55, perKm: 18, perMin: 1.5, minFare: 110, surge: 1.0, rangePercent: 20, category: "premium" },
    },
    BluSmart: {
      Electric: { base: 50, perKm: 15, perMin: 1.25, minFare: 90, surge: 1.0, rangePercent: 5, category: "ev" },
    },
    Metro: {
      "Namma Metro": { base: 10, perKm: 3.5, perMin: 0, minFare: 10, surge: 1.0, rangePercent: 0, category: "metro" },
    },
  },
  mumbai: {
    Rapido: {
      Bike:  { base: 15, perKm: 6,  perMin: 0.5,  minFare: 25,  surge: 1.0, rangePercent: 8,  category: "bike" },
      Auto:  { base: 20, perKm: 11, perMin: 0.75, minFare: 40,  surge: 1.0, rangePercent: 10, category: "auto" },
    },
    Ola: {
      Auto:  { base: 22, perKm: 12, perMin: 1,    minFare: 45,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Mini:  { base: 38, perKm: 13, perMin: 1.25, minFare: 75,  surge: 1.0, rangePercent: 12, category: "cab"     },
      Prime: { base: 50, perKm: 17, perMin: 1.5,  minFare: 100, surge: 1.0, rangePercent: 15, category: "premium" },
    },
    Uber: {
      Moto:    { base: 15, perKm: 7,  perMin: 0.75, minFare: 28,  surge: 1.1, rangePercent: 10, category: "bike"    },
      Auto:    { base: 22, perKm: 13, perMin: 1,    minFare: 45,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Go:      { base: 42, perKm: 15, perMin: 1.5,  minFare: 85,  surge: 1.2, rangePercent: 15, category: "cab"     },
      Premier: { base: 58, perKm: 21, perMin: 2,    minFare: 115, surge: 1.0, rangePercent: 18, category: "premium" },
    },
    InDrive: {
      Sedan: { base: 32, perKm: 12, perMin: 1, minFare: 65, surge: 1.0, rangePercent: 20, category: "cab" },
    },
    Metro: {
      "Mumbai Metro": { base: 10, perKm: 2.5, perMin: 0, minFare: 10, surge: 1.0, rangePercent: 0, category: "metro" },
    },
  },
  delhi: {
    Rapido: {
      Bike:  { base: 12, perKm: 6,  perMin: 0.5,  minFare: 22,  surge: 1.0, rangePercent: 8,  category: "bike" },
      Auto:  { base: 18, perKm: 11, perMin: 0.75, minFare: 35,  surge: 1.0, rangePercent: 10, category: "auto" },
    },
    Ola: {
      Auto:  { base: 20, perKm: 12, perMin: 1,    minFare: 40,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Mini:  { base: 35, perKm: 13, perMin: 1.25, minFare: 70,  surge: 1.0, rangePercent: 12, category: "cab"     },
      Prime: { base: 48, perKm: 17, perMin: 1.5,  minFare: 95,  surge: 1.0, rangePercent: 15, category: "premium" },
    },
    Uber: {
      Moto:    { base: 12, perKm: 7,  perMin: 0.75, minFare: 25,  surge: 1.1, rangePercent: 10, category: "bike"    },
      Auto:    { base: 20, perKm: 12, perMin: 1,    minFare: 40,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Go:      { base: 40, perKm: 14, perMin: 1.5,  minFare: 80,  surge: 1.2, rangePercent: 15, category: "cab"     },
      Premier: { base: 55, perKm: 20, perMin: 2,    minFare: 110, surge: 1.0, rangePercent: 18, category: "premium" },
    },
    InDrive: {
      Sedan: { base: 30, perKm: 11, perMin: 1, minFare: 60, surge: 1.0, rangePercent: 20, category: "cab" },
      SUV:   { base: 50, perKm: 16, perMin: 1.5, minFare: 100, surge: 1.0, rangePercent: 20, category: "premium" },
    },
    BluSmart: {
      Electric: { base: 45, perKm: 14, perMin: 1.2, minFare: 85, surge: 1.0, rangePercent: 5, category: "ev" },
    },
    Metro: {
      "Delhi Metro": { base: 10, perKm: 2.5, perMin: 0, minFare: 10, surge: 1.0, rangePercent: 0, category: "metro" },
    },
  },
  hyderabad: {
    Rapido: {
      Bike:  { base: 12, perKm: 6,  perMin: 0.5,  minFare: 22,  surge: 1.0, rangePercent: 8,  category: "bike" },
      Auto:  { base: 18, perKm: 11, perMin: 0.75, minFare: 35,  surge: 1.0, rangePercent: 10, category: "auto" },
    },
    Ola: {
      Auto:  { base: 20, perKm: 11, perMin: 1,    minFare: 40,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Mini:  { base: 35, perKm: 13, perMin: 1.25, minFare: 70,  surge: 1.0, rangePercent: 12, category: "cab"     },
      Prime: { base: 45, perKm: 16, perMin: 1.5,  minFare: 90,  surge: 1.0, rangePercent: 15, category: "premium" },
    },
    Uber: {
      Moto:    { base: 12, perKm: 7,  perMin: 0.75, minFare: 25,  surge: 1.1, rangePercent: 10, category: "bike"    },
      Auto:    { base: 20, perKm: 11, perMin: 1,    minFare: 40,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Go:      { base: 38, perKm: 14, perMin: 1.5,  minFare: 78,  surge: 1.2, rangePercent: 15, category: "cab"     },
      Premier: { base: 52, perKm: 19, perMin: 2,    minFare: 105, surge: 1.0, rangePercent: 18, category: "premium" },
    },
    InDrive: {
      Sedan: { base: 30, perKm: 11, perMin: 1, minFare: 60, surge: 1.0, rangePercent: 20, category: "cab" },
    },
    Metro: {
      "Hyderabad Metro": { base: 10, perKm: 3, perMin: 0, minFare: 10, surge: 1.0, rangePercent: 0, category: "metro" },
    },
  },
  chennai: {
    Rapido: {
      Bike:  { base: 12, perKm: 6,  perMin: 0.5,  minFare: 22,  surge: 1.0, rangePercent: 8,  category: "bike" },
      Auto:  { base: 18, perKm: 11, perMin: 0.75, minFare: 35,  surge: 1.0, rangePercent: 10, category: "auto" },
    },
    Ola: {
      Auto:  { base: 20, perKm: 11, perMin: 1,    minFare: 40,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Mini:  { base: 35, perKm: 13, perMin: 1.25, minFare: 70,  surge: 1.0, rangePercent: 12, category: "cab"     },
      Prime: { base: 45, perKm: 16, perMin: 1.5,  minFare: 90,  surge: 1.0, rangePercent: 15, category: "premium" },
    },
    Uber: {
      Moto:    { base: 12, perKm: 7,  perMin: 0.75, minFare: 25,  surge: 1.1, rangePercent: 10, category: "bike"    },
      Auto:    { base: 20, perKm: 11, perMin: 1,    minFare: 40,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Go:      { base: 38, perKm: 14, perMin: 1.5,  minFare: 78,  surge: 1.2, rangePercent: 15, category: "cab"     },
      Premier: { base: 52, perKm: 19, perMin: 2,    minFare: 105, surge: 1.0, rangePercent: 18, category: "premium" },
    },
    InDrive: {
      Sedan: { base: 30, perKm: 11, perMin: 1, minFare: 60, surge: 1.0, rangePercent: 20, category: "cab" },
    },
    Metro: {
      "Chennai Metro": { base: 10, perKm: 3, perMin: 0, minFare: 10, surge: 1.0, rangePercent: 0, category: "metro" },
    },
  },
  pune: {
    Rapido: {
      Bike:  { base: 12, perKm: 6,  perMin: 0.5,  minFare: 20,  surge: 1.0, rangePercent: 8,  category: "bike" },
      Auto:  { base: 18, perKm: 10, perMin: 0.75, minFare: 35,  surge: 1.0, rangePercent: 10, category: "auto" },
    },
    Ola: {
      Auto:  { base: 18, perKm: 11, perMin: 1,    minFare: 38,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Mini:  { base: 32, perKm: 12, perMin: 1.25, minFare: 65,  surge: 1.0, rangePercent: 12, category: "cab"     },
      Prime: { base: 42, perKm: 15, perMin: 1.5,  minFare: 85,  surge: 1.0, rangePercent: 15, category: "premium" },
    },
    Uber: {
      Moto:    { base: 12, perKm: 6,  perMin: 0.75, minFare: 22,  surge: 1.1, rangePercent: 10, category: "bike"    },
      Auto:    { base: 18, perKm: 11, perMin: 1,    minFare: 38,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Go:      { base: 35, perKm: 13, perMin: 1.5,  minFare: 72,  surge: 1.2, rangePercent: 15, category: "cab"     },
      Premier: { base: 48, perKm: 18, perMin: 2,    minFare: 98,  surge: 1.0, rangePercent: 18, category: "premium" },
    },
    InDrive: {
      Sedan: { base: 28, perKm: 10, perMin: 1, minFare: 55, surge: 1.0, rangePercent: 20, category: "cab" },
    },
  },
  kolkata: {
    Rapido: {
      Bike:  { base: 10, perKm: 5,  perMin: 0.5,  minFare: 18,  surge: 1.0, rangePercent: 8,  category: "bike" },
      Auto:  { base: 15, perKm: 9,  perMin: 0.75, minFare: 30,  surge: 1.0, rangePercent: 10, category: "auto" },
    },
    Ola: {
      Auto:  { base: 18, perKm: 10, perMin: 1,    minFare: 35,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Mini:  { base: 30, perKm: 11, perMin: 1.25, minFare: 60,  surge: 1.0, rangePercent: 12, category: "cab"     },
      Prime: { base: 40, perKm: 14, perMin: 1.5,  minFare: 80,  surge: 1.0, rangePercent: 15, category: "premium" },
    },
    Uber: {
      Moto:    { base: 10, perKm: 5,  perMin: 0.75, minFare: 20,  surge: 1.1, rangePercent: 10, category: "bike"    },
      Auto:    { base: 18, perKm: 10, perMin: 1,    minFare: 35,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Go:      { base: 32, perKm: 12, perMin: 1.5,  minFare: 68,  surge: 1.2, rangePercent: 15, category: "cab"     },
      Premier: { base: 45, perKm: 17, perMin: 2,    minFare: 92,  surge: 1.0, rangePercent: 18, category: "premium" },
    },
    Metro: {
      "Kolkata Metro": { base: 5, perKm: 2, perMin: 0, minFare: 5, surge: 1.0, rangePercent: 0, category: "metro" },
    },
  },
  ahmedabad: {
    Rapido: {
      Bike:  { base: 10, perKm: 5,  perMin: 0.5,  minFare: 18,  surge: 1.0, rangePercent: 8,  category: "bike" },
      Auto:  { base: 15, perKm: 9,  perMin: 0.75, minFare: 30,  surge: 1.0, rangePercent: 10, category: "auto" },
    },
    Ola: {
      Auto:  { base: 18, perKm: 10, perMin: 1,    minFare: 35,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Mini:  { base: 30, perKm: 11, perMin: 1.25, minFare: 60,  surge: 1.0, rangePercent: 12, category: "cab"     },
      Prime: { base: 40, perKm: 14, perMin: 1.5,  minFare: 80,  surge: 1.0, rangePercent: 15, category: "premium" },
    },
    Uber: {
      Moto:    { base: 10, perKm: 5,  perMin: 0.75, minFare: 20,  surge: 1.1, rangePercent: 10, category: "bike"    },
      Auto:    { base: 18, perKm: 10, perMin: 1,    minFare: 35,  surge: 1.0, rangePercent: 10, category: "auto"    },
      Go:      { base: 32, perKm: 12, perMin: 1.5,  minFare: 68,  surge: 1.2, rangePercent: 15, category: "cab"     },
      Premier: { base: 45, perKm: 17, perMin: 2,    minFare: 92,  surge: 1.0, rangePercent: 18, category: "premium" },
    },
    Metro: {
      "Ahmedabad Metro": { base: 5, perKm: 2.5, perMin: 0, minFare: 5, surge: 1.0, rangePercent: 0, category: "metro" },
    },
  },
}

const PLATFORM_COLORS: Record<string, string> = {
  Uber: "#000000", Ola: "#EAB308", Rapido: "#22C55E",
  InDrive: "#3B82F6", BluSmart: "#06B6D4", Metro: "#A855F7",
}

const PLATFORM_EMOJIS: Record<string, string> = {
  Uber: "🚗", Ola: "🟡", Rapido: "🟢",
  InDrive: "🔵", BluSmart: "⚡", Metro: "🚇",
}

const BOOK_LINKS: Record<string, string> = {
  Uber: "https://m.uber.com/ul/",
  Ola: "https://www.olacabs.com",
  Rapido: "https://rapido.bike",
  InDrive: "https://indrive.com",
  BluSmart: "https://blu-smart.com",
  Metro: "https://www.nammametro.in",
}

function isRushHour(): boolean {
  const hour = new Date().getHours()
  return (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)
}

function calculatePrice(distanceKm: number, timeMin: number, rate: any, rush: boolean) {
  const surge = rush ? rate.surge : 1.0
  const raw = rate.base + distanceKm * rate.perKm + timeMin * rate.perMin
  const price = Math.max(Math.round(raw * surge), rate.minFare)
  const range = rate.rangePercent / 100
  const priceMin = Math.round(price * (1 - range * 0.5))
  const priceMax = Math.round(price * (1 + range * 0.5))
  const costPerKm = distanceKm > 0 ? Math.round(price / distanceKm) : rate.perKm
  return { price, priceMin, priceMax, costPerKm }
}

function buildDeepLink(platform: string, vehicleType: string, from: string, to: string): string {
  const ef = encodeURIComponent(from)
  const et = encodeURIComponent(to)
  if (platform === "Uber") return `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${ef}&dropoff[formatted_address]=${et}&link_text=View+on+Uber&client_id=sabsasta`
  if (platform === "Ola") return `https://olawebsite.page.link/?link=https://www.olacabs.com/?pickup%3D${ef}%26drop%3D${et}&apn=com.ani.ola&isi=539179831&ibi=com.oligosoft.ola`
  if (platform === "Rapido") {
    const rideType = vehicleType === "Bike" ? "bike" : "auto"
    return `https://rapido.bike/book?source=${ef}&destination=${et}&rideType=${rideType}`
  }
  if (platform === "InDrive") return `https://indrive.onelink.me/help?af_dp=indrive%3A%2F%2Forder%3Ffrom%3D${ef}%26to%3D${et}&af_web_dp=https%3A%2F%2Findrive.com`
  if (platform === "BluSmart") return `https://blu-smart.com/book?pickup=${ef}&drop=${et}`
  return BOOK_LINKS[platform] || "#"
}

async function getDistance(origin: string, destination: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return null
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}&units=metric`
    const res = await axios.get(url, { timeout: 8000 })
    const data = res.data
    if (data.status !== "OK") return null
    const element = data.rows?.[0]?.elements?.[0]
    if (!element || element.status !== "OK") return null
    return {
      distanceKm: element.distance.value / 1000,
      timeMin: Math.round(element.duration.value / 60),
      fromName: data.origin_addresses?.[0] || origin,
      toName: data.destination_addresses?.[0] || destination,
    }
  } catch { return null }
}

export async function GET(request: NextRequest) {
  const city = (request.nextUrl.searchParams.get("city") || "bengaluru").toLowerCase()
  const from = request.nextUrl.searchParams.get("from") || ""
  const to = request.nextUrl.searchParams.get("to") || ""
  const manualDistance = request.nextUrl.searchParams.get("distance")

  const cityRates = RATES[city]
  if (!cityRates) return NextResponse.json({ success: false, error: `City ${city} not supported`, results: [] })

  let distanceKm = parseFloat(manualDistance || "8")
  let timeMin = Math.round((distanceKm / 20) * 60)
  let fromName = from
  let toName = to

  if (from && to) {
    const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1)
    const distanceData = await getDistance(`${from}, ${cityDisplay}, India`, `${to}, ${cityDisplay}, India`)
    if (distanceData) {
      distanceKm = distanceData.distanceKm
      timeMin = distanceData.timeMin
      fromName = distanceData.fromName
      toName = distanceData.toName
    }
  }

  const rush = isRushHour()
  const results: any[] = []

  for (const [platform, vehicles] of Object.entries(cityRates)) {
    for (const [vehicleType, rate] of Object.entries(vehicles as any)) {
      const { price, priceMin, priceMax, costPerKm } = calculatePrice(distanceKm, timeMin, rate as any, rush)
      const hasSurge = rush && (rate as any).surge > 1.0
      const surgeMultiplier = hasSurge ? (rate as any).surge : 1.0
      const basePrice = hasSurge ? Math.round(price / surgeMultiplier) : price

      results.push({
        id: `${platform}-${vehicleType}-${city}`,
        platform,
        type: `${platform} ${vehicleType}`,
        emoji: PLATFORM_EMOJIS[platform] || "🚗",
        category: (rate as any).category || "cab",
        price, priceMin, priceMax,
        priceRange: priceMin === priceMax ? `Rs.${price}` : `Rs.${priceMin}–${priceMax}`,
        basePrice, hasSurge, surgeMultiplier,
        costPerKm,
        eta: Math.floor(Math.random() * 6) + 3,
        distanceKm: Math.round(distanceKm * 10) / 10,
        timeMin,
        platformColor: PLATFORM_COLORS[platform] || "#ffffff",
        bookLink: buildDeepLink(platform, vehicleType, fromName || from, toName || to),
      })
    }
  }

  results.sort((a, b) => a.price - b.price)
  if (results.length > 0) results[0].isCheapest = true

  const maxPrice = results[results.length - 1]?.price || 0
  results.forEach(r => { r.savingsVsMax = maxPrice - r.price })

  return NextResponse.json({
    success: true, city,
    from: fromName, to: toName,
    distanceKm: Math.round(distanceKm * 10) / 10,
    timeMin, isRushHour: rush, results,
  })
}