import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'General' | 'Off';
export type LocationType = 'Home' | 'Hostel' | 'Work/College/School' | 'Travel';

export interface DayShiftState {
    date: string; // ISO YYYY-MM-DD
    shift: ShiftType;
    location: LocationType;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface FoodEntry {
    id: string;
    item: string;
    mealType: MealType;
    time?: string; // HH:mm format
}

export interface DailyLog {
    date: string;
    workoutDone: boolean;
    proteinEst: 'low' | 'med' | 'high';
    steps: number;
    exercises?: { id: string; name: string; count: string; completed?: boolean; }[];
    water?: number; // mL or cups? Let's say count of glasses
    foodLog?: FoodEntry[];
    sleep?: number; // hours of sleep
    notes?: string; // Daily reflection/journal
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

export interface UserProfile {
    name: string;
    age: number;
    dob: string; // YYYY-MM-DD
    height: number; // cm
    phone: string;
    email: string;

    startWeight: number;
    currentWeight: number;
    targetWeight: number;

    level: number; // 1-5
    xp: number;

    // Reminder settings
    reminderEnabled: boolean;
    reminderTime: string; // HH:mm format

    // Monthly data download
    monthlyDownloadEnabled: boolean;
}

interface AppState {
    profile: UserProfile | null;
    shiftHistory: Record<string, DayShiftState>; // date -> state
    logs: Record<string, DailyLog>;
    weightHistory: WeightEntry[];
    achievements: Achievement[];
    resources: ResourceLink[];

    // Actions
    setProfile: (profile: UserProfile) => void;
    updateProfile: (partial: Partial<UserProfile>) => void;
    setShift: (date: string, shift: ShiftType, location: LocationType) => void;
    logDay: (date: string, data: Partial<DailyLog>) => void;
    addWeightEntry: (weight: number) => void;
    removeWeightEntry: (date: string) => void;

    addResource: (resource: ResourceLink) => void;
    removeResource: (id: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            profile: null,
            shiftHistory: {},
            logs: {},
            weightHistory: [],
            achievements: [],
            resources: [],

            setProfile: (profile) => set({ profile }),

            updateProfile: (partial) => set((state) => ({
                profile: state.profile ? { ...state.profile, ...partial } : null
            })),

            setShift: (date, shift, location) => set((state) => ({
                shiftHistory: {
                    ...state.shiftHistory,
                    [date]: { date, shift, location }
                }
            })),

            logDay: (date, data) => set((state) => {
                const existing = state.logs[date] || {
                    date,
                    workoutDone: false,
                    proteinEst: 'med',
                    steps: 0,
                    exercises: [],
                    water: 0,
                    foodLog: [],
                    notes: ''
                };
                return {
                    logs: {
                        ...state.logs,
                        [date]: { ...existing, ...data }
                    }
                };
            }),

            addWeightEntry: (weight) => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                return {
                    weightHistory: [...state.weightHistory, { date: today, weight }],
                    profile: state.profile ? { ...state.profile, currentWeight: weight } : null
                };
            }),

            removeWeightEntry: (date) => set((state) => {
                const updatedHistory = state.weightHistory.filter(entry => entry.date !== date);
                // Update profile currentWeight to the latest remaining entry
                const sortedHistory = [...updatedHistory].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                const latestWeight = sortedHistory[0]?.weight || state.profile?.currentWeight || 0;

                return {
                    weightHistory: updatedHistory,
                    profile: state.profile ? { ...state.profile, currentWeight: latestWeight } : null
                };
            }),

            addResource: (resource) => set((state) => ({
                resources: [...state.resources, resource]
            })),

            removeResource: (id) => set((state) => ({
                resources: state.resources.filter(r => r.id !== id)
            }))
        }),
        {
            name: 'shiftfit-storage',
            version: 2, // Bump version for new schema
        }
    )
)
