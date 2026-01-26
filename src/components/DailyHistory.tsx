import { useState } from 'react';
import { useStore, type MealType } from '../store';
import { format, parseISO, subDays, startOfDay } from 'date-fns';
import {
    Calendar,
    Dumbbell,
    Droplet,
    Footprints,
    Apple,
    Scale,
    Moon,
    Sun,
    Home as HomeIcon,
    Building,
    Plane,
    ChevronDown,
    ChevronUp,
    Coffee,
    Cookie,
    GraduationCap
} from 'lucide-react';

export function DailyHistory() {
    const { logs, shiftHistory, weightHistory } = useStore();
    const [daysToShow, setDaysToShow] = useState(30);
    const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

    // Generate array of dates for the past N days
    const generateDates = (days: number) => {
        const dates = [];
        const today = startOfDay(new Date());
        for (let i = 0; i < days; i++) {
            const date = subDays(today, i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    const dates = generateDates(daysToShow);
    const datesWithData = dates.filter(date => logs[date] || shiftHistory[date] || weightHistory.some(w => w.date === date));

    const toggleExpanded = (date: string) => {
        const newExpanded = new Set(expandedDates);
        if (newExpanded.has(date)) {
            newExpanded.delete(date);
        } else {
            newExpanded.add(date);
        }
        setExpandedDates(newExpanded);
    };

    const getShiftIcon = (shift: string) => {
        switch (shift) {
            case 'Morning': return <Sun className="w-4 h-4" />;
            case 'Afternoon': return <Sun className="w-4 h-4" />;
            case 'Night': return <Moon className="w-4 h-4" />;
            case 'Off': return <Moon className="w-4 h-4" />;
            default: return null;
        }
    };

    const getLocationIcon = (location: string) => {
        switch (location) {
            case 'Home': return <HomeIcon className="w-4 h-4" />;
            case 'Hostel': return <Building className="w-4 h-4" />;
            case 'Work/College/School': return <GraduationCap className="w-4 h-4" />;
            case 'Travel': return <Plane className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="p-6 space-y-4 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-cyan-400" />
                        Daily History
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Your complete activity timeline</p>
                </div>
            </div>

            {/* Timeline controls */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setDaysToShow(30)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        daysToShow === 30
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    30 Days
                </button>
                <button
                    onClick={() => setDaysToShow(90)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        daysToShow === 90
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    90 Days
                </button>
                <button
                    onClick={() => setDaysToShow(180)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        daysToShow === 180
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    6 Months
                </button>
                <button
                    onClick={() => setDaysToShow(365)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        daysToShow === 365
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                >
                    1 Year
                </button>
            </div>

            <div className="text-xs text-slate-500">
                Showing {datesWithData.length} days with activity out of {daysToShow} days
            </div>

            {/* Timeline */}
            <div className="space-y-3">
                {datesWithData.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
                        <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No activity logged yet</p>
                        <p className="text-slate-600 text-xs mt-1">Start logging your daily activities to see your history</p>
                    </div>
                ) : (
                    datesWithData.map(date => {
                        const log = logs[date];
                        const shift = shiftHistory[date];
                        const weight = weightHistory.find(w => w.date === date);
                        const isExpanded = expandedDates.has(date);
                        const hasData = Boolean(log || shift || weight);

                        if (!hasData) return null;

                        return (
                            <div
                                key={date}
                                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors"
                            >
                                {/* Header - Always visible */}
                                <button
                                    onClick={() => toggleExpanded(date)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-white">
                                                {format(parseISO(date), 'EEEE, MMM d, yyyy')}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {shift && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        {getShiftIcon(shift.shift)}
                                                        <span>{shift.shift}</span>
                                                    </div>
                                                )}
                                                {shift && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        {getLocationIcon(shift.location)}
                                                        <span>{shift.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick summary badges */}
                                    <div className="flex items-center gap-2">
                                        {log?.workoutDone && (
                                            <div className="px-2 py-1 bg-emerald-950/30 rounded-md">
                                                <Dumbbell className="w-4 h-4 text-emerald-400" />
                                            </div>
                                        )}
                                        {weight && (
                                            <div className="px-2 py-1 bg-cyan-950/30 rounded-md">
                                                <Scale className="w-4 h-4 text-cyan-400" />
                                            </div>
                                        )}
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-slate-500" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-500" />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 space-y-3 border-t border-slate-800">
                                        {/* Weight */}
                                        {weight && (
                                            <div className="pt-3">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
                                                    <Scale className="w-3.5 h-3.5" />
                                                    Weight
                                                </div>
                                                <div className="text-2xl font-mono text-cyan-400 font-bold">
                                                    {weight.weight} <span className="text-sm text-slate-600">kg</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Workout */}
                                        {log?.workoutDone && (
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
                                                    <Dumbbell className="w-3.5 h-3.5" />
                                                    Workout Completed
                                                </div>
                                                {log.exercises && log.exercises.length > 0 && (
                                                    <div className="space-y-1.5">
                                                        {log.exercises.map((ex, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center justify-between p-2 bg-slate-950 rounded-lg"
                                                            >
                                                                <span className="text-sm text-slate-300">{ex.name}</span>
                                                                <span className="text-xs font-mono text-emerald-400">{ex.count}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Steps */}
                                        {log && log.steps > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
                                                    <Footprints className="w-3.5 h-3.5" />
                                                    Steps
                                                </div>
                                                <div className="text-xl font-mono text-purple-400 font-bold">
                                                    {log.steps.toLocaleString()}
                                                </div>
                                            </div>
                                        )}

                                        {/* Water */}
                                        {log && log.water && log.water > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
                                                    <Droplet className="w-3.5 h-3.5" />
                                                    Water
                                                </div>
                                                <div className="text-xl font-mono text-blue-400 font-bold">
                                                    {log.water} <span className="text-sm text-slate-600">glasses</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Protein */}
                                        {log && log.proteinEst && (
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
                                                    <Apple className="w-3.5 h-3.5" />
                                                    Protein Intake
                                                </div>
                                                <div className={`inline-flex px-3 py-1.5 rounded-full text-sm font-bold ${
                                                    log.proteinEst === 'high' ? 'bg-emerald-950/30 text-emerald-400' :
                                                    log.proteinEst === 'med' ? 'bg-amber-950/30 text-amber-400' :
                                                    'bg-slate-800 text-slate-500'
                                                }`}>
                                                    {log.proteinEst === 'high' ? 'High' : log.proteinEst === 'med' ? 'Medium' : 'Low'}
                                                </div>
                                            </div>
                                        )}

                                        {/* Food log */}
                                        {log && log.foodLog && log.foodLog.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
                                                    <Apple className="w-3.5 h-3.5" />
                                                    Food Log
                                                </div>
                                                <div className="space-y-2">
                                                    {log.foodLog.map((food, i) => {
                                                        const getMealIcon = (mealType: MealType) => {
                                                            switch (mealType) {
                                                                case 'Breakfast': return <Coffee className="w-3.5 h-3.5" />;
                                                                case 'Lunch': return <Sun className="w-3.5 h-3.5" />;
                                                                case 'Dinner': return <Moon className="w-3.5 h-3.5" />;
                                                                case 'Snack': return <Cookie className="w-3.5 h-3.5" />;
                                                            }
                                                        };

                                                        const getMealColor = (mealType: MealType) => {
                                                            switch (mealType) {
                                                                case 'Breakfast': return 'text-amber-400';
                                                                case 'Lunch': return 'text-orange-400';
                                                                case 'Dinner': return 'text-purple-400';
                                                                case 'Snack': return 'text-pink-400';
                                                            }
                                                        };

                                                        return (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg"
                                                            >
                                                                <div className={getMealColor(food.mealType)}>
                                                                    {getMealIcon(food.mealType)}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="text-sm text-slate-300">{food.item}</div>
                                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                                        <span>{food.mealType}</span>
                                                                        {food.time && <span className="font-mono">{food.time}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Load more */}
            {daysToShow < 365 && (
                <button
                    onClick={() => setDaysToShow(prev => Math.min(prev + 30, 365))}
                    className="w-full p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 text-sm font-bold transition-colors"
                >
                    Load More Days
                </button>
            )}
        </div>
    );
}
