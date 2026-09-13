import { Goal, SavingsRecord, UserSettings } from '../types';

const STORAGE_KEYS = {
  GOALS: 'savings_tracker_goals_v1',
  RECORDS: 'savings_tracker_records_v1',
  SETTINGS: 'savings_tracker_settings_v1',
};

// Default high quality image presets
export const GOAL_IMAGE_PRESETS = [
  {
    id: 'portfolio',
    name: 'Wealth & Portfolio',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    category: 'investment',
  },
  {
    id: 'emergency',
    name: 'Emergency Fund',
    url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    category: 'emergency',
  },
  {
    id: 'travel',
    name: 'Dream Vacation',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    category: 'travel',
  },
  {
    id: 'home',
    name: 'Dream Home',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    category: 'home',
  },
  {
    id: 'car',
    name: 'New Car',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    category: 'vehicle',
  },
  {
    id: 'gadget',
    name: 'Tech Gadgets',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    category: 'gadget',
  },
  {
    id: 'education',
    name: 'Higher Education',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    category: 'education',
  },
];

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Alex Morgan',
  currency: '₹',
  darkMode: false,
};

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-portfolio-1',
    name: 'Portfolio',
    targetAmount: 10000,
    savedAmount: 4000,
    targetDate: '2026-12-31',
    category: 'investment',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    monthlyTarget: 2000,
    notes: 'Long term index fund and blue chip equity savings portfolio.',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-09-10T14:30:00.000Z',
  },
  {
    id: 'goal-emergency-2',
    name: 'Emergency Fund',
    targetAmount: 50000,
    savedAmount: 25000,
    targetDate: '2027-03-31',
    category: 'emergency',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    monthlyTarget: 5000,
    notes: '6 months of essential living expenses parked in liquid instruments.',
    createdAt: '2026-07-15T09:00:00.000Z',
    updatedAt: '2026-09-05T11:20:00.000Z',
  },
  {
    id: 'goal-vacation-3',
    name: 'Kyoto Journey',
    targetAmount: 20000,
    savedAmount: 20000,
    targetDate: '2026-11-15',
    category: 'travel',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    monthlyTarget: 4000,
    notes: 'Flights and ryokan booking for autumn foliage in Japan.',
    createdAt: '2026-05-10T08:00:00.000Z',
    updatedAt: '2026-09-01T16:45:00.000Z',
  },
];

const DEFAULT_RECORDS: SavingsRecord[] = [
  {
    id: 'rec-1',
    goalId: 'goal-portfolio-1',
    amount: 1500,
    date: '2026-08-05',
    note: 'Initial portfolio seed deposit',
    runningBalance: 1500,
    createdAt: '2026-08-05T10:00:00.000Z',
  },
  {
    id: 'rec-2',
    goalId: 'goal-portfolio-1',
    amount: 1000,
    date: '2026-08-25',
    note: 'Freelance design project savings',
    runningBalance: 2500,
    createdAt: '2026-08-25T14:20:00.000Z',
  },
  {
    id: 'rec-3',
    goalId: 'goal-portfolio-1',
    amount: 1500,
    date: '2026-09-08',
    note: 'Monthly scheduled savings allocation',
    runningBalance: 4000,
    createdAt: '2026-09-08T11:15:00.000Z',
  },
  {
    id: 'rec-4',
    goalId: 'goal-emergency-2',
    amount: 15000,
    date: '2026-07-20',
    note: 'Tax return allocation',
    runningBalance: 15000,
    createdAt: '2026-07-20T09:00:00.000Z',
  },
  {
    id: 'rec-5',
    goalId: 'goal-emergency-2',
    amount: 10000,
    date: '2026-08-30',
    note: 'Bonus deposit',
    runningBalance: 25000,
    createdAt: '2026-08-30T10:30:00.000Z',
  },
  {
    id: 'rec-6',
    goalId: 'goal-vacation-3',
    amount: 10000,
    date: '2026-06-01',
    note: 'Flight fund kickstart',
    runningBalance: 10000,
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'rec-7',
    goalId: 'goal-vacation-3',
    amount: 10000,
    date: '2026-08-15',
    note: 'Final hotel and travel deposit',
    runningBalance: 20000,
    createdAt: '2026-08-15T12:00:00.000Z',
  },
];

export class StorageService {
  static getSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Error reading settings', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  }

  static getGoals(): Goal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading goals', e);
    }
    // Initialize with defaults if empty
    this.saveGoals(DEFAULT_GOALS);
    return DEFAULT_GOALS;
  }

  static getGoal(id: string): Goal | undefined {
    const goals = this.getGoals();
    return goals.find((g) => g.id === id);
  }

  static saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error('Error saving goals', e);
    }
  }

  static getRecords(goalId?: string): SavingsRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECORDS);
      let records: SavingsRecord[] = stored ? JSON.parse(stored) : DEFAULT_RECORDS;
      if (!stored) {
        this.saveRecords(DEFAULT_RECORDS);
      }
      if (goalId) {
        records = records.filter((r) => r.goalId === goalId);
      }
      // Sort newest first
      return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      console.error('Error reading records', e);
      return [];
    }
  }

  static saveRecords(records: SavingsRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving records', e);
    }
  }

  static recalculateGoalBalance(goalId: string): number {
    const allRecords = this.getRecords();
    const goalRecords = allRecords
      .filter((r) => r.goalId === goalId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let running = 0;
    const updatedGoalRecords = goalRecords.map((r) => {
      running += r.amount;
      return { ...r, runningBalance: running };
    });

    // Replace in all records
    const otherRecords = allRecords.filter((r) => r.goalId !== goalId);
    this.saveRecords([...otherRecords, ...updatedGoalRecords]);

    // Update goal saved amount
    const goals = this.getGoals();
    const updatedGoals = goals.map((g) => {
      if (g.id === goalId) {
        return {
          ...g,
          savedAmount: running,
          updatedAt: new Date().toISOString(),
        };
      }
      return g;
    });
    this.saveGoals(updatedGoals);

    return running;
  }

  static addRecord(goalId: string, amount: number, date: string, note?: string): SavingsRecord {
    const allRecords = this.getRecords();
    const newRecord: SavingsRecord = {
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      goalId,
      amount,
      date,
      note: note?.trim() || undefined,
      runningBalance: 0, // Recalculated below
      createdAt: new Date().toISOString(),
    };

    allRecords.push(newRecord);
    this.saveRecords(allRecords);
    this.recalculateGoalBalance(goalId);

    // Fetch updated record with runningBalance
    const updated = this.getRecords(goalId).find((r) => r.id === newRecord.id);
    return updated || newRecord;
  }

  static updateRecord(recordId: string, amount: number, date: string, note?: string): boolean {
    const allRecords = this.getRecords();
    const target = allRecords.find((r) => r.id === recordId);
    if (!target) return false;

    const goalId = target.goalId;
    const updated = allRecords.map((r) => {
      if (r.id === recordId) {
        return {
          ...r,
          amount,
          date,
          note: note?.trim() || undefined,
        };
      }
      return r;
    });

    this.saveRecords(updated);
    this.recalculateGoalBalance(goalId);
    return true;
  }

  static deleteRecord(recordId: string): boolean {
    const allRecords = this.getRecords();
    const target = allRecords.find((r) => r.id === recordId);
    if (!target) return false;

    const goalId = target.goalId;
    const remaining = allRecords.filter((r) => r.id !== recordId);
    this.saveRecords(remaining);
    this.recalculateGoalBalance(goalId);
    return true;
  }

  static addGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal {
    const goals = this.getGoals();
    const newGoal: Goal = {
      ...goalData,
      id: 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    goals.unshift(newGoal);
    this.saveGoals(goals);

    // If initial saved amount was provided > 0, create an initial record!
    if (newGoal.savedAmount > 0) {
      this.addRecord(
        newGoal.id,
        newGoal.savedAmount,
        new Date().toISOString().split('T')[0],
        'Initial balance'
      );
    }

    return newGoal;
  }

  static updateGoal(goal: Goal): void {
    const goals = this.getGoals();
    const updated = goals.map((g) =>
      g.id === goal.id ? { ...goal, updatedAt: new Date().toISOString() } : g
    );
    this.saveGoals(updated);
  }

  static deleteGoal(goalId: string): void {
    const goals = this.getGoals();
    this.saveGoals(goals.filter((g) => g.id !== goalId));

    // Also remove associated records
    const allRecords = this.getRecords();
    this.saveRecords(allRecords.filter((r) => r.goalId !== goalId));
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    this.saveGoals(DEFAULT_GOALS);
    this.saveRecords(DEFAULT_RECORDS);
    this.saveSettings(DEFAULT_SETTINGS);
  }

  static exportBackup(): string {
    return JSON.stringify(
      {
        goals: this.getGoals(),
        records: this.getRecords(),
        settings: this.getSettings(),
        version: 1,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  static importBackup(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.goals) && Array.isArray(data.records)) {
        this.saveGoals(data.goals);
        this.saveRecords(data.records);
        if (data.settings) {
          this.saveSettings(data.settings);
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to import backup', e);
    }
    return false;
  }
}
