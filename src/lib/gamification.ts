import { parseISO, differenceInDays, startOfDay } from 'date-fns';
import type { DailyLog, DayShiftState } from '../store';

// Calculate integrity streak (counts effort, not perfection)
export function calculateIntegrityStreak(
    logs: Record<string, DailyLog>,
    shiftHistory: Record<string, DayShiftState>
): { currentStreak: number; bestStreak: number } {
    const dates = Object.keys(logs).sort().reverse(); // Most recent first
    if (dates.length === 0) return { currentStreak: 0, bestStreak: 0 };

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = startOfDay(new Date());
    let checkDate = today;
    let foundToday = false;

    // Calculate current streak (looking backwards from today)
    for (let i = 0; i < 365; i++) { // Max 1 year lookback
        const dateStr = checkDate.toISOString().split('T')[0];
        const log = logs[dateStr];
        const shift = shiftHistory[dateStr];

        // Check if this day should count
        const isRecoveryDay = shift?.shift === 'Night' || shift?.location === 'Travel';
        const hasEffort = log && (log.workoutDone || (log.exercises && log.exercises.length > 0) || log.steps > 3000);

        if (hasEffort || isRecoveryDay) {
            if (!foundToday && i === 0) foundToday = true;
            currentStreak++;
        } else {
            // Break current streak if we're past today
            if (i > 0) break;
        }

        checkDate = new Date(checkDate);
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // If today has no log yet, don't break the streak
    if (!foundToday && currentStreak > 0) {
        // Keep the streak, they haven't logged today yet
    } else if (!foundToday && currentStreak === 0) {
        currentStreak = 0;
    }

    // Calculate best streak (scan all logs)
    const allDates = Object.keys(logs).sort();
    for (let i = 0; i < allDates.length; i++) {
        const dateStr = allDates[i];
        const log = logs[dateStr];
        const shift = shiftHistory[dateStr];

        const isRecoveryDay = shift?.shift === 'Night' || shift?.location === 'Travel';
        const hasEffort = log && (log.workoutDone || (log.exercises && log.exercises.length > 0) || log.steps > 3000);

        if (hasEffort || isRecoveryDay) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else {
            // Check if it's just a gap (allow 1 day gap for forgiveness)
            if (i + 1 < allDates.length) {
                const nextDate = parseISO(allDates[i + 1]);
                const currDate = parseISO(dateStr);
                const daysDiff = differenceInDays(nextDate, currDate);

                if (daysDiff > 2) {
                    // Reset if gap is more than 2 days
                    tempStreak = 0;
                }
            }
        }
    }

    return {
        currentStreak,
        bestStreak: Math.max(bestStreak, currentStreak)
    };
}

// Calculate "Right Now" focus items based on recent patterns
export function getRightNowFocus(
    logs: Record<string, DailyLog>,
    shiftHistory: Record<string, DayShiftState>
): string[] {
    const focus: string[] = [];
    const dates = Object.keys(logs).sort().reverse().slice(0, 7); // Last 7 days

    if (dates.length === 0) {
        return ['Log your first day', 'Start with just showing up', 'One workout this week'];
    }

    // Check workout frequency
    const workoutsThisWeek = dates.filter(d => logs[d]?.workoutDone).length;
    if (workoutsThisWeek < 3) {
        focus.push('3–4 workouts this week');
    }

    // Check protein on hostel days
    const hostelDays = dates.filter(d => shiftHistory[d]?.location === 'Hostel');
    const hostelDaysWithProtein = hostelDays.filter(d => logs[d]?.proteinEst && logs[d].proteinEst !== 'low');
    if (hostelDays.length > 0 && hostelDaysWithProtein.length < hostelDays.length) {
        focus.push('Protein on hostel days');
    }

    // Check night shift recovery
    const nightShifts = dates.filter(d => shiftHistory[d]?.shift === 'Night');
    if (nightShifts.length > 0) {
        focus.push('Sleep after night shifts');
    }

    // Check water intake
    const daysWithWater = dates.filter(d => logs[d]?.water && logs[d].water! >= 6);
    if (daysWithWater.length < dates.length / 2) {
        focus.push('6+ glasses of water daily');
    }

    // Check steps
    const avgSteps = dates.reduce((sum, d) => sum + (logs[d]?.steps || 0), 0) / Math.max(dates.length, 1);
    if (avgSteps < 5000) {
        focus.push('5000+ steps on active days');
    }

    // Return max 3 items
    return focus.slice(0, 3);
}

// Calculate weekly identity snapshot
export function getWeeklySnapshot(
    logs: Record<string, DailyLog>,
    shiftHistory: Record<string, DayShiftState>
): { activeDays: number; awarenessDays: number; restDays: number } {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const thisWeekDates = Object.keys(logs).filter(d => {
        const date = parseISO(d);
        return date >= weekAgo && date <= today;
    });

    const activeDays = thisWeekDates.filter(d => {
        const log = logs[d];
        return log.workoutDone || (log.exercises && log.exercises.length > 0) || log.steps > 5000;
    }).length;

    const awarenessDays = thisWeekDates.filter(d => {
        const log = logs[d];
        return log.proteinEst !== 'low' || (log.water && log.water >= 6) || (log.foodLog && log.foodLog.length > 0);
    }).length;

    const restDays = thisWeekDates.filter(d => {
        const shift = shiftHistory[d];
        return shift?.shift === 'Off' || shift?.shift === 'Night';
    }).length;

    return { activeDays, awarenessDays, restDays };
}

// Calculate next 10-day check-in date
export function getNextCheckInDays(weightHistory: { date: string; weight: number }[]): number {
    if (weightHistory.length === 0) return 0;

    const lastEntry = weightHistory[weightHistory.length - 1];
    const lastDate = parseISO(lastEntry.date);
    const today = new Date();
    const daysSinceLast = differenceInDays(today, lastDate);
    const nextCheckIn = 10 - daysSinceLast;

    return Math.max(0, nextCheckIn);
}
