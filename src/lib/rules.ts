import type { DayShiftState } from '../store';
import { subDays, format, parseISO } from 'date-fns';

export interface DayPlan {
    workout: 'SKIP' | 'LIGHT' | 'FULL';
    proteinTarget: 'LOW' | 'HIGH';
    stepTarget: number;
    reason: string;
    focus: string;
}

export function calculateDayPlan(
    dateStr: string,
    history: Record<string, DayShiftState>
): DayPlan {
    const todayState = history[dateStr];

    // Default Plan (Baseline)
    let plan: DayPlan = {
        workout: 'FULL',
        proteinTarget: 'HIGH',
        stepTarget: 8000,
        reason: 'Standard day. Push for progress.',
        focus: 'Hit protein + steps',
    };

    if (!todayState) {
        return { ...plan, reason: 'No shift data set for today.' };
    }

    const { shift, location } = todayState;

    // Get Yesterday's State
    const yesterdayDate = subDays(parseISO(dateStr), 1);
    const yesterdayStr = format(yesterdayDate, 'yyyy-MM-dd');
    const yesterdayState = history[yesterdayStr];

    // RULE 1: TRAVEL IS RECOVERY
    if (location === 'Travel') {
        return {
            workout: 'SKIP',
            proteinTarget: 'LOW',
            stepTarget: 4000,
            reason: 'Travel causes systemic fatigue. Recovery is priority.',
            focus: 'Hydration & Survival',
        };
    }

    // RULE 2: RECOVERY AFTER TRAVEL
    if (yesterdayState?.location === 'Travel') {
        return {
            workout: 'SKIP',
            proteinTarget: 'LOW',
            stepTarget: 6000,
            reason: 'Post-travel inflammation is high. Rest to flush cortisol.',
            focus: 'Sleep catch-up',
        };
    }

    // RULE 3: NIGHT SHIFT ADAPTATION
    if (shift === 'Night') {
        if (yesterdayState?.shift !== 'Night') {
            // First night shift
            return {
                workout: 'LIGHT',
                proteinTarget: 'HIGH',
                stepTarget: 5000,
                reason: 'Transitioning to Night Shift. Conserve energy.',
                focus: 'Napping & Caffeine Timing',
            };
        } else {
            // Mid-night block
            return {
                workout: 'LIGHT',
                proteinTarget: 'HIGH',
                stepTarget: 5000,
                reason: 'Mid-night block. cortisol is inverted.',
                focus: 'Sleep quality > Workout intensity',
            };
        }
    }

    // RULE 4: HOSTEL VS HOME
    if (location === 'Hostel') {
        // Hostel usually means better protein access (canteen) or worse? 
        // User prompt said: "Protein availability differs by location".
        // Let's assume Hostel/Office might be HIGHER focus if home is distracting, 
        // OR standard. Let's stick to base logic but customize message.
        plan.reason = 'Environment is controlled. Good day for execution.';
    } else if (location === 'Home') {
        // Home might be lower protein if family meals etc.
        // But let's keep it 'HIGH' target but 'LIGHT' workout if recovering from shift?
        // Let's apply "Off" logic.
    }

    // RULE 5: POST-NIGHT RECOVERY
    if (yesterdayState?.shift === 'Night') {
        return {
            workout: 'SKIP',
            proteinTarget: 'LOW',
            stepTarget: 5000,
            reason: 'Night shift hangover. Sleep debt is high.',
            focus: 'Reset sleep rhythm',
        };
    }

    return plan;
}
