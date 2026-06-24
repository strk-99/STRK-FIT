
import { useState } from 'react';
import { useStore, type MealType } from '../store';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Trophy, Plus, Trash2, Utensils, Droplet, Dumbbell, Minus, CheckCircle2, Circle, Coffee, Sun, Moon, Cookie, BedDouble, StickyNote } from 'lucide-react';
import { calculateUserLevel } from '../lib/gamification';

export function DailyCard() {
    const { logs, logDay, shiftHistory } = useStore();
    // Default shift state for display
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const log = logs[dateStr];
    const shiftState = shiftHistory[dateStr] || { shift: 'Morning', location: 'Home' }; // Default to Morning/Home if off

    // Local state
    const [exercise, setExercise] = useState('');
    const [count, setCount] = useState('');
    const [foodItem, setFoodItem] = useState('');
    const [selectedMealType, setSelectedMealType] = useState<MealType>('Breakfast');

    const exercises = log?.exercises || [];
    const foodLog = log?.foodLog || [];
    const waterCount = log?.water || 0;
    const sleepHours = log?.sleep || 0;
    const { progress } = calculateUserLevel(logs);

    // Handlers
    const handleAddExercise = () => {
        if (!exercise || !count) return;
        const newEntry = { id: crypto.randomUUID(), name: exercise, count: count, completed: false };
        const updatedList = [...exercises, newEntry];
        logDay(dateStr, { exercises: updatedList, workoutDone: true });
        setExercise('');
        setCount('');
    };

    const handleDeleteExercise = (id: string) => {
        const updatedList = exercises.filter(ex => ex.id !== id);
        logDay(dateStr, { exercises: updatedList, workoutDone: updatedList.length > 0 });
    };

    const handleToggleExerciseCompletion = (id: string) => {
        const updatedList = exercises.map(ex =>
            ex.id === id ? { ...ex, completed: !ex.completed } : ex
        );
        logDay(dateStr, { exercises: updatedList });
    };

    const handleAddFood = () => {
        if (!foodItem) return;
        const currentTime = format(new Date(), 'HH:mm');
        const newEntry = {
            id: crypto.randomUUID(),
            item: foodItem,
            mealType: selectedMealType,
            time: currentTime
        };
        const updatedFood = [...foodLog, newEntry];
        logDay(dateStr, { foodLog: updatedFood });
        setFoodItem('');
    };

    const handleDeleteFood = (id: string) => {
        const updatedFood = foodLog.filter(f => f.id !== id);
        logDay(dateStr, { foodLog: updatedFood });
    };

    const getMealIcon = (mealType: MealType) => {
        switch (mealType) {
            case 'Breakfast': return <Coffee className="w-4 h-4" />;
            case 'Lunch': return <Sun className="w-4 h-4" />;
            case 'Dinner': return <Moon className="w-4 h-4" />;
            case 'Snack': return <Cookie className="w-4 h-4" />;
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

    const handleUpdateWater = (delta: number) => {
        const newVal = Math.max(0, waterCount + delta);
        logDay(dateStr, { water: newVal });
    };

    const handleUpdateSleep = (delta: number) => {
        const newVal = Math.max(0, Math.min(24, sleepHours + delta)); // Max 24 hours
        logDay(dateStr, { sleep: newVal });
    };

    return (
        <div className="px-4 pt-4 pb-24 space-y-6 animate-fade-up">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight glow-text-cyan">Today's Plan</h1>
                    <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {format(new Date(), 'EEEE, MMM do')}
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg flex flex-col items-center glow-border-cyan shadow-lg shadow-cyan-900/20">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Streak</span>
                    <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold">
                        <Trophy className="w-3 h-3" />
                        <span>{Math.floor(progress)}</span>
                    </div>
                </div>
            </div>

            {/* PROTOCOL CARD */}
            <div className="bg-slate-900/50 border-l-4 border-cyan-500 pl-4 py-3 rounded-r-lg">
                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider mb-1">Protocol</p>
                <p className="text-white font-bold text-lg">{shiftState.shift} Shift @ {shiftState.location}</p>
            </div>

            {/* 1. EXERCISE SECTION */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Dumbbell className="w-5 h-5" />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Exercise</h2>
                    </div>
                    {exercises.length > 0 && (
                        <div className="text-xs font-mono text-slate-500">
                            {exercises.filter(ex => ex.completed).length}/{exercises.length} completed
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="space-y-2">
                    <input
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value)}
                        placeholder="Workout..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <input
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        placeholder="Count..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                        onClick={handleAddExercise}
                        className="w-full bg-emerald-700/50 hover:bg-emerald-600 text-emerald-100 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                {exercises.length === 0 ? (
                    <p className="text-xs text-slate-600 italic pl-1">No workout logged.</p>
                ) : (
                    <div className="space-y-2 mt-2">
                        {exercises.map((ex) => (
                            <div
                                key={ex.id}
                                className={`flex items-center justify-between group p-3 rounded-lg border transition-all ${ex.completed
                                    ? 'bg-emerald-950/20 border-emerald-800/30'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <button
                                        onClick={() => handleToggleExerciseCompletion(ex.id!)}
                                        className="flex-shrink-0 transition-colors"
                                    >
                                        {ex.completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-slate-600 hover:text-emerald-400" />
                                        )}
                                    </button>
                                    <span className={`text-sm ${ex.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                        {ex.name} <span className="text-slate-600">x {ex.count}</span>
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDeleteExercise(ex.id!)}
                                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. FOOD SECTION */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-400">
                        <Utensils className="w-5 h-5" />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Food</h2>
                    </div>
                    {foodLog.length > 0 && (
                        <div className="text-xs font-mono text-slate-500">
                            {foodLog.length} {foodLog.length === 1 ? 'entry' : 'entries'}
                        </div>
                    )}
                </div>

                {/* Meal Type Selection */}
                <div className="grid grid-cols-4 gap-2">
                    {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map((mealType) => (
                        <button
                            key={mealType}
                            onClick={() => setSelectedMealType(mealType)}
                            className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${selectedMealType === mealType
                                ? 'bg-orange-950/30 border-orange-500/50 scale-105'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            <div className={selectedMealType === mealType ? getMealColor(mealType) : 'text-slate-600'}>
                                {getMealIcon(mealType)}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${selectedMealType === mealType ? 'text-orange-400' : 'text-slate-600'
                                }`}>
                                {mealType === 'Breakfast' ? 'BF' : mealType === 'Lunch' ? 'LN' : mealType === 'Dinner' ? 'DN' : 'SN'}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Food Input */}
                <div className="flex gap-2">
                    <input
                        value={foodItem}
                        onChange={(e) => setFoodItem(e.target.value)}
                        placeholder={`Add ${selectedMealType.toLowerCase()}...`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFood()}
                    />
                    <button
                        onClick={handleAddFood}
                        className="bg-orange-700/50 hover:bg-orange-600 text-orange-100 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Food List - Grouped by meal type */}
                {foodLog.length === 0 ? (
                    <p className="text-xs text-slate-600 italic pl-1">No food logged.</p>
                ) : (
                    <div className="space-y-2 mt-2">
                        {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map(mealType => {
                            const mealsOfType = foodLog.filter(f => f.mealType === mealType);
                            if (mealsOfType.length === 0) return null;

                            return (
                                <div key={mealType} className="space-y-1.5">
                                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${getMealColor(mealType)}`}>
                                        {getMealIcon(mealType)}
                                        <span>{mealType}</span>
                                    </div>
                                    {mealsOfType.map((food) => (
                                        <div
                                            key={food.id}
                                            className="group flex items-center justify-between p-2.5 bg-slate-900/50 hover:bg-slate-800/50 rounded-lg border border-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 flex-1">
                                                <span className="text-sm text-slate-300">{food.item}</span>
                                                {food.time && (
                                                    <span className="text-xs text-slate-600 font-mono">{food.time}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteFood(food.id)}
                                                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
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

            {/* 3. WATER SECTION */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-cyan-400">
                    <Droplet className="w-5 h-5" />
                    <h2 className="font-bold uppercase tracking-wider text-sm">Water</h2>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center justify-between">
                    <button
                        onClick={() => handleUpdateWater(-1)}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-cyan-500/50 transition-colors"
                    >
                        <Minus className="w-6 h-6 text-slate-400" />
                    </button>

                    <div className="text-center">
                        <span className="text-4xl font-bold text-white">{waterCount}</span>
                        <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-1">Glasses</p>
                    </div>

                    <button
                        onClick={() => handleUpdateWater(1)}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-cyan-500/50 transition-colors"
                    >
                        <Plus className="w-6 h-6 text-cyan-400" />
                    </button>
                </div>
            </div>

            {/* 4. SLEEP SECTION */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-indigo-400">
                    <BedDouble className="w-5 h-5" />
                    <h2 className="font-bold uppercase tracking-wider text-sm">Sleep</h2>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex items-center justify-between">
                    <button
                        onClick={() => handleUpdateSleep(-0.5)}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-indigo-500/50 transition-colors"
                    >
                        <Minus className="w-6 h-6 text-slate-400" />
                    </button>

                    <div className="text-center">
                        <span className="text-4xl font-bold text-white">{sleepHours}</span>
                        <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Hours</p>
                    </div>

                    <button
                        onClick={() => handleUpdateSleep(0.5)}
                        className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center hover:border-indigo-500/50 transition-colors"
                    >
                        <Plus className="w-6 h-6 text-indigo-400" />
                    </button>
                </div>
            </div>

            {/* 5. DAILY JOURNAL SECTION */}
            <div className="space-y-3 pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-violet-400">
                    <StickyNote className="w-5 h-5" />
                    <h2 className="font-bold uppercase tracking-wider text-sm">Daily Journal</h2>
                </div>

                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-3">
                    <textarea
                        value={log?.dailyJournal || ''}
                        onChange={(e) => logDay(dateStr, { dailyJournal: e.target.value })}
                        placeholder="How was your day? How are you feeling?"
                        className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none min-h-[100px] resize-none"
                    />
                </div>
            </div>
        </div>
    );
}

