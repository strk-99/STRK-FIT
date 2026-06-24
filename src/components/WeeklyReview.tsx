import { useState, useMemo } from 'react';
import { useStore, type MoodType } from '../store';
import {
    startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter,
    eachDayOfInterval, format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths,
    isSameDay, isSameWeek, isSameMonth, startOfYear, endOfYear
} from 'date-fns';
import {
    Trophy, ChevronLeft, ChevronRight, Flame,
    Award, Crown, Sparkles, Moon, Scale, Utensils, CheckCircle2, X
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOOD_META: Record<MoodType, { emoji: string; label: string; color: string }> = {
    dead:  { emoji: '💀', label: 'Dead',  color: 'text-slate-400'  },
    low:   { emoji: '😴', label: 'Low',   color: 'text-blue-400'   },
    okay:  { emoji: '😐', label: 'Okay',  color: 'text-yellow-400' },
    good:  { emoji: '💪', label: 'Good',  color: 'text-emerald-400'},
    fired: { emoji: '🔥', label: 'Fired', color: 'text-orange-400' },
};

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export function WeeklyReview() {
    const { logs, weightHistory, profile, weeklyIntentions, setWeeklyIntention, setWeeklyAchieved } = useStore();
    const [period, setPeriod] = useState<PeriodType>('weekly');
    const [viewDate, setViewDate] = useState(new Date());
    const [intentionInput, setIntentionInput] = useState('');

    const weekKey = format(startOfWeek(viewDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const weekIntention = weeklyIntentions[weekKey];

    const stats = useMemo(() => {
        let start: Date, end: Date;

        switch (period) {
            case 'daily':
                start = end = viewDate;
                break;
            case 'weekly':
                start = startOfWeek(viewDate, { weekStartsOn: 1 });
                end = endOfWeek(viewDate, { weekStartsOn: 1 });
                break;
            case 'monthly':
                start = startOfMonth(viewDate);
                end = endOfMonth(viewDate);
                break;
            case 'quarterly':
                start = startOfQuarter(viewDate);
                end = endOfQuarter(viewDate);
                break;
            case 'half-yearly':
                const monthNum = viewDate.getMonth();
                if (monthNum < 6) {
                    start = new Date(viewDate.getFullYear(), 0, 1);
                    end = new Date(viewDate.getFullYear(), 5, 30);
                } else {
                    start = new Date(viewDate.getFullYear(), 6, 1);
                    end = new Date(viewDate.getFullYear(), 11, 31);
                }
                break;
            case 'yearly':
                start = startOfYear(viewDate);
                end = endOfYear(viewDate);
                break;
        }

        const days = eachDayOfInterval({ start, end });
        const totalDays = days.length;

        let workoutDays = 0;
        let totalSteps = 0;
        let totalWater = 0;
        let totalSleep = 0;
        let highProteinDays = 0;
        let exerciseCount = 0;
        let foodEntries = 0;
        const moodCounts: Record<MoodType, number> = { dead: 0, low: 0, okay: 0, good: 0, fired: 0 };

        days.forEach(day => {
            const dKey = format(day, 'yyyy-MM-dd');
            const log = logs[dKey];
            if (log) {
                if (log.workoutDone) workoutDays++;
                totalSteps += log.steps || 0;
                totalWater += log.water || 0;
                totalSleep += log.sleep || 0;
                if (log.proteinEst === 'high') highProteinDays++;
                exerciseCount += log.exercises?.length || 0;
                foodEntries += log.foodLog?.length || 0;
                if (log.mood) moodCounts[log.mood]++;
            }
        });

        // Weight progress
        // Find the latest weight entry within or before the end date
        const relevantWeightHistory = weightHistory
            .filter(w => new Date(w.date) <= end)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const latestWeight = relevantWeightHistory[0]?.weight || profile?.startWeight || 0;

        // Calculate change from start of period
        const startWeightEntry = weightHistory
            .filter(w => new Date(w.date) >= start && new Date(w.date) <= end)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        const endWeightEntry = weightHistory
            .filter(w => new Date(w.date) >= start && new Date(w.date) <= end)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const weightChange = (endWeightEntry && startWeightEntry)
            ? endWeightEntry.weight - startWeightEntry.weight
            : 0;

        // Calculate metrics
        const workoutPercentage = totalDays > 0 ? (workoutDays / totalDays) * 100 : 0;
        const avgSteps = totalDays > 0 ? Math.round(totalSteps / totalDays) : 0;
        const avgWater = totalDays > 0 ? Math.round(totalWater / totalDays) : 0;
        const avgSleep = totalDays > 0 ? Number((totalSleep / totalDays).toFixed(1)) : 0;

        // Calculate grade
        let score = 0;
        score += workoutPercentage * 0.4;
        score += (totalSleep > (totalDays * 7) ? 100 : (totalSleep / (totalDays * 8)) * 100) * 0.2; // Sleep factor
        score += (highProteinDays / totalDays) * 100 * 0.2;
        score += Math.min((avgSteps / 10000) * 100, 100) * 0.2;

        let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
        let title = '';
        let message = '';
        let emoji = '';

        if (score >= 95) {
            grade = 'S';
            title = 'LEGENDARY';
            message = "You're an absolute beast! Keep dominating!";
            emoji = '👑';
        } else if (score >= 85) {
            grade = 'A';
            title = 'OUTSTANDING';
            message = "Incredible work! You're crushing your goals!";
            emoji = '⭐';
        } else if (score >= 70) {
            grade = 'B';
            title = 'GREAT WORK';
            message = "Solid progress! Keep pushing forward!";
            emoji = '💪';
        } else if (score >= 55) {
            grade = 'C';
            title = 'MAKING PROGRESS';
            message = "Good effort! Let's level up next time!";
            emoji = '📈';
        } else if (score >= 35) {
            grade = 'D';
            title = 'NEEDS IMPROVEMENT';
            message = "You can do better! Small steps matter!";
            emoji = '💫';
        } else {
            grade = 'F';
            title = 'TIME TO RESET';
            message = "Fresh start! Every champion has setbacks!";
            emoji = '🔄';
        }

        return {
            start,
            end,
            totalDays,
            workoutDays,
            workoutPercentage,
            avgSteps,
            avgWater,
            avgSleep,
            highProteinDays,
            exerciseCount,
            foodEntries,
            latestWeight,
            weightChange,
            grade,
            title,
            message,
            emoji,
            score: Math.round(score),
            moodCounts,
        };
    }, [logs, weightHistory, viewDate, period, profile]);

    const handlePrev = () => {
        switch (period) {
            case 'daily':
                setViewDate(d => subDays(d, 1));
                break;
            case 'weekly':
                setViewDate(d => subWeeks(d, 1));
                break;
            case 'monthly':
                setViewDate(d => subMonths(d, 1));
                break;
            case 'quarterly':
                setViewDate(d => subMonths(d, 3));
                break;
            case 'half-yearly':
                setViewDate(d => subMonths(d, 6));
                break;
            case 'yearly':
                setViewDate(d => new Date(d.getFullYear() - 1, d.getMonth(), d.getDate()));
                break;
        }
    };

    const handleNext = () => {
        switch (period) {
            case 'daily':
                setViewDate(d => addDays(d, 1));
                break;
            case 'weekly':
                setViewDate(d => addWeeks(d, 1));
                break;
            case 'monthly':
                setViewDate(d => addMonths(d, 1));
                break;
            case 'quarterly':
                setViewDate(d => addMonths(d, 3));
                break;
            case 'half-yearly':
                setViewDate(d => addMonths(d, 6));
                break;
            case 'yearly':
                setViewDate(d => new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()));
                break;
        }
    };

    const isCurrent = () => {
        const now = new Date();
        switch (period) {
            case 'daily':
                return isSameDay(viewDate, now);
            case 'weekly':
                return isSameWeek(viewDate, now, { weekStartsOn: 1 });
            case 'monthly':
                return isSameMonth(viewDate, now);
            default:
                return false;
        }
    };

    const getDateRangeText = () => {
        if (period === 'daily') {
            return format(viewDate, 'EEEE, MMM d, yyyy');
        }
        return `${format(stats.start, 'MMM d')} - ${format(stats.end, 'MMM d, yyyy')}`;
    };

    const gradeColors = {
        'S': { bg: 'from-purple-600/20 via-pink-600/20 to-purple-600/20', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/50' },
        'A': { bg: 'from-emerald-600/20 via-cyan-600/20 to-emerald-600/20', border: 'border-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' },
        'B': { bg: 'from-cyan-600/20 to-blue-600/20', border: 'border-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' },
        'C': { bg: 'from-yellow-600/20 to-amber-600/20', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
        'D': { bg: 'from-orange-600/20 to-amber-600/20', border: 'border-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
        'F': { bg: 'from-slate-800/50 to-slate-900/50', border: 'border-slate-700', text: 'text-slate-400', glow: 'shadow-slate-500/10' }
    };

    const colors = gradeColors[stats.grade];

    return (
        <div className="p-4 space-y-6 pb-24 animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        Progress Report
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Track your fitness journey</p>
                </div>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {(['daily', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly'] as PeriodType[]).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0",
                            period === p
                                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                        )}
                    >
                        {p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Date Navigation */}
            <div className="flex items-center justify-between bg-slate-900 rounded-xl p-3 border border-slate-800">
                <button onClick={handlePrev} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="text-center">
                    <p className="text-sm font-bold text-white">{getDateRangeText()}</p>
                    <p className="text-xs text-slate-500">{stats.totalDays} {stats.totalDays === 1 ? 'day' : 'days'}</p>
                </div>
                <button
                    onClick={handleNext}
                    disabled={isCurrent()}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Weekly Intention (only in weekly mode) */}
            {period === 'weekly' && (
                <div className="bg-slate-900/40 border border-amber-800/30 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] text-amber-500/70 uppercase font-bold tracking-wider">Weekly Intention</p>
                    {weekIntention?.intention ? (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm text-slate-300 italic flex-1">"{weekIntention.intention}"</p>
                                <button onClick={() => setWeeklyIntention(weekKey, '')}
                                    className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <p className="text-xs text-slate-500">Did you achieve it?</p>
                                <button
                                    onClick={() => setWeeklyAchieved(weekKey, true)}
                                    className={cn('text-xs font-bold px-2 py-0.5 rounded transition-colors', weekIntention.achieved === true ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-500 hover:text-emerald-400')}>
                                    Yes ✅
                                </button>
                                <button
                                    onClick={() => setWeeklyAchieved(weekKey, false)}
                                    className={cn('text-xs font-bold px-2 py-0.5 rounded transition-colors', weekIntention.achieved === false ? 'text-red-400 bg-red-950/40' : 'text-slate-500 hover:text-red-400')}>
                                    Not yet
                                </button>
                            </div>
                        </div>
                    ) : (
                        <input
                            value={intentionInput}
                            onChange={e => setIntentionInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && intentionInput.trim()) {
                                    setWeeklyIntention(weekKey, intentionInput.trim());
                                    setIntentionInput('');
                                }
                            }}
                            onBlur={() => {
                                if (intentionInput.trim()) {
                                    setWeeklyIntention(weekKey, intentionInput.trim());
                                    setIntentionInput('');
                                }
                            }}
                            placeholder="Set your intention for this week…"
                            className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none border-b border-slate-800 pb-1"
                        />
                    )}
                </div>
            )}

            {/* Grade Card */}
            <div className={cn(
                "relative p-8 rounded-2xl border-2 overflow-hidden bg-gradient-to-br shadow-2xl",
                colors.bg,
                colors.border,
                colors.glow
            )}>
                {/* Decorative background */}
                {stats.grade === 'S' && (
                    <div className="absolute inset-0 overflow-hidden">
                        <Sparkles className="absolute top-4 right-4 w-6 h-6 text-purple-400 animate-pulse" />
                        <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <Crown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-purple-500/10" />
                    </div>
                )}

                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="text-6xl">{stats.emoji}</div>

                    <div className="text-center">
                        <div className={cn("text-9xl font-black font-mono", colors.text)}>
                            {stats.grade}
                        </div>
                        <div className={cn("text-xs font-bold uppercase tracking-widest mt-2", colors.text)}>
                            {stats.title}
                        </div>
                    </div>

                    <div className="bg-slate-950/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-800/50">
                        <p className="text-sm text-slate-300 text-center">{stats.message}</p>
                    </div>

                    {/* Score bar */}
                    <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>Overall Score</span>
                            <span className={cn("font-bold", colors.text)}>{stats.score}%</span>
                        </div>
                        <div className="h-2 bg-slate-950/50 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-1000 bg-gradient-to-r", colors.text.replace('text-', 'from-'), 'to-transparent')}
                                style={{ width: `${stats.score}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid - 5 items: Exercise, Food, Water, Sleep, Weight */}
            <div className="space-y-3">

                {/* Top Row: Exercise & Food */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900 p-4 rounded-xl border border-emerald-900/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-4 h-4 text-emerald-400" />
                            <p className="text-xs text-emerald-400 uppercase font-bold">Exercise Log</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.exerciseCount}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {stats.workoutDays} logged workouts
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-950/30 to-slate-900 p-4 rounded-xl border border-orange-900/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Utensils className="w-4 h-4 text-orange-400" />
                            <p className="text-xs text-orange-400 uppercase font-bold">Food Log</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.foodEntries}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            items recorded
                        </p>
                    </div>
                </div>

                {/* Middle Row: Water & Sleep */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-950/30 to-slate-900 p-4 rounded-xl border border-blue-900/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-blue-400" />
                            <p className="text-xs text-blue-400 uppercase font-bold">Water Log</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.avgWater}</p>
                        <p className="text-xs text-slate-500 mt-1">Glasses avg/day</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-950/30 to-slate-900 p-4 rounded-xl border border-indigo-900/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Moon className="w-4 h-4 text-indigo-400" />
                            <p className="text-xs text-indigo-400 uppercase font-bold">Sleep Log</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.avgSleep}h</p>
                        <p className="text-xs text-slate-500 mt-1">Average per night</p>
                    </div>
                </div>

                {/* Bottom Row: Updated Weight */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <Scale className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Updated Weight</p>
                                <p className="text-2xl font-bold text-white">{stats.latestWeight} <span className="text-sm font-normal text-slate-400">kg</span></p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Change</p>
                            <p className={cn(
                                "text-lg font-bold",
                                stats.weightChange < 0 ? 'text-emerald-400' : stats.weightChange > 0 ? 'text-amber-400' : 'text-slate-400'
                            )}>
                                {stats.weightChange === 0 ? '--' : `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg`}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Mood Breakdown */}
            {Object.values(stats.moodCounts).some(v => v > 0) && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Mood Breakdown</p>
                    <div className="grid grid-cols-5 gap-2">
                        {(Object.entries(stats.moodCounts) as [MoodType, number][]).map(([mood, count]) => (
                            <div key={mood} className="flex flex-col items-center gap-1">
                                <span className="text-xl">{MOOD_META[mood].emoji}</span>
                                <span className={cn('text-lg font-bold', count > 0 ? MOOD_META[mood].color : 'text-slate-700')}>{count}</span>
                                <span className="text-[9px] text-slate-600 font-bold uppercase">{MOOD_META[mood].label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Motivational footer */}
            <div className="text-center pt-4">
                {stats.grade === 'S' && (
                    <p className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        You're a LEGEND! Keep dominating! 👑
                    </p>
                )}
                {stats.grade === 'A' && (
                    <p className="text-sm font-bold text-emerald-400">
                        Outstanding performance! You're unstoppable! ⭐
                    </p>
                )}
                {stats.grade === 'B' && (
                    <p className="text-sm font-bold text-cyan-400">
                        Great work! Push a bit harder for excellence! 💪
                    </p>
                )}
                {stats.grade === 'C' && (
                    <p className="text-sm text-yellow-400">
                        Solid effort! Consistency will take you to the top! 📈
                    </p>
                )}
                {stats.grade === 'D' && (
                    <p className="text-sm text-orange-400">
                        Keep going! Small improvements add up! 💫
                    </p>
                )}
                {stats.grade === 'F' && (
                    <p className="text-sm text-slate-400">
                        New day, new opportunity! Champions rise after setbacks! 🔄
                    </p>
                )}
            </div>
        </div>
    );
}
