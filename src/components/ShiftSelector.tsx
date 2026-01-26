import type { ShiftType, LocationType } from "../store";
import { cn } from "../lib/utils";
import { Sun, Moon, Briefcase, Coffee, Home, Plane, Building, GraduationCap, Calendar } from "lucide-react";

interface ShiftSelectorProps {
    value: { shift: ShiftType, location: LocationType };
    onChange: (val: { shift: ShiftType, location: LocationType }) => void;
}

export function ShiftSelector({ value, onChange }: ShiftSelectorProps) {
    const shifts: { id: ShiftType, icon: any, label: string }[] = [
        { id: 'Morning', icon: Sun, label: 'Morning' },
        { id: 'Afternoon', icon: Briefcase, label: 'Afternoon' },
        { id: 'Night', icon: Moon, label: 'Night' },
        { id: 'General', icon: Calendar, label: 'General' },
        { id: 'Off', icon: Coffee, label: 'Off' },
    ];

    const locations: { id: LocationType, icon: any, label: string }[] = [
        { id: 'Home', icon: Home, label: 'Home' },
        { id: 'Hostel', icon: Building, label: 'Hostel' },
        { id: 'Work/College/School', icon: GraduationCap, label: 'Work/College/School' },
        { id: 'Travel', icon: Plane, label: 'Travel' },
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">What kind of day is this?</label>
                <div className="space-y-2">
                    {/* Top row: Morning, Afternoon, Night */}
                    <div className="grid grid-cols-3 gap-2">
                        {shifts.slice(0, 3).map((s) => (
                            <button
                                key={s.id}
                                onClick={() => onChange({ ...value, shift: s.id })}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all h-20",
                                    value.shift === s.id
                                        ? "bg-slate-800 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-900/20"
                                        : "bg-slate-900/50 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-400"
                                )}
                            >
                                <s.icon className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">{s.label}</span>
                            </button>
                        ))}
                    </div>
                    {/* Bottom row: General, Off */}
                    <div className="grid grid-cols-2 gap-2 max-w-[66.666%] mx-auto">
                        {shifts.slice(3).map((s) => (
                            <button
                                key={s.id}
                                onClick={() => onChange({ ...value, shift: s.id })}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all h-20",
                                    value.shift === s.id
                                        ? "bg-slate-800 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-900/20"
                                        : "bg-slate-900/50 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-400"
                                )}
                            >
                                <s.icon className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {value.shift === 'Night' && (
                    <p className="text-[10px] text-purple-400 flex items-center gap-1 mt-1">
                        <Moon className="w-3 h-3" /> We'll prioritize recovery and sleep.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Where are you today?</label>
                <div className="grid grid-cols-2 gap-2">
                    {locations.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => onChange({ ...value, location: l.id })}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all h-24",
                                value.location === l.id
                                    ? "bg-slate-800 border-orange-500 text-orange-400 shadow-lg shadow-orange-900/20"
                                    : "bg-slate-900/50 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-400"
                            )}
                        >
                            <l.icon className="w-5 h-5 mb-2" />
                            <span className="text-[10px] font-bold text-center leading-tight">{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
