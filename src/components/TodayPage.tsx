import { useState, useEffect, useRef } from 'react';
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks, isToday } from 'date-fns';
import { useStore, type MealType, type PriorityLevel, type ReminderRepeat, type Task, type MoodType, type DailyLog, type HabitEntry } from '../store';
import { scheduleTaskReminder, cancelTaskReminder } from '../lib/notifications';
import { isPedometerAvailable, startPedometer } from '../lib/pedometer';
import { ShiftSelector } from './ShiftSelector';
import { calculateUserLevel } from '../lib/gamification';
import { cn } from '../lib/utils';
import {
    Plus, Trash2, CheckCircle2, Circle, Clock,
    ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    StickyNote, Edit2, X, Save, Bell, BellOff,
    Sun, Moon, Coffee, Cookie, Briefcase, Dumbbell, Utensils,
    Droplet, Minus, BedDouble, Trophy, Settings2, Flame, Footprints,
} from 'lucide-react';

const MOODS: { id: MoodType; emoji: string; label: string; color: string; bg: string; border: string }[] = [
    { id: 'dead',  emoji: '💀', label: 'Dead',  color: 'text-slate-400',  bg: 'bg-slate-900/60',   border: 'border-slate-600'    },
    { id: 'low',   emoji: '😴', label: 'Low',   color: 'text-blue-400',   bg: 'bg-blue-950/30',    border: 'border-blue-700/50'  },
    { id: 'okay',  emoji: '😐', label: 'Okay',  color: 'text-yellow-400', bg: 'bg-yellow-950/30',  border: 'border-yellow-700/50'},
    { id: 'good',  emoji: '💪', label: 'Good',  color: 'text-emerald-400',bg: 'bg-emerald-950/30', border: 'border-emerald-700/50'},
    { id: 'fired', emoji: '🔥', label: 'Fired', color: 'text-orange-400', bg: 'bg-orange-950/30',  border: 'border-orange-700/50'},
];

function computeStreak(habitId: string, logs: Record<string, DailyLog>, fromDate: string): number {
    let streak = 0;
    let current = fromDate;
    while (true) {
        if (!logs[current]?.habitLog?.[habitId]?.done) break;
        streak++;
        const [y, m, d] = current.split('-').map(Number);
        const prev = new Date(y, m - 1, d - 1);
        current = format(prev, 'yyyy-MM-dd');
    }
    return streak;
}

const PRIORITY_CONFIG: Record<PriorityLevel, {
    label: string; color: string; bgColor: string;
    borderColor: string; hoverBorder: string;
    sectionBg: string; sectionBorder: string; icon: string;
}> = {
    critical: { label: 'Critical', color: 'text-red-400',    bgColor: 'bg-red-950/30',    borderColor: 'border-red-800/50',    hoverBorder: 'hover:border-red-700',    sectionBg: 'bg-red-950/20',    sectionBorder: 'border-red-800/30',    icon: '🔴' },
    high:     { label: 'High',     color: 'text-orange-400', bgColor: 'bg-orange-950/30', borderColor: 'border-orange-800/50', hoverBorder: 'hover:border-orange-700', sectionBg: 'bg-orange-950/20', sectionBorder: 'border-orange-800/30', icon: '🟠' },
    medium:   { label: 'Medium',   color: 'text-yellow-400', bgColor: 'bg-yellow-950/30', borderColor: 'border-yellow-800/50', hoverBorder: 'hover:border-yellow-700', sectionBg: 'bg-yellow-950/20', sectionBorder: 'border-yellow-800/30', icon: '🟡' },
    low:      { label: 'Low',      color: 'text-slate-400',  bgColor: 'bg-slate-950/30',  borderColor: 'border-slate-800/50',  hoverBorder: 'hover:border-slate-700',  sectionBg: 'bg-slate-950/20',  sectionBorder: 'border-slate-800/30',  icon: '⚪' },
};

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS = [1, 2, 3, 4, 5];
const REPEAT_OPTS: { value: ReminderRepeat; label: string }[] = [
    { value: 'none', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'custom', label: 'Custom' },
];

const BLANK = {
    title: '', notes: '',
    priority: 'medium' as PriorityLevel,
    reminderTime: '', reminderEnabled: false,
    reminderRepeat: 'none' as ReminderRepeat,
    reminderDays: [] as number[],
};
type FormState = typeof BLANK;

function PriorityPicker({ value, onChange }: { value: PriorityLevel; onChange: (p: PriorityLevel) => void }) {
    return (
        <div className="grid grid-cols-4 gap-2">
            {(['critical', 'high', 'medium', 'low'] as PriorityLevel[]).map(p => (
                <button key={p} onClick={() => onChange(p)}
                    className={`p-2.5 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                        value === p
                            ? `${PRIORITY_CONFIG[p].bgColor} ${PRIORITY_CONFIG[p].borderColor} scale-105`
                            : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                    }`}>
                    <span className="text-lg">{PRIORITY_CONFIG[p].icon}</span>
                    <span className={`text-[10px] font-bold uppercase ${value === p ? PRIORITY_CONFIG[p].color : 'text-slate-600'}`}>
                        {PRIORITY_CONFIG[p].label}
                    </span>
                </button>
            ))}
        </div>
    );
}

function ReminderFields({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
    const toggleDay = (d: number) => {
        const days = form.reminderDays.includes(d)
            ? form.reminderDays.filter(x => x !== d)
            : [...form.reminderDays, d];
        setForm({ ...form, reminderDays: days });
    };
    const activeDays = form.reminderRepeat === 'daily' ? [0,1,2,3,4,5,6]
        : form.reminderRepeat === 'weekdays' ? WEEKDAYS
        : form.reminderDays;

    return (
        <div className="space-y-3">
            <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2">
                <Clock className="w-3 h-3" /> Reminder
            </label>
            <input type="time" value={form.reminderTime}
                onChange={e => setForm({ ...form, reminderTime: e.target.value, reminderEnabled: !!e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {form.reminderTime && (
                <>
                    <div className="grid grid-cols-4 gap-1.5">
                        {REPEAT_OPTS.map(({ value, label }) => (
                            <button key={value}
                                onClick={() => setForm({ ...form, reminderRepeat: value, reminderDays: value === 'custom' ? form.reminderDays : [] })}
                                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                    form.reminderRepeat === value
                                        ? 'bg-cyan-950/50 text-cyan-400 border-cyan-800/50'
                                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'
                                }`}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {DAYS_SHORT.map((day, i) => {
                            const active = activeDays.includes(i);
                            const isCustom = form.reminderRepeat === 'custom';
                            return (
                                <button key={day} onClick={() => isCustom && toggleDay(i)} disabled={!isCustom}
                                    className={`py-2 rounded-md text-[10px] font-bold transition-all ${
                                        active ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-500'
                                    } ${isCustom ? 'hover:bg-cyan-800 cursor-pointer' : 'cursor-default'}`}>
                                    {day[0]}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-slate-500">
                        {form.reminderRepeat === 'none'     && 'Reminds once at the set time'}
                        {form.reminderRepeat === 'daily'    && 'Reminds every day'}
                        {form.reminderRepeat === 'weekdays' && 'Reminds Mon – Fri'}
                        {form.reminderRepeat === 'custom'   && (form.reminderDays.length === 0
                            ? 'Tap days above to pick'
                            : `Reminds on: ${form.reminderDays.sort().map(d => DAYS_SHORT[d]).join(', ')}`)}
                    </p>
                </>
            )}
        </div>
    );
}

const shiftIcon = (shift: string) => {
    switch (shift) {
        case 'Morning':   return <Sun className="w-3 h-3" />;
        case 'Afternoon': return <Briefcase className="w-3 h-3" />;
        case 'Night':     return <Moon className="w-3 h-3" />;
        case 'Off':       return <Coffee className="w-3 h-3" />;
        default: return null;
    }
};
const shiftColor = (shift: string) => {
    switch (shift) {
        case 'Morning':   return 'text-amber-400 bg-amber-950/30';
        case 'Afternoon': return 'text-cyan-400 bg-cyan-950/30';
        case 'Night':     return 'text-purple-400 bg-purple-950/30';
        case 'Off':       return 'text-slate-500 bg-slate-900/30';
        default: return 'text-slate-600';
    }
};

const getMealIcon = (mealType: MealType) => {
    switch (mealType) {
        case 'Breakfast': return <Coffee className="w-4 h-4" />;
        case 'Lunch':     return <Sun className="w-4 h-4" />;
        case 'Dinner':    return <Moon className="w-4 h-4" />;
        case 'Snack':     return <Cookie className="w-4 h-4" />;
    }
};
const getMealColor = (mealType: MealType) => {
    switch (mealType) {
        case 'Breakfast': return 'text-amber-400';
        case 'Lunch':     return 'text-orange-400';
        case 'Dinner':    return 'text-purple-400';
        case 'Snack':     return 'text-pink-400';
    }
};

export function TodayPage() {
    const {
        logs, logDay, shiftHistory, setShift,
        addTask, deleteTask, toggleTaskComplete, updateTask,
        habits, toggleHabit, updateHabitEntry, addHabit, removeHabit, setMood,
        weeklyIntentions, setWeeklyIntention,
    } = useStore();
    const { progress } = calculateUserLevel(logs);

    // ── Calendar ─────────────────────────────────────────────────────────────
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentWeek, setCurrentWeek]   = useState(new Date());
    const dateStr   = format(selectedDate, 'yyyy-MM-dd');
    const log       = logs[dateStr];
    const dayShift  = shiftHistory[dateStr] || { shift: 'Morning', location: 'Home' };
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekDays  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    // ── Log data ──────────────────────────────────────────────────────────────
    const exercises  = log?.exercises || [];
    const foodLog    = log?.foodLog   || [];
    const waterCount = log?.water     || 0;
    const sleepHours = log?.sleep     || 0;
    const tasks      = log?.tasks     || [];

    // ── Pedometer ─────────────────────────────────────────────────────────────
    const [pedometerAvailable, setPedometerAvailable] = useState(false);
    const [pedometerActive,    setPedometerActive]    = useState(false);
    const stopPedometerRef = useRef<(() => void) | null>(null);
    const sessionBaseRef   = useRef<number>(0);

    useEffect(() => {
        isPedometerAvailable().then(setPedometerAvailable);
    }, []);

    // reset session base when date changes
    useEffect(() => {
        sessionBaseRef.current = logs[dateStr]?.steps || 0;
    }, [dateStr, logs]);

    const handleStartPedometer = async () => {
        if (stopPedometerRef.current) {
            stopPedometerRef.current();
            stopPedometerRef.current = null;
            setPedometerActive(false);
            return;
        }
        sessionBaseRef.current = logs[dateStr]?.steps || 0;
        const stop = await startPedometer((sensorSteps) => {
            logDay(dateStr, { steps: sessionBaseRef.current + sensorSteps });
        });
        if (stop) {
            stopPedometerRef.current = stop;
            setPedometerActive(true);
        }
    };

    // stop pedometer on unmount
    useEffect(() => {
        return () => { stopPedometerRef.current?.(); };
    }, []);

    // ── Weekly intention ──────────────────────────────────────────────────────
    const weekKey = format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const weekIntention = weeklyIntentions[weekKey];
    const [intentionInput, setIntentionInput] = useState('');

    // ── Habits ────────────────────────────────────────────────────────────────
    const [showManageHabits, setShowManageHabits] = useState(false);
    const [newHabitName,     setNewHabitName]     = useState('');
    const [newHabitEmoji,    setNewHabitEmoji]    = useState('');

    // ── Input state ───────────────────────────────────────────────────────────
    const [exercise,         setExercise]         = useState('');
    const [count,            setCount]            = useState('');
    const [foodItem,         setFoodItem]         = useState('');
    const [selectedMealType, setSelectedMealType] = useState<MealType>('Breakfast');

    useEffect(() => {
        setExercise('');
        setCount('');
        setFoodItem('');
    }, [dateStr]);

    // ── Task form ─────────────────────────────────────────────────────────────
    const [showAddForm, setShowAddForm] = useState(false);
    const [addForm,     setAddForm]     = useState<FormState>({ ...BLANK });
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editForm,    setEditForm]    = useState<FormState>({ ...BLANK });
    const [expanded,    setExpanded]    = useState<Record<PriorityLevel, boolean>>({
        critical: true, high: true, medium: true, low: false,
    });

    // ── Exercise handlers ─────────────────────────────────────────────────────
    const handleAddExercise = () => {
        if (!exercise || !count) return;
        const updated = [...exercises, { id: crypto.randomUUID(), name: exercise, count, completed: false }];
        logDay(dateStr, { exercises: updated, workoutDone: true });
        setExercise(''); setCount('');
    };
    const handleDeleteExercise = (id: string) => {
        const updated = exercises.filter(ex => ex.id !== id);
        logDay(dateStr, { exercises: updated, workoutDone: updated.length > 0 });
    };
    const handleToggleExercise = (id: string) => {
        logDay(dateStr, { exercises: exercises.map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex) });
    };

    // ── Food handlers ─────────────────────────────────────────────────────────
    const handleAddFood = () => {
        if (!foodItem) return;
        const updated = [...foodLog, {
            id: crypto.randomUUID(), item: foodItem,
            mealType: selectedMealType, time: format(new Date(), 'HH:mm'),
        }];
        logDay(dateStr, { foodLog: updated });
        setFoodItem('');
    };
    const handleDeleteFood = (id: string) => {
        logDay(dateStr, { foodLog: foodLog.filter(f => f.id !== id) });
    };

    // ── Task handlers ─────────────────────────────────────────────────────────
    const handleAddTask = async () => {
        if (!addForm.title.trim()) return;
        const id = crypto.randomUUID();
        addTask(dateStr, {
            id, title: addForm.title, notes: addForm.notes || undefined,
            priority: addForm.priority, completed: false,
            reminderEnabled: !!addForm.reminderTime,
            reminderTime: addForm.reminderTime || undefined,
            reminderRepeat: addForm.reminderRepeat,
            reminderDays: addForm.reminderDays,
        });
        if (addForm.reminderTime) {
            await scheduleTaskReminder({
                id, title: addForm.title, notes: addForm.notes || undefined,
                reminderTime: addForm.reminderTime, reminderEnabled: true,
                reminderRepeat: addForm.reminderRepeat, reminderDays: addForm.reminderDays,
            });
        }
        setAddForm({ ...BLANK });
        setShowAddForm(false);
    };

    const openEdit = (task: Task) => {
        setEditingTask(task);
        setEditForm({
            title: task.title, notes: task.notes ?? '',
            priority: task.priority,
            reminderTime: task.reminderTime ?? '',
            reminderEnabled: task.reminderEnabled,
            reminderRepeat: task.reminderRepeat ?? 'none',
            reminderDays: task.reminderDays ?? [],
        });
    };

    const handleSaveEdit = async () => {
        if (!editingTask || !editForm.title.trim()) return;
        updateTask(dateStr, editingTask.id, {
            title: editForm.title, notes: editForm.notes || undefined,
            priority: editForm.priority,
            reminderEnabled: !!editForm.reminderTime,
            reminderTime: editForm.reminderTime || undefined,
            reminderRepeat: editForm.reminderRepeat,
            reminderDays: editForm.reminderDays,
        });
        if (editForm.reminderTime) {
            await scheduleTaskReminder({
                id: editingTask.id, title: editForm.title, notes: editForm.notes || undefined,
                reminderTime: editForm.reminderTime, reminderEnabled: true,
                reminderRepeat: editForm.reminderRepeat, reminderDays: editForm.reminderDays,
            });
        } else {
            await cancelTaskReminder(editingTask.id);
        }
        setEditingTask(null);
    };

    const reminderLabel = (task: Task) => {
        if (!task.reminderTime || !task.reminderEnabled) return null;
        const r = task.reminderRepeat ?? 'none';
        if (r === 'none')     return task.reminderTime;
        if (r === 'daily')    return `${task.reminderTime} · Daily`;
        if (r === 'weekdays') return `${task.reminderTime} · Weekdays`;
        const days = (task.reminderDays ?? []).sort().map(d => DAYS_SHORT[d]).join(',');
        return `${task.reminderTime} · ${days || 'Custom'}`;
    };

    return (
        <div className="px-4 pt-4 pb-24 space-y-6 animate-fade-up">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight glow-text-cyan">
                        {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEE, MMM d')}
                    </h1>
                    <p className="text-slate-400 font-medium text-sm mt-1">
                        {isToday(selectedDate) ? format(selectedDate, 'EEEE, MMM do') : format(selectedDate, 'yyyy')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {!isToday(selectedDate) && (
                        <button
                            onClick={() => { setSelectedDate(new Date()); setCurrentWeek(new Date()); }}
                            className="text-xs font-bold text-cyan-400 border border-cyan-800/50 px-3 py-1.5 rounded-lg hover:bg-cyan-950/30 transition-colors"
                        >
                            Today
                        </button>
                    )}
                    <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg flex flex-col items-center glow-border-cyan">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Streak</span>
                        <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold">
                            <Trophy className="w-3 h-3" />
                            <span>{Math.floor(progress)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Week Strip ─────────────────────────────────────────────── */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-3">
                <div className="flex items-center justify-between">
                    <button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-white">{format(weekStart, 'MMMM yyyy')}</span>
                    <button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                        <div key={i} className="text-center text-[10px] font-bold text-slate-500 uppercase">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(day => {
                        const ds     = format(day, 'yyyy-MM-dd');
                        const isSel  = isSameDay(day, selectedDate);
                        const isNow  = isToday(day);
                        const shift  = shiftHistory[ds];
                        const tCount = (logs[ds]?.tasks ?? []).filter(t => !t.completed).length;
                        return (
                            <button key={ds} onClick={() => setSelectedDate(day)}
                                className={cn(
                                    'rounded-xl flex flex-col items-center justify-center py-2 gap-0.5 border-2 transition-all',
                                    isSel  ? 'border-cyan-500 bg-cyan-950/40 scale-105'
                                           : isNow ? 'border-cyan-500/40 bg-slate-800/40'
                                                   : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800/30'
                                )}>
                                <span className={cn('text-sm font-bold',
                                    isSel ? 'text-cyan-400' : isNow ? 'text-cyan-300' : 'text-slate-300')}>
                                    {format(day, 'd')}
                                </span>
                                {shift ? (
                                    <div className={cn('w-4 h-4 rounded-full flex items-center justify-center', shiftColor(shift.shift))}>
                                        {shiftIcon(shift.shift)}
                                    </div>
                                ) : <div className="w-4 h-4" />}
                                {tCount > 0 && (
                                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/60 px-1 rounded">
                                        {tCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Shift + Location (compact, below calendar) ─────────────── */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 space-y-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Shift &amp; Location — {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d')}
                </p>
                <ShiftSelector
                    value={{ shift: dayShift.shift, location: dayShift.location }}
                    onChange={val => setShift(dateStr, val.shift, val.location)}
                />
            </div>

            {/* ── Weekly Intention ───────────────────────────────────────── */}
            <div className="bg-slate-900/40 border border-amber-800/30 rounded-xl p-3 space-y-2">
                <p className="text-[10px] text-amber-500/70 uppercase font-bold tracking-wider">Weekly Intention</p>
                {weekIntention?.intention ? (
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-slate-300 italic flex-1">"{weekIntention.intention}"</p>
                        <button onClick={() => setWeeklyIntention(weekKey, '')}
                            className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0 mt-0.5">
                            <X className="w-3.5 h-3.5" />
                        </button>
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
                        placeholder="Set intention for this week…"
                        className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none border-b border-slate-800 pb-1"
                    />
                )}
            </div>

            {/* ── Mood & Energy ───────────────────────────────────────────── */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 space-y-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mood & Energy</p>
                <div className="grid grid-cols-5 gap-1.5">
                    {MOODS.map(m => {
                        const active = log?.mood === m.id;
                        return (
                            <button key={m.id}
                                onClick={() => setMood(dateStr, m.id)}
                                className={cn(
                                    'flex flex-col items-center gap-1 py-2 rounded-lg border transition-all',
                                    active
                                        ? `${m.bg} ${m.border}`
                                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                                )}>
                                <span className="text-lg leading-none">{m.emoji}</span>
                                <span className={`text-[9px] font-bold leading-none ${active ? m.color : 'text-slate-500'}`}>
                                    {m.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ══ TASKS ══════════════════════════════════════════════════════ */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold uppercase tracking-wider text-sm text-cyan-400">Tasks</h2>
                    {tasks.length > 0 && (
                        <span className="text-xs text-slate-500">
                            <span className="text-emerald-400 font-bold">{tasks.filter(t => t.completed).length}</span>
                            <span className="text-slate-600"> / </span>
                            <span className="text-white font-bold">{tasks.length}</span>
                            <span> done</span>
                        </span>
                    )}
                </div>

                <button onClick={() => setShowAddForm(v => !v)}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-700/40 hover:bg-cyan-700/60 border border-cyan-800/50 text-cyan-300 font-bold py-2.5 rounded-lg transition-colors text-sm">
                    {showAddForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Task</>}
                </button>

                {showAddForm && (
                    <div className="bg-slate-900/50 border border-cyan-800/50 rounded-lg p-4 space-y-4">
                        <input value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })}
                            placeholder="Task title..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddTask()}
                        />
                        <div className="relative">
                            <StickyNote className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <textarea value={addForm.notes} onChange={e => setAddForm({ ...addForm, notes: e.target.value })}
                                placeholder="Notes (optional)..." rows={2}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 uppercase font-bold">Priority</label>
                            <PriorityPicker value={addForm.priority} onChange={p => setAddForm({ ...addForm, priority: p })} />
                        </div>
                        <ReminderFields form={addForm} setForm={setAddForm} />
                        <div className="flex gap-2 pt-1">
                            <button onClick={handleAddTask} disabled={!addForm.title.trim()}
                                className="flex-1 bg-cyan-700/50 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-600 text-cyan-100 font-bold py-3 rounded-lg transition-colors">
                                Add Task
                            </button>
                            <button onClick={() => { setShowAddForm(false); setAddForm({ ...BLANK }); }}
                                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {tasks.length === 0 ? (
                    <p className="text-xs text-slate-600 italic pl-1 py-1">
                        No tasks for {isToday(selectedDate) ? 'today' : format(selectedDate, 'MMM d')}.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {(['critical', 'high', 'medium', 'low'] as PriorityLevel[]).map(priority => {
                            const pts = tasks.filter(t => t.priority === priority);
                            if (pts.length === 0) return null;
                            const cfg = PRIORITY_CONFIG[priority];
                            return (
                                <div key={priority} className={`border ${cfg.sectionBorder} rounded-lg overflow-hidden`}>
                                    <button
                                        onClick={() => setExpanded(p => ({ ...p, [priority]: !p[priority] }))}
                                        className={`w-full ${cfg.sectionBg} border-b ${cfg.sectionBorder} px-4 py-2.5 flex items-center justify-between`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{cfg.icon}</span>
                                            <div className="text-left">
                                                <h3 className={`font-bold uppercase text-xs ${cfg.color}`}>{cfg.label}</h3>
                                                <p className="text-[10px] text-slate-500">
                                                    {pts.filter(t => !t.completed).length} pending · {pts.filter(t => t.completed).length} done
                                                </p>
                                            </div>
                                        </div>
                                        {expanded[priority]
                                            ? <ChevronUp className={`w-4 h-4 ${cfg.color}`} />
                                            : <ChevronDown className={`w-4 h-4 ${cfg.color}`} />}
                                    </button>
                                    {expanded[priority] && (
                                        <div className="p-2 space-y-2 bg-slate-900/30">
                                            {pts.map(task => {
                                                const label = reminderLabel(task);
                                                return (
                                                    <div key={task.id}
                                                        className={`rounded-lg border transition-all ${
                                                            task.completed
                                                                ? 'bg-slate-900/30 border-slate-800/50'
                                                                : `${cfg.bgColor} ${cfg.borderColor} ${cfg.hoverBorder}`
                                                        }`}>
                                                        <div className="p-3 flex items-start gap-3">
                                                            <button onClick={async () => {
                                                                toggleTaskComplete(dateStr, task.id);
                                                                if (!task.completed) await cancelTaskReminder(task.id);
                                                            }} className="flex-shrink-0 mt-0.5">
                                                                {task.completed
                                                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                                    : <Circle className={`w-5 h-5 ${cfg.color} hover:text-emerald-400`} />}
                                                            </button>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm font-semibold ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                                    {task.title}
                                                                </p>
                                                                {task.notes && (
                                                                    <p className={`text-xs mt-1 ${task.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                                                                        {task.notes}
                                                                    </p>
                                                                )}
                                                                {label && (
                                                                    <div className="flex items-center gap-1 mt-1.5">
                                                                        <Bell className="w-3 h-3 text-cyan-500" />
                                                                        <span className="text-[11px] text-cyan-400 font-mono">{label}</span>
                                                                    </div>
                                                                )}
                                                                {task.reminderTime && !task.reminderEnabled && (
                                                                    <div className="flex items-center gap-1 mt-1.5">
                                                                        <BellOff className="w-3 h-3 text-slate-600" />
                                                                        <span className="text-[11px] text-slate-600 font-mono">{task.reminderTime} (off)</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                                                <button onClick={() => openEdit(task)}
                                                                    className="p-2 text-slate-400 hover:text-cyan-400 active:text-cyan-400 transition-colors">
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={async () => {
                                                                    await cancelTaskReminder(task.id);
                                                                    deleteTask(dateStr, task.id);
                                                                }} className="p-2 text-slate-400 hover:text-red-400 active:text-red-400 transition-colors">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══ EXERCISE ═══════════════════════════════════════════════════ */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Dumbbell className="w-5 h-5" />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Exercise</h2>
                    </div>
                    {exercises.length > 0 && (
                        <span className="text-xs font-mono text-slate-500">
                            {exercises.filter(ex => ex.completed).length}/{exercises.length} done
                        </span>
                    )}
                </div>
                <div className="space-y-2">
                    <input value={exercise} onChange={e => setExercise(e.target.value)}
                        placeholder="Workout..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <input value={count} onChange={e => setCount(e.target.value)}
                        placeholder="Count / reps..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        onKeyDown={e => e.key === 'Enter' && handleAddExercise()}
                    />
                    <button onClick={handleAddExercise}
                        className="w-full bg-emerald-700/50 hover:bg-emerald-600 text-emerald-100 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                {exercises.length === 0 ? (
                    <p className="text-xs text-slate-600 italic pl-1">No workout logged.</p>
                ) : (
                    <div className="space-y-2">
                        {exercises.map(ex => (
                            <div key={ex.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                    ex.completed
                                        ? 'bg-emerald-950/20 border-emerald-800/30'
                                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                }`}>
                                <div className="flex items-center gap-3 flex-1">
                                    <button onClick={() => handleToggleExercise(ex.id!)} className="flex-shrink-0">
                                        {ex.completed
                                            ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            : <Circle className="w-5 h-5 text-slate-600 hover:text-emerald-400" />}
                                    </button>
                                    <span className={`text-sm ${ex.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                        {ex.name} <span className="text-slate-600">× {ex.count}</span>
                                    </span>
                                </div>
                                <button onClick={() => handleDeleteExercise(ex.id!)}
                                    className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ══ FOOD ═══════════════════════════════════════════════════════ */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-400">
                        <Utensils className="w-5 h-5" />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Food</h2>
                    </div>
                    {foodLog.length > 0 && (
                        <span className="text-xs font-mono text-slate-500">{foodLog.length} entries</span>
                    )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map(m => (
                        <button key={m} onClick={() => setSelectedMealType(m)}
                            className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                                selectedMealType === m
                                    ? 'bg-orange-950/30 border-orange-500/50 scale-105'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                            }`}>
                            <div className={selectedMealType === m ? getMealColor(m) : 'text-slate-600'}>
                                {getMealIcon(m)}
                            </div>
                            <span className={`text-[9px] font-bold uppercase ${selectedMealType === m ? 'text-orange-400' : 'text-slate-600'}`}>
                                {m === 'Breakfast' ? 'BF' : m === 'Lunch' ? 'LN' : m === 'Dinner' ? 'DN' : 'SN'}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input value={foodItem} onChange={e => setFoodItem(e.target.value)}
                        placeholder={`Add ${selectedMealType.toLowerCase()}...`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                        onKeyDown={e => e.key === 'Enter' && handleAddFood()}
                    />
                    <button onClick={handleAddFood}
                        className="bg-orange-700/50 hover:bg-orange-600 text-orange-100 px-4 rounded-lg flex items-center justify-center transition-colors">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                {foodLog.length === 0 ? (
                    <p className="text-xs text-slate-600 italic pl-1">No food logged.</p>
                ) : (
                    <div className="space-y-2">
                        {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map(m => {
                            const items = foodLog.filter(f => f.mealType === m);
                            if (items.length === 0) return null;
                            return (
                                <div key={m} className="space-y-1.5">
                                    <div className={`flex items-center gap-2 text-xs font-bold uppercase ${getMealColor(m)}`}>
                                        {getMealIcon(m)}<span>{m}</span>
                                    </div>
                                    {items.map(food => (
                                        <div key={food.id}
                                            className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg border border-slate-800">
                                            <div className="flex items-center gap-2 flex-1">
                                                <span className="text-sm text-slate-300">{food.item}</span>
                                                {food.time && <span className="text-xs text-slate-600 font-mono">{food.time}</span>}
                                            </div>
                                            <button onClick={() => handleDeleteFood(food.id)}
                                                className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══ WATER ══════════════════════════════════════════════════════ */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-cyan-400">
                    <Droplet className="w-5 h-5" />
                    <h2 className="font-bold uppercase tracking-wider text-sm">Water</h2>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center justify-between">
                    <button onClick={() => logDay(dateStr, { water: Math.max(0, waterCount - 1) })}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-cyan-500/50 transition-colors">
                        <Minus className="w-6 h-6 text-slate-400" />
                    </button>
                    <div className="text-center">
                        <span className="text-4xl font-bold text-white">{waterCount}</span>
                        <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-1">Glasses</p>
                    </div>
                    <button onClick={() => logDay(dateStr, { water: waterCount + 1 })}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-cyan-500/50 transition-colors">
                        <Plus className="w-6 h-6 text-cyan-400" />
                    </button>
                </div>
            </div>

            {/* ══ SLEEP ══════════════════════════════════════════════════════ */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-indigo-400">
                    <BedDouble className="w-5 h-5" />
                    <h2 className="font-bold uppercase tracking-wider text-sm">Sleep</h2>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center justify-between">
                    <button onClick={() => logDay(dateStr, { sleep: Math.max(0, sleepHours - 0.5) })}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-indigo-500/50 transition-colors">
                        <Minus className="w-6 h-6 text-slate-400" />
                    </button>
                    <div className="text-center">
                        <span className="text-4xl font-bold text-white">{sleepHours}</span>
                        <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Hours</p>
                    </div>
                    <button onClick={() => logDay(dateStr, { sleep: Math.min(24, sleepHours + 0.5) })}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-indigo-500/50 transition-colors">
                        <Plus className="w-6 h-6 text-indigo-400" />
                    </button>
                </div>
            </div>

            {/* ══ STEPS ══════════════════════════════════════════════════════ */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lime-400">
                        <Footprints className="w-5 h-5" />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Steps</h2>
                    </div>
                    {pedometerAvailable && (
                        <button
                            onClick={handleStartPedometer}
                            className={cn(
                                'text-xs font-bold px-3 py-1.5 rounded-lg border transition-all',
                                pedometerActive
                                    ? 'bg-red-950/30 border-red-700/50 text-red-400 hover:bg-red-950/50'
                                    : 'bg-lime-950/30 border-lime-700/50 text-lime-400 hover:bg-lime-950/50'
                            )}>
                            {pedometerActive ? 'Stop Tracking' : 'Start Tracking'}
                        </button>
                    )}
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center justify-between">
                    <button onClick={() => logDay(dateStr, { steps: Math.max(0, (log?.steps || 0) - 100) })}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-lime-500/50 transition-colors">
                        <Minus className="w-6 h-6 text-slate-400" />
                    </button>
                    <div className="text-center">
                        <span className="text-4xl font-bold text-white">{(log?.steps || 0).toLocaleString()}</span>
                        <p className="text-[10px] text-lime-500 font-bold uppercase tracking-widest mt-1">
                            {pedometerActive ? '● Live' : 'Steps'}
                        </p>
                        {(log?.steps || 0) >= 10000 && (
                            <p className="text-[10px] text-amber-400 font-bold mt-0.5">🎯 Goal reached!</p>
                        )}
                    </div>
                    <button onClick={() => logDay(dateStr, { steps: (log?.steps || 0) + 100 })}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-lime-500/50 transition-colors">
                        <Plus className="w-6 h-6 text-lime-400" />
                    </button>
                </div>

                {!pedometerAvailable && (
                    <p className="text-[11px] text-slate-600 italic pl-1">
                        Auto step tracking not available on this device. Use +/− to log manually.
                    </p>
                )}
            </div>

            {/* ══ HABITS ═════════════════════════════════════════════════════ */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-violet-400">
                        <Flame className="w-5 h-5" />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Habits</h2>
                    </div>
                    <button onClick={() => setShowManageHabits(v => !v)}
                        className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
                        <Settings2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-2">
                    {habits.map(habit => {
                        const entry: HabitEntry = log?.habitLog?.[habit.id] || { done: false };
                        const { done, note } = entry;
                        const streak = computeStreak(habit.id, logs, dateStr);
                        return (
                            <div key={habit.id}
                                className={cn(
                                    'rounded-lg border transition-all',
                                    done
                                        ? 'bg-violet-950/30 border-violet-600/50'
                                        : 'bg-slate-900/50 border-slate-800'
                                )}>
                                <button
                                    onClick={() => toggleHabit(dateStr, habit.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5">
                                    <span className="text-xl leading-none">{habit.emoji}</span>
                                    <span className={cn('flex-1 text-sm font-semibold text-left', done ? 'text-white' : 'text-slate-400')}>
                                        {habit.name}
                                    </span>
                                    {streak > 0 && (
                                        <span className="text-xs font-bold text-amber-400">🔥 {streak}</span>
                                    )}
                                    {done
                                        ? <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0" />
                                        : <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />}
                                </button>
                                {done && (
                                    <div className="px-3 pb-2.5">
                                        <input
                                            value={note || ''}
                                            onChange={e => updateHabitEntry(dateStr, habit.id, { note: e.target.value })}
                                            placeholder="Add a note…"
                                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-violet-500 transition-colors"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {showManageHabits && (
                    <div className="bg-slate-900/50 border border-violet-800/30 rounded-xl p-3 space-y-3">
                        <p className="text-[10px] text-violet-400/70 uppercase font-bold">Manage Habits</p>
                        <div className="space-y-1.5">
                            {habits.map(habit => (
                                <div key={habit.id} className="flex items-center gap-2">
                                    <span className="text-lg">{habit.emoji}</span>
                                    <span className="flex-1 text-sm text-slate-300">{habit.name}</span>
                                    <button onClick={() => removeHabit(habit.id)}
                                        className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={newHabitEmoji}
                                onChange={e => setNewHabitEmoji(e.target.value)}
                                placeholder="😊"
                                maxLength={2}
                                className="w-12 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-center text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                            />
                            <input value={newHabitName}
                                onChange={e => setNewHabitName(e.target.value)}
                                placeholder="New habit..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && newHabitName.trim()) {
                                        addHabit({ name: newHabitName.trim(), emoji: newHabitEmoji || '✅' });
                                        setNewHabitName(''); setNewHabitEmoji('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    if (!newHabitName.trim()) return;
                                    addHabit({ name: newHabitName.trim(), emoji: newHabitEmoji || '✅' });
                                    setNewHabitName(''); setNewHabitEmoji('');
                                }}
                                className="bg-violet-700/50 hover:bg-violet-600 text-violet-100 px-3 rounded-lg flex items-center justify-center transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ══ DAILY JOURNAL ══════════════════════════════════════════════ */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-violet-400">
                    <StickyNote className="w-5 h-5" />
                    <h2 className="font-bold uppercase tracking-wider text-sm">Daily Journal</h2>
                </div>
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-3">
                    <textarea
                        value={log?.dailyJournal || ''}
                        onChange={e => logDay(dateStr, { dailyJournal: e.target.value })}
                        placeholder="How was your day? How are you feeling?"
                        className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none min-h-[100px] resize-none"
                    />
                </div>
            </div>

            {/* ══ EDIT TASK MODAL ═════════════════════════════════════════════ */}
            {editingTask && (
                <>
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setEditingTask(null)} />
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 rounded-t-2xl max-h-[90vh] overflow-y-auto"
                        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-slate-700 rounded-full" />
                        </div>
                        <div className="px-4 pb-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">Edit Task</h2>
                                <button onClick={() => setEditingTask(null)} className="p-2 text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                placeholder="Task title..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <div className="relative">
                                <StickyNote className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                    placeholder="Notes..." rows={2}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">Change Priority</label>
                                <PriorityPicker value={editForm.priority} onChange={p => setEditForm({ ...editForm, priority: p })} />
                            </div>
                            <ReminderFields form={editForm} setForm={setEditForm} />
                            <button onClick={handleSaveEdit} disabled={!editForm.title.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-cyan-700/50 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-600 text-cyan-100 font-bold py-3 rounded-lg transition-colors">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
