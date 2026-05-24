import { StampType } from "@/types";

export interface StampOption {
  type: StampType;
  label: string;
  description: string;
  icon: string;
  color: string;
  benefits: {
    amount: number;
    alcohol: number;
    calories: number;
  };
}

export const STAMP_OPTIONS: Record<StampType, StampOption> = {
  VICTORY: {
    type: 'VICTORY',
    label: '完全勝利',
    description: '外食・直帰',
    icon: '🏆',
    color: 'var(--success)',
    benefits: {
      amount: 500,
      alcohol: 40,
      calories: 400,
    }
  },
  DATE: {
    type: 'DATE',
    label: '居酒屋デート',
    description: '楽しく飲酒',
    icon: '🍻',
    color: 'var(--info)',
    benefits: {
      amount: 0,
      alcohol: 0,
      calories: 0,
    }
  },
  HOME: {
    type: 'HOME',
    label: '家飲み',
    description: '自宅で飲酒',
    icon: '🏠',
    color: 'var(--warning)',
    benefits: {
      amount: 0,
      alcohol: 0,
      calories: 0,
    }
  }
};
