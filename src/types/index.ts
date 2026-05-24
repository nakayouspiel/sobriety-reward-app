export type StampType = 'VICTORY' | 'DATE' | 'HOME';

export interface DailyLog {
  id: string;
  user_id: string;
  record_date: string;
  stamp_type: StampType;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  motivation_text: string;
  updated_at: string;
}

export interface AchievementStats {
  totalVictoryCount: number;
  totalSavedAmount: number;
  totalAlcoholGrams: number;
  totalCalories: number;
  soberDays: number;
}
