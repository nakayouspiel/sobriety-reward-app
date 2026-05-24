import { AchievementStats, StampType } from "@/types";
import { STAMP_OPTIONS } from "@/constants/stamps";
import { differenceInDays, parseISO, isBefore, startOfDay } from "date-fns";

export function calculateStats(logs: Record<string, StampType>): AchievementStats {
  let totalVictoryCount = 0;
  let lastDrinkingDate: Date | null = null;
  const today = startOfDay(new Date());

  Object.entries(logs).forEach(([dateStr, type]) => {
    const date = parseISO(dateStr);
    
    if (type === 'VICTORY') {
      totalVictoryCount++;
    } else if (type === 'HOME' || type === 'DATE') {
      if (!lastDrinkingDate || isBefore(lastDrinkingDate, date)) {
        lastDrinkingDate = date;
      }
    }
  });

  const victoryOption = STAMP_OPTIONS.VICTORY;
  const soberDays = lastDrinkingDate 
    ? Math.max(0, differenceInDays(today, lastDrinkingDate))
    : totalVictoryCount > 0 ? differenceInDays(today, parseISO(Object.keys(logs).sort()[0])) : 0;

  return {
    totalVictoryCount,
    totalSavedAmount: totalVictoryCount * victoryOption.benefits.amount,
    totalAlcoholGrams: totalVictoryCount * victoryOption.benefits.alcohol,
    totalCalories: totalVictoryCount * victoryOption.benefits.calories,
    soberDays,
    monthlyAlcoholPoolGrams: totalVictoryCount * 40 // 40g = 2 long cans (500ml x 2) reward
  };
}
