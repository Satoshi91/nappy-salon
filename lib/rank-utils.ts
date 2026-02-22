import { Rank, ContentRank } from "./types";

const RANK_ORDER: Record<ContentRank, number> = {
  guest: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
};

export function canAccessContent(
  userRank: Rank | null,
  requiredRank: ContentRank
): boolean {
  if (!userRank) {
    return requiredRank === "guest";
  }
  return RANK_ORDER[userRank] >= RANK_ORDER[requiredRank];
}

export function getRankLabel(rank: ContentRank): string {
  const labels: Record<ContentRank, string> = {
    guest: "非会員",
    bronze: "ブロンズ",
    silver: "シルバー",
    gold: "ゴールド",
  };
  return labels[rank];
}

export const CONTENT_RANKS: ContentRank[] = ["guest", "bronze", "silver", "gold"];
