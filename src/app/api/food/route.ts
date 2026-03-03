/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

// Real coordinates for major Indian cities
const CITY_COORDS: Record<string, { lat: string; lng: string; name: string }> = {
  bengaluru: { lat: "12.9352", lng: "77.6245", name: "Bengaluru" },
  bangalore: { lat: "12.9352", lng: "77.6245", name: "Bengaluru" },
  mumbai: { lat: "19.0760", lng: "72.8777", name: "Mumbai" },
  delhi: { lat: "28.6139", lng: "77.2090", name: "Delhi" },
  hyderabad: { lat: "17.3850", lng: "78.4867", name: "Hyderabad" },
  chennai: { lat: "13.0827", lng: "80.2707", name: "Chennai" },
  pune: { lat: "18.5204", lng: "73.8567", name: "Pune" },
  kolkata: { lat: "22.5726", lng: "88.3639", name: "Kolkata" },
  ahmedabad: { lat: "23.0225", lng: "72.5714", name: "Ahmedabad" },
  jaipur: { lat: "26.9124", lng: "75.7873", name: "Jaipur" },
  surat: { lat: "21.1702", lng: "72.8311", name: "Surat" },
  lucknow: { lat: "26.8467", lng: "80.9462", name: "Lucknow" },
  kochi: { lat: "9.9312", lng: "76.2673", name: "Kochi" },
  chandigarh: { lat: "30.7333", lng: "76.7794", name: "Chandigarh" },
  goa: { lat: "15.2993", lng: "74.1240", name: "Goa" },
  indore: { lat: "22.7196", lng: "75.8577", name: "Indore" },
  bhopal: { lat: "23.2599", lng: "77.4126", name: "Bhopal" },
  nagpur: { lat: "21.1458", lng: "79.0882", name: "Nagpur" },
  visakhapatnam: { lat: "17.6868", lng: "83.2185", name: "Visakhapatnam" },
  coimbatore: { lat: "11.0168", lng: "76.9558", name: "Coimbatore" },
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "biryani"
  const cityParam = (request.nextUrl.searchParams.get("city") || "bengaluru").toLowerCase()

  // Use provided lat/lng or look up from city name
  let lat = request.nextUrl.searchParams.get("lat")
  let lng = request.nextUrl.searchParams.get("lng")

  if (!lat || !lng) {
    const coords = CITY_COORDS[cityParam]
    if (coords) {
      lat = coords.lat
      lng = coords.lng
    } else {
      lat = "12.9352"
      lng = "77.6245"
    }
  }

  try {
    const results = await fetchSwiggyFood(query, lat, lng)
    return NextResponse.json({
      success: true,
      city: CITY_COORDS[cityParam]?.name || cityParam,
      results,
    })
  } catch (error: any) {
    console.error("Swiggy error:", error.message)
    return NextResponse.json({
      success: false,
      error: "Could not fetch food prices right now",
      results: [],
    })
  }
}

async function fetchSwiggyFood(query: string, lat: string, lng: string) {
  const url = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${encodeURIComponent(query)}&trackingId=undefined&submitAction=SUGGESTION`

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Accept-Language": "en-IN,en;q=0.9",
      "Referer": "https://www.swiggy.com/",
      "Origin": "https://www.swiggy.com",
      "__fetch_req__": "true",
    },
    timeout: 10000,
  })

  const cards = response.data?.data?.cards || []
  const results: any[] = []

  for (const card of cards) {
    const dishCards = card?.groupedCard?.cardGroupMap?.DISH?.cards || []
    for (const dishCard of dishCards) {
      const dish = dishCard?.card?.card
      if (!dish || dish["@type"]?.includes("SearchFilterSort")) continue
      if (!dish["@type"]?.includes("Dish") && !dish?.info) continue

      const info = dish?.info || dish
      if (!info?.name) continue

      results.push({
        id: info.id || Math.random().toString(),
        name: info.name,
        restaurantName: info.restaurant?.info?.name || "",
        price: info.price ? Math.round(info.price / 100) : null,
        finalPrice: info.finalPrice ? Math.round(info.finalPrice / 100) : null,
        rating: info.ratings?.aggregatedRating?.rating || "N/A",
        image: info.imageId
          ? `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/${info.imageId}`
          : "",
        platform: "Swiggy",
        link: `https://www.swiggy.com`,
        deliveryTime: info.restaurant?.info?.sla?.deliveryTime
          ? `${info.restaurant.info.sla.deliveryTime} min`
          : "30-40 min",
        isVeg: info.isVeg === 1,
      })

      if (results.length >= 8) break
    }

    const restCards = card?.groupedCard?.cardGroupMap?.RESTAURANT?.cards || []
    for (const restCard of restCards) {
      const r = restCard?.card?.card?.info
      if (!r?.name) continue

      results.push({
        id: r.id || Math.random().toString(),
        name: r.name,
        restaurantName: r.name,
        price: null,
        finalPrice: null,
        rating: r.avgRating || "N/A",
        image: r.cloudinaryImageId
          ? `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200/${r.cloudinaryImageId}`
          : "",
        platform: "Swiggy",
        link: `https://www.swiggy.com/restaurants/${r.name?.toLowerCase().replace(/\s+/g, "-")}-${r.id}`,
        deliveryTime: r.sla?.deliveryTime ? `${r.sla.deliveryTime} min` : "30-40 min",
        cuisine: Array.isArray(r.cuisines) ? r.cuisines.join(", ") : "",
        offer: r.aggregatedDiscountInfoV3?.header || "",
        isVeg: false,
      })

      if (results.length >= 8) break
    }

    if (results.length >= 8) break
  }

  return results
}