import { ContentRank } from "@/lib/types";

interface RankBadgeProps {
  rank: ContentRank;
  size?: "sm" | "md" | "lg";
}

const rankConfig: Record<ContentRank, { label: string; className: string }> = {
  guest: {
    label: "非会員",
    className: "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200",
  },
  bronze: {
    label: "ブロンズ",
    className: "bg-amber-700 text-amber-50",
  },
  silver: {
    label: "シルバー",
    className: "bg-gray-400 text-gray-900",
  },
  gold: {
    label: "ゴールド",
    className: "bg-yellow-400 text-yellow-900",
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export function RankBadge({ rank, size = "md" }: RankBadgeProps) {
  const config = rankConfig[rank];
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.className} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
}
