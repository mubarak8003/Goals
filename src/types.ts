export type GoalCategory = 
  | 'investment'
  | 'emergency'
  | 'travel'
  | 'home'
  | 'vehicle'
  | 'gadget'
  | 'education'
  | 'general';

export interface SavingsRecord {
  id: string;
  goalId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  note?: string;
  runningBalance: number;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: GoalCategory;
  imageUrl?: string;
  iconName?: string;
  monthlyTarget?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalStats {
  progress: number;
  remaining: number;
  isCompleted: boolean;
  daysRemaining: number;
  timeRemainingLabel: string;
  targetDateFormatted: string;
  dailyRequired: number;
  weeklyRequired: number;
  monthlyRequired: number;
  isPastTarget: boolean;
}

export interface UserSettings {
  name: string;
  currency: string;
  darkMode: boolean;
}
