/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "chips"
  const lat = request.nextUrl.searchParams.get("lat") || "12.9352"
  const lng = request.nextUrl.searchParams.get("lng") || "77.6245"

  try {
    const results = await fetchBlinkit(query, lat, lng)
    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      results: [],
    })
  }
}

async function fetchBlinkit(query: string, lat: string, lng: string) {
  const url = `https://blinkit.com/v6/search/products?q=${encodeURIComponent(query)}&start=0&size=10`

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-IN,en;q=0.9",
      "Referer": "https://blinkit.com/",
      "Origin": "https://blinkit.com",
      "lat": lat,
      "lon": lng,
      "app_client": "consumer",
      "auth_key": "c8applied",
      "web-version": "1000232",
    },
    timeout: 10000,
  })

  const data = response.data
  console.log("Blinkit response keys:", Object.keys(data || {}))
  console.log("Blinkit raw:", JSON.stringify(data).slice(0, 500))

  const products = data?.objects?.products || data?.products || data?.data?.products || []

  return products.slice(0, 8).map((p: any) => ({
    id: p.id || Math.random().toString(),
    name: p.name || p.title,
    price: p.price || p.mrp,
    discountedPrice: p.discounted_price || p.sale_price,
    image: p.image || p.thumbnail,
    unit: p.unit || p.weight,
    rating: p.rating || "N/A",
    platform: "Blinkit",
    link: `https://blinkit.com/prn/${p.slug || p.id}`,
  }))
}