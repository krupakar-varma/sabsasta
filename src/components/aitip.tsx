import { AIRecommendation } from "@/types"

interface Props {
  recommendation: AIRecommendation
}

export default function AITip({ recommendation }: Props) {
  const isBuy = recommendation.action === "BUY NOW"

  return (
    <div className="rounded-xl border border-[#FF6B35]/20 bg-[#FF6B35]/5 p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🤖</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`rounded-lg px-3 py-1 text-xs font-bold ${
                isBuy
                  ? "bg-[#00C875]/15 text-[#00C875]"
                  : "bg-yellow-500/15 text-yellow-400"
              }`}
            >
              {recommendation.action}
            </span>
            <span className="text-xs text-white/40">
              {recommendation.confidence}% confident
            </span>
          </div>
          <p className="text-sm text-white/70">{recommendation.reason}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
            <span>
              Trend:{" "}
              {recommendation.priceTrend === "FALLING"
                ? "📉 Falling"
                : recommendation.priceTrend === "RISING"
                ? "📈 Rising"
                : "➡️ Stable"}
            </span>
            <span>
              {recommendation.belowAverage
                ? "✅ Below average"
                : "⚠️ Above average"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}