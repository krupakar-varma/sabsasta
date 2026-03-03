import { SabSastaScore as ScoreType } from "@/types"

interface Props {
  score: ScoreType
  size?: "sm" | "md" | "lg"
}

export default function SabSastaScore({ score, size = "md" }: Props) {
  const sizeMap = {
    sm: { outer: "h-12 w-12", num: "text-sm", label: "text-[9px]" },
    md: { outer: "h-16 w-16", num: "text-xl", label: "text-[10px]" },
    lg: { outer: "h-24 w-24", num: "text-3xl", label: "text-xs" },
  }

  const colorMap = {
    green: "border-[#00C875] text-[#00C875]",
    orange: "border-[#FF9500] text-[#FF9500]",
    red: "border-[#FF4444] text-[#FF4444]",
  }

  const { outer, num, label } = sizeMap[size]
  const color = colorMap[score.color]

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${outer} ${color} flex flex-col items-center justify-center rounded-full border-2 bg-[#0D0D1B]`}
      >
        <span className={`${num} font-bold leading-none`}>{score.total}</span>
        <span className={`${label} text-white/40 leading-none`}>/100</span>
      </div>
      {size !== "sm" && (
        <span className={`text-[10px] font-semibold ${color.split(" ")[1]}`}>
          {score.label}
        </span>
      )}
    </div>
  )
}