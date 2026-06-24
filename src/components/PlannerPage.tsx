import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks, isToday } from 'date-fns';
import { useStore, type PriorityLevel, type ReminderRepeat, type Task } from '../store';
import { scheduleTaskReminder, cancelTaskReminder } from '../lib/notifications';
import { ShiftSelector } from './ShiftSelector';
import { cn } from '../lib/utils';
import {
    Plus, Trash2, CheckCircle2, Circle, Clock,
    ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    StickyNote, AlertCircle, Edit2, X, Save, Bell, BellOff,
    Sun, Moon, Coffee, Briefcase
} from 'lucide-react';

// ── priority config ───────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<PriorityLevel, {
    label: string; color: string; bgColor: string;
    borderColor: string; hoverBorder: string;
    sectionBg: string; sectionBorder: string; icon: string; order: number;
}> = {
    critical: { label: 'Critical', color: 'text-red-400', bgColor: 'bg-red-950/30', borderColor: 'border-red-800/50', hoverBorder: 'hover:border-red-700', sectionBg: 'bg-red-950/20', sectionBorder: 'border-red-800/30', icon: '🔴', order: 0 },
    high:     { label: 'High',     color: 'text-orange-400', bgColor: 'bg-orange-950/30', borderColor: 'border-orange-800/50', hoverBorder: 'hover:border-orange-700', sectionBg: 'bg-orange-950/20', sectionBorder: 'border-orange-800/30', icon: '🟠', order: 1 },
    medium:   { label: 'Medium',   color: 'text-yellow-400', bgColor: 'bg-yellow-950/30', borderColor: 'border-yellow-800/50', hoverBorder: 'hover:border-yellow-700', sectionBg: 'bg-yellow-950/20', sectionBorder: 'border-yellow-800/30', icon: '🟡', order: 2 },
    low:      { label: 'Low',      color: 'text-slate-400',  bgColor: 'bg-slate-950/30',  borderColor: 'border-slate-800/50',  hoverBorder: 'hover:border-slate-700',  sectionBg: 'bg-slate-950/20',  sectionBorder: 'border-slate-800/30',  icon: '⚪', order: 3 },
};

const DAYS_SHORT  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS    = [1, 2, 3, 4, 5];
const REPEAT_OPTS: { value: ReminderRepeat; label: string }[] = [
    { value: 'none',     label: 'Once'     },
    { value: 'daily',    label: 'Daily'    },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'custom',   label: 'Custom'   },
];

const BLANK = {
    title: '', notes: '',
    priority: 'medium' as PriorityLevel,
    reminderTime: '', reminderEnabled: false,
    reminderRepeat: 'none' as ReminderRepeat,
    reminderDays: [] as number[],
};
type FormState = typeof BLANK;

// ── small reusables ───────────────────────────────────────────────────────────
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
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
            {form.reminderTime && (
                <>
                    <div className="grid grid-cols-4 gap-1.5">
                        {REPEAT_OPTS.map(({ value, label }) => (
                            <button key={value}
                                onClick={() => setForm({ ...form, reminderRepeat: value, reminderDays: value === 'custom' ? form.reminderDays : [] })}
                                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                    form.reminderRepeat === value
                                        ? 'bg-sky-950/50 text-sky-400 border-sky-800/50'
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
                                        active ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-500'
                                    } ${isCustom ? 'hover:bg-sky-800 cursor-pointer' : 'cursor-default'}`}>
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

// ── shift icon helpers ────────────────────────────────────────────────────────
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
        case 'Afternoon': return 'text-sky-400 bg-sky-950/30';
        case 'Night':     return 'text-purple-400 bg-purple-950/30';
        case 'Off':       return 'text-slate-500 bg-slate-900/30';
        default: return 'text-slate-600';
    }
};

// ── main component ────────────────────────────────────────────────────────────
export function PlannerPage() {
    const { logs, shiftHistory, setShift, addTask, deleteTask, toggleTaskComplete, updateTask } = useStore();

    // ── date state ───────────────────────────────────────────────────────────
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentWeek, setCurrentWeek]   = useState(new Date());

    const dateStr        = format(selectedDate, 'yyyy-MM-dd');
    const tasks          = logs[dateStr]?.tasks || [];
    const dayShift       = shiftHistory[dateStr] || { shift: 'Morning', location: 'Home' };
    const weekStart      = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekDays       = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    // ── task form state ──────────────────────────────────────────────────────
    const [showAddForm,  setShowAddForm]  = useState(false);
    const [addForm,      setAddForm]      = useState<FormState>({ ...BLANK });
    const [editingTask,  setEditingTask]  = useState<Task | null>(null);
    const [editForm,     setEditForm]     = useState<FormState>({ ...BLANK });
    const [expanded, setExpanded]         = useState<Record<PriorityLevel, boolean>>({
        critical: true, high: true, medium: true, low: false
    });

    // ── add task ─────────────────────────────────────────────────────────────
    const handleAdd = async () => {
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

    // ── open edit ────────────────────────────────────────────────────────────
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

    // ── save edit ────────────────────────────────────────────────────────────
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

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        urgent: tasks.filter(t => (t.priority === 'critical' || t.priority === 'high') && !t.completed).length,
    };

    return (
        <div className="px-4 pt-4 pb-24 space-y-5 animate-fade-up">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight glow-text-cyan">Planner</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {isToday(selectedDate)
                            ? 'Today — ' + format(selectedDate, 'MMM d')
                            : format(selectedDate, 'EEEE, MMM d')}
                    </p>
                </div>
                {/* Today quick-jump */}
                {!isToday(selectedDate) && (
                    <button
                        onClick={() => { setSelectedDate(new Date()); setCurrentWeek(new Date()); }}
                        className="text-xs font-bold text-sky-400 border border-sky-800/50 px-3 py-1.5 rounded-lg hover:bg-sky-950/30 transition-colors"
                    >
                        Today
                    </button>
                )}
            </div>

            {/* ── Week Strip ─────────────────────────────────────────── */}
            <div className="glass-card rounded-xl p-3 space-y-3">
                {/* week nav */}
                <div className="flex items-center justify-between">
                    <button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                        className="p-1.5 text-slate-400 hover:text-sky-400 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-white">{format(weekStart, 'MMMM yyyy')}</span>
                    <button onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                        className="p-1.5 text-slate-400 hover:text-sky-400 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* day labels */}
                <div className="grid grid-cols-7 gap-1">
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                        <div key={i} className="text-center text-[10px] font-bold text-slate-500 uppercase">{d}</div>
                    ))}
                </div>

                {/* day cells */}
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(day => {
                        const ds     = format(day, 'yyyy-MM-dd');
                        const isSel  = isSameDay(day, selectedDate);
                        const isNow  = isToday(day);
                        const shift  = shiftHistory[ds];
                        const dayLog = logs[ds];
                        const taskCount = dayLog?.tasks?.filter(t => !t.completed).length ?? 0;

                        return (
                            <button key={ds} onClick={() => setSelectedDate(day)}
                                className={cn(
                                    'rounded-xl flex flex-col items-center justify-center py-2 gap-1 border-2 transition-all',
                                    isSel  ? 'border-sky-500 bg-sky-950/40 scale-105'
                                           : isNow ? 'border-sky-500/40 bg-slate-800/40'
                                                   : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800/30'
                                )}>
                                <span className={cn('text-sm font-bold',
                                    isSel ? 'text-sky-400' : isNow ? 'text-sky-300' : 'text-slate-300')}>
                                    {format(day, 'd')}
                                </span>

                                {/* shift dot */}
                                {shift ? (
                                    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center', shiftColor(shift.shift))}>
                                        {shiftIcon(shift.shift)}
                                    </div>
                                ) : <div className="w-5 h-5" />}

                                {/* task count badge */}
                                {taskCount > 0 && (
                                    <span className="text-[9px] font-bold text-sky-400 bg-sky-950/60 px-1 rounded">
                                        {taskCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* legend */}
                <div className="flex items-center justify-center gap-4 pt-1">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-sky-400" />
                        <span className="text-[10px] text-slate-500">Today</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-sky-400 font-bold">3</span>
                        <span className="text-[10px] text-slate-500">= pending tasks</span>
                    </div>
                </div>
            </div>

            {/* ── Task Stats ─────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total</p>
                    <p className="text-xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Done</p>
                    <p className="text-xl font-bold text-emerald-400">{stats.completed}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3" />Urgent
                    </p>
                    <p className="text-xl font-bold text-red-400">{stats.urgent}</p>
                </div>
            </div>

            {/* ── Add Task Button ─────────────────────────────────────── */}
            <button
                onClick={() => setShowAddForm(v => !v)}
                className="w-full flex items-center justify-center gap-2 bg-sky-700/40 hover:bg-sky-700/60 border border-sky-800/50 text-sky-300 font-bold py-3 rounded-lg transition-colors"
            >
                {showAddForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Task</>}
            </button>

            {/* ── Add Form ───────────────────────────────────────────── */}
            {showAddForm && (
                <div className="bg-slate-900/50 border border-sky-800/50 rounded-lg p-4 space-y-4">
                    <input value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })}
                        placeholder="Task title..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm font-semibold text-white focus:outline-none focus:border-sky-500 transition-colors"
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAdd()}
                    />
                    <div className="relative">
                        <StickyNote className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <textarea value={addForm.notes} onChange={e => setAddForm({ ...addForm, notes: e.target.value })}
                            placeholder="Notes (optional)..." rows={2}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Priority</label>
                        <PriorityPicker value={addForm.priority} onChange={p => setAddForm({ ...addForm, priority: p })} />
                    </div>
                    <ReminderFields form={addForm} setForm={setAddForm} />
                    <div className="flex gap-2 pt-1">
                        <button onClick={handleAdd} disabled={!addForm.title.trim()}
                            className="flex-1 bg-sky-700/50 hover:bg-sky-600 disabled:bg-slate-800 disabled:text-slate-600 text-sky-100 font-bold py-3 rounded-lg transition-colors">
                            Add Task
                        </button>
                        <button onClick={() => { setShowAddForm(false); setAddForm({ ...BLANK }); }}
                            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ── Tasks by Priority ──────────────────────────────────── */}
            {tasks.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-5xl mb-3">📋</div>
                    <p className="text-slate-600 text-sm italic">No tasks for {isToday(selectedDate) ? 'today' : format(selectedDate, 'MMM d')}.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {(['critical', 'high', 'medium', 'low'] as PriorityLevel[]).map(priority => {
                        const pts = tasks.filter(t => t.priority === priority);
                        if (pts.length === 0) return null;
                        const cfg = PRIORITY_CONFIG[priority];
                        return (
                            <div key={priority} className={`border ${cfg.sectionBorder} rounded-lg overflow-hidden`}>
                                {/* section header */}
                                <button
                                    onClick={() => setExpanded(p => ({ ...p, [priority]: !p[priority] }))}
                                    className={`w-full ${cfg.sectionBg} border-b ${cfg.sectionBorder} px-4 py-2.5 flex items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{cfg.icon}</span>
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

                                {/* task rows */}
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
                                                        {/* checkbox */}
                                                        <button onClick={async () => {
                                                            toggleTaskComplete(dateStr, task.id);
                                                            if (!task.completed) await cancelTaskReminder(task.id);
                                                        }} className="flex-shrink-0 mt-0.5">
                                                            {task.completed
                                                                ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                                : <Circle className={`w-5 h-5 ${cfg.color} hover:text-emerald-400`} />}
                                                        </button>

                                                        {/* content */}
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
                                                                    <Bell className="w-3 h-3 text-sky-500" />
                                                                    <span className="text-[11px] text-sky-400 font-mono">{label}</span>
                                                                </div>
                                                            )}
                                                            {task.reminderTime && !task.reminderEnabled && (
                                                                <div className="flex items-center gap-1 mt-1.5">
                                                                    <BellOff className="w-3 h-3 text-slate-600" />
                                                                    <span className="text-[11px] text-slate-600 font-mono">{task.reminderTime} (off)</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* actions */}
                                                        <div className="flex items-center gap-0.5 flex-shrink-0">
                                                            <button onClick={() => openEdit(task)}
                                                                className="p-2 text-slate-400 hover:text-sky-400 active:text-sky-400 transition-colors">
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

            {/* ── Shift Selector ─────────────────────────────────────── */}
            <div className="glass-card rounded-xl p-4 space-y-3">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Schedule for {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d')}</p>
                <ShiftSelector
                    value={{ shift: dayShift.shift, location: dayShift.location }}
                    onChange={val => setShift(dateStr, val.shift, val.location)}
                />
            </div>

            {/* ── Edit Modal ─────────────────────────────────────────── */}
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
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm font-semibold text-white focus:outline-none focus:border-sky-500 transition-colors"
                            />
                            <div className="relative">
                                <StickyNote className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                    placeholder="Notes..." rows={2}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 uppercase font-bold">Change Priority</label>
                                <PriorityPicker value={editForm.priority} onChange={p => setEditForm({ ...editForm, priority: p })} />
                            </div>
                            <ReminderFields form={editForm} setForm={setEditForm} />
                            <button onClick={handleSaveEdit} disabled={!editForm.title.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-sky-700/50 hover:bg-sky-600 disabled:bg-slate-800 disabled:text-slate-600 text-sky-100 font-bold py-3 rounded-lg transition-colors">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
