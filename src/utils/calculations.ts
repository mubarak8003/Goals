import { Goal, GoalStats } from '../types';

export function formatCurrency(amount: number, currency: string = '₹', includeDecimals: boolean = true): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  let formattedNumber: string;
  if (currency === '₹') {
    // Indian numbering format (e.g. 10,00,000 or 10,000.00)
    formattedNumber = absVal.toLocaleString('en-IN', {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    });
  } else {
    formattedNumber = absVal.toLocaleString('en-US', {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    });
  }

  return `${isNegative ? '-' : ''}${currency} ${formattedNumber}`;
}

export function formatCurrencyCompact(amount: number, currency: string = '₹'): string {
  return formatCurrency(amount, currency, false);
}

export function formatDatePretty(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;

  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function calculateTimeRemaining(targetDateStr: string, currentDate: Date = new Date()): {
  days: number;
  months: number;
  exactDays: number;
  label: string;
  isPast: boolean;
} {
  const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const target = new Date(targetDateStr + 'T00:00:00');
  const targetDateOnly = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffTime = targetDateOnly.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      days: diffDays,
      months: 0,
      exactDays: 0,
      label: `${overdueDays} ${overdueDays === 1 ? 'Day' : 'Days'} Overdue`,
      isPast: true,
    };
  }

  if (diffDays === 0) {
    return {
      days: 0,
      months: 0,
      exactDays: 0,
      label: 'Target is Today',
      isPast: false,
    };
  }

  // Calculate breakdown in months & remaining days
  let months = 0;
  let cursorDate = new Date(today);

  while (true) {
    const nextMonth = new Date(cursorDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth <= targetDateOnly) {
      months++;
      cursorDate = nextMonth;
    } else {
      break;
    }
  }

  const remainingDays = Math.round((targetDateOnly.getTime() - cursorDate.getTime()) / (1000 * 60 * 60 * 24));

  let labelParts: string[] = [];
  if (months > 0) {
    labelParts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
  }
  if (remainingDays > 0) {
    labelParts.push(`${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`);
  }

  const label = labelParts.length > 0 ? `${labelParts.join(' ')} To Go` : `${diffDays} Days To Go`;

  return {
    days: diffDays,
    months,
    exactDays: remainingDays,
    label,
    isPast: false,
  };
}

export function calculateGoalStats(goal: Goal, currentDate: Date = new Date()): GoalStats {
  const target = Math.max(0, goal.targetAmount);
  const saved = Math.max(0, goal.savedAmount);
  const remaining = Math.max(0, target - saved);
  const rawProgress = target > 0 ? (saved / target) * 100 : 0;
  const progress = Math.min(100, Math.round(rawProgress));
  const isCompleted = saved >= target && target > 0;

  const time = calculateTimeRemaining(goal.targetDate, currentDate);
  const targetDateFormatted = formatDatePretty(goal.targetDate);

  let dailyRequired = 0;
  let weeklyRequired = 0;
  let monthlyRequired = 0;

  if (!isCompleted && !time.isPast && time.days > 0 && remaining > 0) {
    dailyRequired = remaining / time.days;
    // Weekly
    const weeks = time.days / 7;
    weeklyRequired = weeks >= 1 ? remaining / Math.floor(weeks) : remaining;
    // Monthly
    const months = time.days / 30.4167;
    monthlyRequired = months >= 1 ? remaining / Math.floor(months) : remaining;
  }

  return {
    progress,
    remaining,
    isCompleted,
    daysRemaining: time.days,
    timeRemainingLabel: isCompleted ? 'Goal Completed 🎉' : time.label,
    targetDateFormatted,
    dailyRequired,
    weeklyRequired,
    monthlyRequired,
    isPastTarget: time.isPast,
  };
}
