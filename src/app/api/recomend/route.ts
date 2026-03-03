/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, results } = body

    if (!results || results.length === 0) {
      return NextResponse.json({ success: false, error: "No products to analyze" })
    }

    const recommendation = await getAIRecommendation(query, results)
    return NextResponse.json({ success: true, recommendation })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "AI recommendation failed",
    })
  }
}

async function getAIRecommendation(query: string, products: any[]) {
  const productList = products
    .map((p, i) => `${i + 1}. ${p.name} - ${p.formattedPrice} on ${p.platform} (Rating: ${p.rating})`)
    .join("\n")

  const cheapest = products.reduce((a, b) => a.price < b.price ? a : b)
  const mostExpensive = products.reduce((a, b) => a.price > b.price ? a : b)
  const priceDiff = mostExpensive.price - cheapest.price

  const prompt = `You are SabSasta AI — India's smartest shopping assistant. A user searched for "${query}" and here are the results:

${productList}

Price range: ${cheapest.formattedPrice} to ${mostExpensive.formattedPrice} (difference: Rs.${priceDiff})

Give a short, helpful recommendation in 3 parts:
1. VERDICT: Which one to buy (be specific — mention the exact product name and price)
2. REASON: Why in one sentence (focus on value for money)
3. TIMING: Should they buy now or wait? (For electronics, prices usually drop after 3-6 months. For daily items, buy now)

Keep it conversational, like a smart friend advising them. Use Indian context. Maximum 4 sentences total. Do not use bullet points or markdown. Just plain text.`

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const data = await response.json()
  const text = data?.content?.[0]?.text || "Could not generate recommendation right now."

  return {
    text,
    cheapest: {
      name: cheapest.name,
      price: cheapest.formattedPrice,
      platform: cheapest.platform,
      link: cheapest.link,
    },
    priceDiff,
    totalProducts: products.length,
  }
}