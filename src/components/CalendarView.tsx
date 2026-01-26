import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks, isToday } from 'date-fns';
import { useStore } from '../store';
import { ShiftSelector } from './ShiftSelector';
import { ChevronLeft, ChevronRight, CalendarDays, Sun, Moon, Coffee, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { shiftHistory, setShift, logs } = useStore();

    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const selectedDayState = shiftHistory[selectedDateStr] || { shift: 'Morning', location: 'Home' };

    const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

    const getShiftIcon = (shift: string) => {
        switch (shift) {
            case 'Morning': return <Sun className="w-3 h-3" />;
            case 'Afternoon': return <Briefcase className="w-3 h-3" />;
            case 'Night': return <Moon className="w-3 h-3" />;
            case 'Off': return <Coffee className="w-3 h-3" />;
            default: return null;
        }
    };

    const getShiftColor = (shift: string) => {
        switch (shift) {
            case 'Morning': return 'text-amber-400 bg-amber-950/30';
            case 'Afternoon': return 'text-cyan-400 bg-cyan-950/30';
            case 'Night': return 'text-purple-400 bg-purple-950/30';
            case 'Off': return 'text-slate-500 bg-slate-900/30';
            default: return 'text-slate-600';
        }
    };

    return (
        <div className="p-4 space-y-6 pb-24 animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CalendarDays className="w-6 h-6 text-cyan-400" />
                        Schedule
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Plan your week ahead</p>
                </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-slate-900 rounded-xl p-3 border border-slate-800">
                <button
                    onClick={handlePrevWeek}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-white">{format(currentDate, 'MMMM yyyy')}</h2>
                    <p className="text-xs text-slate-500">Week {format(startOfCurrentWeek, 'w')}</p>
                </div>
                <button
                    onClick={handleNextWeek}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Week Grid */}
            <div className="space-y-2">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                        <div key={i} className="text-center text-xs font-bold text-slate-500 py-2 uppercase tracking-wider">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const history = shiftHistory[dateStr];
                        const dayLog = logs[dateStr];
                        const isSelected = isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);
                        const hasWorkout = dayLog?.workoutDone;

                        return (
                            <button
                                key={dateStr}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "aspect-square rounded-xl flex flex-col items-center justify-center relative border-2 transition-all p-2",
                                    isSelected
                                        ? "border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-900/20 scale-105"
                                        : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/50",
                                    isTodayDate && !isSelected && "border-cyan-500/50 bg-slate-800/30",
                                    !history && "opacity-60"
                                )}
                            >
                                {/* Date number */}
                                <span className={cn(
                                    "text-sm font-bold mb-1",
                                    isSelected ? "text-cyan-400" : isTodayDate ? "text-cyan-400" : "text-slate-300"
                                )}>
                                    {format(day, 'd')}
                                </span>

                                {/* Shift indicator */}
                                {history && (
                                    <div className={cn(
                                        "flex items-center justify-center w-6 h-6 rounded-full",
                                        getShiftColor(history.shift)
                                    )}>
                                        {getShiftIcon(history.shift)}
                                    </div>
                                )}

                                {/* Workout indicator */}
                                {hasWorkout && (
                                    <div className="absolute top-1 right-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
                                    </div>
                                )}

                                {/* Today indicator */}
                                {isTodayDate && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                                        <div className="w-1 h-1 rounded-full bg-cyan-400" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-xs text-slate-500">Today</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-slate-500">Workout</span>
                    </div>
                </div>
            </div>

            {/* Selected Date Editor */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 p-5 rounded-2xl border border-slate-800 shadow-xl">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {isToday(selectedDate) && (
                                <span className="px-2 py-0.5 bg-cyan-950/50 border border-cyan-500/50 rounded text-xs text-cyan-400 font-bold">
                                    TODAY
                                </span>
                            )}
                            {format(selectedDate, 'EEEE')}
                        </h3>
                        <span className="text-sm font-mono text-slate-400">{format(selectedDate, 'MMM d, yyyy')}</span>
                    </div>
                    <p className="text-xs text-slate-500">Set your schedule for this day</p>
                </div>

                <ShiftSelector
                    value={{ shift: selectedDayState.shift, location: selectedDayState.location }}
                    onChange={(val) => setShift(selectedDateStr, val.shift, val.location)}
                />
            </div>

            {/* Quick Stats */}
            {logs[selectedDateStr] && (
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3">Day Summary</p>
                    <div className="grid grid-cols-3 gap-3">
                        {logs[selectedDateStr].workoutDone && (
                            <div className="text-center">
                                <div className="text-emerald-400 text-lg font-bold">✓</div>
                                <p className="text-xs text-slate-500 mt-1">Workout</p>
                            </div>
                        )}
                        {logs[selectedDateStr].steps > 0 && (
                            <div className="text-center">
                                <div className="text-purple-400 text-sm font-bold">
                                    {logs[selectedDateStr].steps.toLocaleString()}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Steps</p>
                            </div>
                        )}
                        {logs[selectedDateStr].water && logs[selectedDateStr].water! > 0 && (
                            <div className="text-center">
                                <div className="text-cyan-400 text-sm font-bold">
                                    {logs[selectedDateStr].water}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Water</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
