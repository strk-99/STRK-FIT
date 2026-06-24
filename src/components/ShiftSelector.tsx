import type { ShiftType, LocationType } from "../store";
import { cn } from "../lib/utils";
import { Sun, Moon, Briefcase, Coffee, Home, Plane, Building, GraduationCap, Calendar } from "lucide-react";

interface ShiftSelectorProps {
    value: { shift: ShiftType, location: LocationType };
    onChange: (val: { shift: ShiftType, location: LocationType }) => void;
}

const shifts: { id: ShiftType; icon: React.ElementType; label: string }[] = [
    { id: 'Morning',   icon: Sun,         label: 'Morning'   },
    { id: 'Afternoon', icon: Briefcase,   label: 'Afternoon' },
    { id: 'Night',     icon: Moon,        label: 'Night'     },
    { id: 'General',   icon: Calendar,    label: 'General'   },
    { id: 'Off',       icon: Coffee,      label: 'Off'       },
];

const locations: { id: LocationType; icon: React.ElementType; label: string }[] = [
    { id: 'Home',               icon: Home,          label: 'Home'    },
    { id: 'Hostel',             icon: Building,      label: 'Hostel'  },
    { id: 'Work/College/School',icon: GraduationCap, label: 'Work'    },
    { id: 'Travel',             icon: Plane,         label: 'Travel'  },
];

export function ShiftSelector({ value, onChange }: ShiftSelectorProps) {
    return (
        <div className="space-y-2">
            {/* Shift — all 5 in one row */}
            <div className="grid grid-cols-5 gap-1.5">
                {shifts.map(s => (
                    <button
                        key={s.id}
                        onClick={() => onChange({ ...value, shift: s.id })}
                        className={cn(
                            "flex flex-col items-center gap-1 py-2 rounded-lg border transition-all",
                            value.shift === s.id
                                ? "bg-slate-800 border-sky-500 text-sky-400"
                                : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                        )}
                    >
                        <s.icon className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold leading-none">{s.label}</span>
                    </button>
                ))}
            </div>

            {/* Location — all 4 in one row */}
            <div className="grid grid-cols-4 gap-1.5">
                {locations.map(l => (
                    <button
                        key={l.id}
                        onClick={() => onChange({ ...value, location: l.id })}
                        className={cn(
                            "flex flex-col items-center gap-1 py-2 rounded-lg border transition-all",
                            value.location === l.id
                                ? "bg-slate-800 border-orange-500 text-orange-400"
                                : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                        )}
                    >
                        <l.icon className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold leading-none">{l.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
