import { useState } from 'react';
import { useStore } from '../store';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Scale, TrendingDown, TrendingUp, Minus, Trash2 } from 'lucide-react';

export function WeightTracker() {
    const { weightHistory, addWeightEntry, removeWeightEntry, profile } = useStore();
    const [newWeight, setNewWeight] = useState('');
    const [showInput, setShowInput] = useState(false);

    // Sort history desc
    const sortedHistory = [...weightHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sortedHistory[0];
    const previous = sortedHistory[1];

    const handleSave = () => {
        if (!newWeight || parseFloat(newWeight) <= 0) return;
        addWeightEntry(parseFloat(newWeight));
        setNewWeight('');
        setShowInput(false);
    };

    let change = 0;
    let changeDirection: 'down' | 'up' | 'same' = 'same';

    if (latest && previous) {
        change = latest.weight - previous.weight; // Positive means gained
        if (change < -0.1) changeDirection = 'down';
        else if (change > 0.1) changeDirection = 'up';
    }

    const daysSinceLastLog = latest ? differenceInDays(new Date(), parseISO(latest.date)) : 999;
    const isDue = daysSinceLastLog >= 10;

    return (
        <div className="space-y-4">
            {/* Current Weight Display */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-5 border border-white/10 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 opacity-5">
                    <Scale className="w-32 h-32 text-white" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Scale className="w-5 h-5 text-white" />
                            <span className="text-sm font-bold text-white/50 uppercase tracking-wider">Current Weight</span>
                        </div>
                        {profile && (
                            <span className="text-xs text-white/20">
                                {Math.abs(profile.currentWeight - profile.targetWeight).toFixed(1)}kg to go
                            </span>
                        )}
                    </div>

                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black text-white">
                            {latest ? latest.weight : profile?.currentWeight || '--'}
                        </span>
                        <span className="text-xl text-white/35 font-medium">kg</span>
                    </div>

                    {/* Change indicator */}
                    {latest && previous && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black border border-white/10">
                            {changeDirection === 'down' && (
                                <>
                                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-bold text-emerald-400">
                                        -{Math.abs(change).toFixed(1)} kg
                                    </span>
                                </>
                            )}
                            {changeDirection === 'up' && (
                                <>
                                    <TrendingUp className="w-4 h-4 text-amber-400" />
                                    <span className="text-sm font-bold text-amber-400">
                                        +{Math.abs(change).toFixed(1)} kg
                                    </span>
                                </>
                            )}
                            {changeDirection === 'same' && (
                                <>
                                    <Minus className="w-4 h-4 text-white/35" />
                                    <span className="text-sm font-bold text-white/35">No change</span>
                                </>
                            )}
                            <span className="text-xs text-white/20">since last cycle</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Log New Weight */}
            {!showInput ? (
                <button
                    onClick={() => setShowInput(true)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                        isDue
                            ? 'bg-white/[0.04] border-white/40 hover:bg-white/[0.06] text-white'
                            : 'bg-white/[0.06] border-white/10 hover:bg-white/10 text-white/50'
                    }`}
                >
                    <div className="text-center">
                        <p className="font-bold text-sm">
                            {isDue ? '✨ Time for check-in' : `Next check-in in ${10 - daysSinceLastLog} days`}
                        </p>
                        <p className="text-xs text-white/35 mt-1">Tap to log weight</p>
                    </div>
                </button>
            ) : (
                <div className="bg-white/[0.06] p-4 rounded-xl border border-white/20 space-y-3 animate-fade-up">
                    <p className="text-sm text-white/50 text-center">
                        One data point. No judgement.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            step="0.1"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                            placeholder="97.5"
                            className="flex-1 bg-black border border-white/[0.15] rounded-lg px-4 py-3 text-white text-center text-xl font-mono placeholder:text-white/20 focus:outline-none focus:border-white/30"
                            autoFocus
                        />
                        <span className="flex items-center text-white/35 text-lg">kg</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={!newWeight || parseFloat(newWeight) <= 0}
                            className="flex-1 bg-white/[0.12] hover:bg-sky-500 disabled:bg-white/10 disabled:text-white/20 text-white py-3 rounded-lg font-bold transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setShowInput(false);
                                setNewWeight('');
                            }}
                            className="px-4 bg-white/10 hover:bg-white/[0.13] text-white/50 py-3 rounded-lg font-bold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/20 text-center">
                            • Same scale • Morning time • Don't re-check today
                        </p>
                    </div>
                </div>
            )}

            {/* History */}
            {sortedHistory.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-white/35 uppercase tracking-wider px-1">Recent History</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                        {sortedHistory.slice(0, 10).map((entry, i) => {
                            const prevEntry = sortedHistory[i + 1];
                            const entryChange = prevEntry ? entry.weight - prevEntry.weight : 0;

                            return (
                                <div
                                    key={`${entry.date}-${i}`}
                                    className="group relative flex items-center justify-between p-3 bg-white/[0.06] hover:bg-white/[0.07] rounded-lg border border-white/10 transition-colors"
                                >
                                    <span className="text-sm text-white/50">
                                        {format(parseISO(entry.date), 'MMM d, yyyy')}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        {prevEntry && (
                                            <span className={`text-xs font-mono ${
                                                entryChange < -0.1 ? 'text-emerald-400' :
                                                entryChange > 0.1 ? 'text-amber-400' :
                                                'text-white/20'
                                            }`}>
                                                {entryChange > 0 ? '+' : ''}{entryChange.toFixed(1)}
                                            </span>
                                        )}
                                        <span className="text-white font-bold font-mono">{entry.weight} kg</span>
                                        <button
                                            onClick={() => removeWeightEntry(entry.date)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-black/90 backdrop-blur-sm rounded-lg hover:bg-red-950 hover:text-red-400 text-white/35 transition-all"
                                            title="Delete entry"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
