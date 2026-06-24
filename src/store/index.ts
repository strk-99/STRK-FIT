import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'General' | 'Off';
export type LocationType = 'Home' | 'Hostel' | 'Work/College/School' | 'Travel';
export type MoodType = 'dead' | 'low' | 'okay' | 'good' | 'fired';

export interface DayShiftState {
    date: string;
    shift: ShiftType;
    location: LocationType;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface FoodEntry {
    id: string;
    item: string;
    mealType: MealType;
    time?: string;
}

export interface ExerciseEntry {
    id: string;
    name: string;
    count: string;
    completed?: boolean;
}

export type ReminderRepeat = 'none' | 'daily' | 'weekdays' | 'custom';

export interface Task {
    id: string;
    title: string;
    notes?: string;
    priority: PriorityLevel;
    completed: boolean;
    reminderTime?: string;
    reminderEnabled: boolean;
    reminderRepeat: ReminderRepeat;
    reminderDays?: number[];
    createdAt: string;
    completedAt?: string;
}

export interface DailyLog {
    date: string;
    workoutDone: boolean;
    proteinEst: 'low' | 'med' | 'high';
    steps: number;
    exercises?: ExerciseEntry[];
    tasks?: Task[];
    water?: number;
    foodLog?: FoodEntry[];
    sleep?: number;
    dailyJournal?: string;
    mood?: MoodType;
    habitLog?: Record<string, HabitEntry>;
}

export interface HabitEntry {
    done: boolean;
    time?: string;
    count?: string;
    note?: string;
}

export interface WeightEntry {
    date: string;
    weight: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlockedAt: string;
}

export interface ResourceLink {
    id: string;
    title: string;
    url: string;
    category: 'Fitness' | 'Food' | 'Learnings';
    description: string;
}

export interface Note {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

export interface Habit {
    id: string;
    name: string;
    emoji: string;
    createdAt: string;
}

export interface WeeklyIntention {
    week: string;       // YYYY-MM-DD of that week's Monday
    intention: string;
    achieved: boolean | null;
}

export interface UserProfile {
    name: string;
    age: number;
    dob: string;
    height: number;
    phone: string;
    email: string;
    startWeight: number;
    currentWeight: number;
    targetWeight: number;
    level: number;
    xp: number;
    reminderEnabled: boolean;
    reminderTime: string;
    monthlyDownloadEnabled: boolean;
}

const DEFAULT_HABITS: Habit[] = [
    { id: 'h-workout',  name: 'Workout',        emoji: '💪', createdAt: new Date().toISOString() },
    { id: 'h-protein',  name: 'Hit Protein',     emoji: '🥗', createdAt: new Date().toISOString() },
    { id: 'h-water',    name: '8 Glasses Water', emoji: '💧', createdAt: new Date().toISOString() },
    { id: 'h-sleep',    name: '7+ hrs Sleep',    emoji: '😴', createdAt: new Date().toISOString() },
    { id: 'h-nojunk',   name: 'No Junk Food',    emoji: '🚫', createdAt: new Date().toISOString() },
];

interface AppState {
    profile: UserProfile | null;
    shiftHistory: Record<string, DayShiftState>;
    logs: Record<string, DailyLog>;
    weightHistory: WeightEntry[];
    achievements: Achievement[];
    resources: ResourceLink[];
    notes: Note[];
    habits: Habit[];
    weeklyIntentions: Record<string, WeeklyIntention>;

    setProfile: (profile: UserProfile) => void;
    updateProfile: (partial: Partial<UserProfile>) => void;
    setShift: (date: string, shift: ShiftType, location: LocationType) => void;
    logDay: (date: string, data: Partial<DailyLog>) => void;
    addWeightEntry: (weight: number) => void;
    removeWeightEntry: (date: string) => void;

    addResource: (resource: ResourceLink) => void;
    removeResource: (id: string) => void;

    addTask: (date: string, task: Omit<Task, 'id' | 'createdAt'> & { id?: string; reminderRepeat?: ReminderRepeat }) => void;
    updateTask: (date: string, taskId: string, updates: Partial<Task>) => void;
    deleteTask: (date: string, taskId: string) => void;
    toggleTaskComplete: (date: string, taskId: string) => void;

    addNote: (note: { title: string; body: string }) => void;
    updateNote: (id: string, updates: { title?: string; body?: string }) => void;
    deleteNote: (id: string) => void;

    // Habits
    addHabit: (habit: { name: string; emoji: string }) => void;
    removeHabit: (id: string) => void;
    toggleHabit: (date: string, habitId: string) => void;
    updateHabitEntry: (date: string, habitId: string, updates: Partial<HabitEntry>) => void;

    // Mood
    setMood: (date: string, mood: MoodType) => void;

    // Weekly intention
    setWeeklyIntention: (week: string, intention: string) => void;
    setWeeklyAchieved: (week: string, achieved: boolean) => void;
}

const emptyLog = (date: string): DailyLog => ({
    date, workoutDone: false, proteinEst: 'med',
    steps: 0, exercises: [], tasks: [], water: 0, foodLog: [], dailyJournal: '',
});

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            profile: null,
            shiftHistory: {},
            logs: {},
            weightHistory: [],
            achievements: [],
            resources: [],
            notes: [],
            habits: DEFAULT_HABITS,
            weeklyIntentions: {},

            setProfile: (profile) => set({ profile }),

            updateProfile: (partial) => set((state) => ({
                profile: state.profile ? { ...state.profile, ...partial } : null
            })),

            setShift: (date, shift, location) => set((state) => ({
                shiftHistory: { ...state.shiftHistory, [date]: { date, shift, location } }
            })),

            logDay: (date, data) => set((state) => ({
                logs: {
                    ...state.logs,
                    [date]: { ...(state.logs[date] || emptyLog(date)), ...data }
                }
            })),

            addWeightEntry: (weight) => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                return {
                    weightHistory: [...state.weightHistory, { date: today, weight }],
                    profile: state.profile ? { ...state.profile, currentWeight: weight } : null
                };
            }),

            removeWeightEntry: (date) => set((state) => {
                const updated = state.weightHistory.filter(e => e.date !== date);
                const latest = [...updated].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                return {
                    weightHistory: updated,
                    profile: state.profile ? { ...state.profile, currentWeight: latest?.weight || state.profile.currentWeight } : null
                };
            }),

            addResource: (resource) => set((state) => ({ resources: [...state.resources, resource] })),
            removeResource: (id) => set((state) => ({ resources: state.resources.filter(r => r.id !== id) })),

            addTask: (date, task) => set((state) => {
                const log = state.logs[date] || emptyLog(date);
                const newTask: Task = {
                    ...task,
                    reminderRepeat: task.reminderRepeat ?? 'none',
                    reminderDays: task.reminderDays ?? [],
                    id: task.id ?? crypto.randomUUID(),
                    createdAt: new Date().toISOString()
                };
                return {
                    logs: { ...state.logs, [date]: { ...log, tasks: [...(log.tasks || []), newTask] } }
                };
            }),

            updateTask: (date, taskId, updates) => set((state) => {
                const log = state.logs[date];
                if (!log?.tasks) return state;
                return {
                    logs: { ...state.logs, [date]: { ...log, tasks: log.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) } }
                };
            }),

            deleteTask: (date, taskId) => set((state) => {
                const log = state.logs[date];
                if (!log?.tasks) return state;
                return {
                    logs: { ...state.logs, [date]: { ...log, tasks: log.tasks.filter(t => t.id !== taskId) } }
                };
            }),

            toggleTaskComplete: (date, taskId) => set((state) => {
                const log = state.logs[date];
                if (!log?.tasks) return state;
                return {
                    logs: {
                        ...state.logs,
                        [date]: {
                            ...log,
                            tasks: log.tasks.map(t =>
                                t.id === taskId
                                    ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
                                    : t
                            )
                        }
                    }
                };
            }),

            addNote: ({ title, body }) => set((state) => ({
                notes: [{ id: crypto.randomUUID(), title, body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...state.notes]
            })),

            updateNote: (id, updates) => set((state) => ({
                notes: state.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)
            })),

            deleteNote: (id) => set((state) => ({ notes: state.notes.filter(n => n.id !== id) })),

            // Habits
            addHabit: ({ name, emoji }) => set((state) => ({
                habits: [...state.habits, { id: crypto.randomUUID(), name, emoji, createdAt: new Date().toISOString() }]
            })),

            removeHabit: (id) => set((state) => ({ habits: state.habits.filter(h => h.id !== id) })),

            toggleHabit: (date, habitId) => set((state) => {
                const log = state.logs[date] || emptyLog(date);
                const current = log.habitLog || {};
                const prev = current[habitId];
                const entry: HabitEntry = prev
                    ? { ...prev, done: !prev.done }
                    : { done: true };
                return {
                    logs: { ...state.logs, [date]: { ...log, habitLog: { ...current, [habitId]: entry } } }
                };
            }),

            updateHabitEntry: (date: string, habitId: string, updates: Partial<HabitEntry>) => set((state) => {
                const log = state.logs[date] || emptyLog(date);
                const current = log.habitLog || {};
                const prev = current[habitId] || { done: false };
                return {
                    logs: { ...state.logs, [date]: { ...log, habitLog: { ...current, [habitId]: { ...prev, ...updates } } } }
                };
            }),

            // Mood
            setMood: (date, mood) => set((state) => ({
                logs: { ...state.logs, [date]: { ...(state.logs[date] || emptyLog(date)), mood } }
            })),

            // Weekly intention
            setWeeklyIntention: (week, intention) => set((state) => ({
                weeklyIntentions: {
                    ...state.weeklyIntentions,
                    [week]: { week, intention, achieved: state.weeklyIntentions[week]?.achieved ?? null }
                }
            })),

            setWeeklyAchieved: (week, achieved) => set((state) => ({
                weeklyIntentions: {
                    ...state.weeklyIntentions,
                    [week]: { ...(state.weeklyIntentions[week] || { week, intention: '' }), achieved }
                }
            })),
        }),
        {
            name: 'shiftfit-storage',
            version: 2,
            merge: (persisted: any, current) => ({
                ...current,
                ...persisted,
                // Seed default habits for existing users who don't have them yet
                habits: (persisted as any)?.habits?.length ? (persisted as any).habits : DEFAULT_HABITS,
            }),
        }
    )
)
