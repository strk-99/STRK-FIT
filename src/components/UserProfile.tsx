import { useState } from 'react';
import { WeightTracker } from './WeightTracker';
import {
    User as UserIcon,
    Activity,
    Target,
    Download,
    Trash2,
    Info,
    CheckCircle2,
    Circle,
    Lock,
    Save,
    Settings,
    Bell,
    Calendar,
    Pencil
} from 'lucide-react';
import { useStore } from '../store';
import {
    calculateUserLevel,
    calculateIntegrityStreak,
    getRightNowFocus,
    getWeeklySnapshot,
    getNextCheckInDays,
    LEVEL_DESCRIPTIONS,
    UNLOCK_CRITERIA
} from '../lib/gamification';
import { exportUserDataToCSV } from '../lib/data-export';

interface UserProfileProps {
    onOpenSettings?: () => void;
}

export function UserProfile({ onOpenSettings }: UserProfileProps = {}) {
    const { logs, profile, shiftHistory, weightHistory, setProfile, updateProfile } = useStore();
    const { level, title } = profile ? calculateUserLevel(logs) : { level: 1, title: 'Survivor' };
    const { currentStreak, bestStreak } = calculateIntegrityStreak(logs, shiftHistory);
    const focusItems = getRightNowFocus(logs, shiftHistory);
    const snapshot = getWeeklySnapshot(logs, shiftHistory);
    const nextCheckIn = getNextCheckInDays(weightHistory);

    const [showLevelTooltip, setShowLevelTooltip] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(!profile);

    const [formData, setFormData] = useState({
        name: profile?.name || '',
        age: profile?.age?.toString() || '',
        dob: profile?.dob || '',
        height: profile?.height?.toString() || '',
        currentWeight: profile?.currentWeight?.toString() || '',
        targetWeight: profile?.targetWeight?.toString() || '',
        reminderEnabled: profile?.reminderEnabled || false,
        reminderTime: profile?.reminderTime || '09:00',
        monthlyDownloadEnabled: profile?.monthlyDownloadEnabled || false
    });

    const handleSave = () => {
        const profileData = {
            name: formData.name,
            age: parseInt(formData.age) || 0,
            dob: formData.dob,
            height: parseFloat(formData.height) || 0,
            phone: profile?.phone || '',
            email: profile?.email || '',
            startWeight: profile?.startWeight || parseFloat(formData.currentWeight) || 0,
            currentWeight: parseFloat(formData.currentWeight) || 0,
            targetWeight: parseFloat(formData.targetWeight) || 0,
            level: profile?.level || 1,
            xp: profile?.xp || 0,
            reminderEnabled: formData.reminderEnabled,
            reminderTime: formData.reminderTime,
            monthlyDownloadEnabled: formData.monthlyDownloadEnabled
        };

        if (profile) {
            updateProfile(profileData);
        } else {
            setProfile(profileData);
        }

        setShowProfileForm(false);
        alert('Profile saved successfully!');
    };

    const handleExport = async () => {
        try {
            await exportUserDataToCSV(useStore.getState());
        } catch (error) {
            console.error('Export failed', error);
            alert('Export failed. Please try again.');
        }
    };

    // If no profile, show setup form
    if (!profile || showProfileForm) {
        return (
            <div className="p-6 space-y-6 pb-24 animate-fade-up">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-900/30 to-slate-900 border border-cyan-500/30 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{profile ? 'Edit Profile' : 'Setup Profile'}</h1>
                            <p className="text-sm text-slate-400">{profile ? 'Update your information' : 'Get started with STRK-FIT'}</p>
                        </div>
                    </div>
                    {profile && (
                        <button
                            onClick={() => setShowProfileForm(false)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm font-bold transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {/* Profile Form */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                    <h2 className="text-lg font-bold text-cyan-400 mb-4">Personal Information</h2>

                    {/* Name */}
                    <div>
                        <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                            Age
                        </label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                            placeholder="Enter your age"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                        />
                    </div>

                    {/* Height */}
                    <div>
                        <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                            Height (cm)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                            placeholder="Enter your height in cm"
                        />
                    </div>

                    {/* Current Weight */}
                    <div>
                        <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                            Current Weight (kg)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.currentWeight}
                            onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                            placeholder="Enter your current weight"
                        />
                    </div>

                    {/* Target Weight */}
                    <div>
                        <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                            Target Weight (kg)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.targetWeight}
                            onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                            placeholder="Enter your target weight"
                        />
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
                    <h2 className="text-lg font-bold text-white mb-2">Preferences</h2>

                    {/* Enable Reminder */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Bell className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-200 mb-0.5">
                                    Daily Reminder
                                </label>
                                <p className="text-xs text-slate-500">Get notified to log activity</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, reminderEnabled: !formData.reminderEnabled })}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${formData.reminderEnabled
                                ? 'bg-cyan-600'
                                : 'bg-slate-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 ${formData.reminderEnabled
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Reminder Time (Conditional) */}
                    {formData.reminderEnabled && (
                        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50 ml-12 animate-fade-in">
                            <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                                Check-in Time
                            </label>
                            <input
                                type="time"
                                value={formData.reminderTime}
                                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                                className="w-full bg-transparent text-white focus:outline-none text-sm font-mono"
                            />
                        </div>
                    )}

                    <div className="h-px bg-slate-800/50" />

                    {/* Auto Monthly Download */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-200 mb-0.5">
                                    Auto-Export
                                </label>
                                <p className="text-xs text-slate-500">Monthly CSV download</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, monthlyDownloadEnabled: !formData.monthlyDownloadEnabled })}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${formData.monthlyDownloadEnabled
                                ? 'bg-emerald-600'
                                : 'bg-slate-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1 ${formData.monthlyDownloadEnabled
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    {profile ? 'Update Profile' : 'Create Profile'}
                </button>
            </div>
        );
    }

    // Main profile view with gamification
    return (
        <div className="p-6 space-y-6 pb-24 animate-fade-up">
            {/* SECTION 1: IDENTITY CARD */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <UserIcon className="w-32 h-32 text-cyan-400" />
                </div>

                <div className="relative z-10">
                    {/* Edit and Settings Buttons */}
                    <div className="absolute top-0 right-0 flex items-center gap-2">
                        <button
                            onClick={onOpenSettings}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-violet-400 transition-colors"
                            title="Settings"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setFormData({
                                    name: profile.name,
                                    age: profile.age.toString(),
                                    dob: profile.dob,
                                    height: profile.height.toString(),
                                    currentWeight: profile.currentWeight.toString(),
                                    targetWeight: profile.targetWeight.toString(),
                                    reminderEnabled: profile.reminderEnabled,
                                    reminderTime: profile.reminderTime,
                                    monthlyDownloadEnabled: profile.monthlyDownloadEnabled
                                });
                                setShowProfileForm(true);
                            }}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                            title="Edit Profile"
                        >
                            <UserIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-900/30 to-slate-900 border border-cyan-500/30 rounded-full flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white tracking-wide mb-1">{profile.name}</h2>
                            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                                <span>Level {level}: {title}</span>
                                <button
                                    onClick={() => setShowLevelTooltip(!showLevelTooltip)}
                                    className="relative"
                                >
                                    <Info className="w-3.5 h-3.5 text-slate-500 hover:text-cyan-400 transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tooltip */}
                    {showLevelTooltip && (
                        <div className="mb-4 p-3 bg-slate-950 border border-cyan-500/30 rounded-lg text-xs text-slate-300">
                            <p className="font-bold text-cyan-400 mb-1">{title}</p>
                            <p>{LEVEL_DESCRIPTIONS[level]}</p>
                        </div>
                    )}

                    <p className="text-sm text-slate-400 italic">
                        "Still showing up. That's enough for today."
                    </p>
                </div>
            </div>

            {/* SECTION 2: DIRECTION (NOT PRESSURE) */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Current Weight</span>
                            <button
                                onClick={() => {
                                    setFormData({
                                        name: profile.name,
                                        age: profile.age.toString(),
                                        dob: profile.dob,
                                        height: profile.height.toString(),
                                        currentWeight: profile.currentWeight.toString(),
                                        targetWeight: profile.targetWeight.toString(),
                                        reminderEnabled: profile.reminderEnabled,
                                        reminderTime: profile.reminderTime,
                                        monthlyDownloadEnabled: profile.monthlyDownloadEnabled
                                    });
                                    setShowProfileForm(true);
                                }}
                                className="opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <Pencil className="w-3 h-3 text-slate-500" />
                            </button>
                        </div>
                        <div className="text-2xl font-mono text-white font-bold">
                            {profile.currentWeight} <span className="text-sm text-slate-600">kg</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Long-term Direction</span>
                            <button
                                onClick={() => {
                                    setFormData({
                                        name: profile.name,
                                        age: profile.age.toString(),
                                        dob: profile.dob,
                                        height: profile.height.toString(),
                                        currentWeight: profile.currentWeight.toString(),
                                        targetWeight: profile.targetWeight.toString(),
                                        reminderEnabled: profile.reminderEnabled,
                                        reminderTime: profile.reminderTime,
                                        monthlyDownloadEnabled: profile.monthlyDownloadEnabled
                                    });
                                    setShowProfileForm(true);
                                }}
                                className="opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <Pencil className="w-3 h-3 text-slate-500" />
                            </button>
                        </div>
                        <div className="text-2xl font-mono text-cyan-400 font-bold">
                            {profile.targetWeight} <span className="text-sm text-slate-600">kg</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Height</span>
                            <button
                                onClick={() => {
                                    setFormData({
                                        name: profile.name,
                                        age: profile.age.toString(),
                                        dob: profile.dob,
                                        height: profile.height.toString(),
                                        currentWeight: profile.currentWeight.toString(),
                                        targetWeight: profile.targetWeight.toString(),
                                        reminderEnabled: profile.reminderEnabled,
                                        reminderTime: profile.reminderTime,
                                        monthlyDownloadEnabled: profile.monthlyDownloadEnabled
                                    });
                                    setShowProfileForm(true);
                                }}
                                className="opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <Pencil className="w-3 h-3 text-slate-500" />
                            </button>
                        </div>
                        <div className="text-xl font-mono text-slate-200 font-bold">
                            {profile.height} <span className="text-sm text-slate-600">cm</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Progress to Go</span>
                        </div>
                        <div className="text-xl font-mono text-amber-400 font-bold">
                            {Math.abs(profile.currentWeight - profile.targetWeight).toFixed(1)} <span className="text-sm text-slate-600">kg</span>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-800/50 space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Progress lens:</span>
                        <span className="text-slate-300 font-bold">10-day cycles</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Next check-in:</span>
                        <span className="text-cyan-400 font-bold">
                            {nextCheckIn === 0 ? 'Ready now' : `${nextCheckIn} days`}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 italic pt-2">No deadline. Just direction.</p>
            </div>

            {/* SECTION 3: INTEGRITY STREAK */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                            Integrity Streak
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-emerald-400">
                                {currentStreak}
                            </span>
                            <span className="text-sm font-bold text-slate-400">days</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                            best so far: {bestStreak} days
                        </div>
                    </div>
                    <Activity className="w-8 h-8 text-emerald-900/30" />
                </div>

                <div className="mt-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                    <p className="text-xs text-slate-400">
                        Counts effort, not perfection. Travel and recovery days don't break the streak.
                    </p>
                </div>
            </div>

            {/* SECTION 4: JOURNEY LEVELS */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                    <Target className="w-4 h-4" />
                    Journey Levels
                </div>

                <div className="space-y-2">
                    {/* Level 1: Survivor */}
                    <div className={`p-4 rounded-lg border transition-all ${level === 1
                        ? 'bg-cyan-950/20 border-cyan-500/50'
                        : level > 1
                            ? 'bg-slate-900 border-slate-800'
                            : 'bg-slate-900 border-slate-800'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                {level >= 1 ? (
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                    <div className="font-bold text-white mb-1">
                                        Level 1: Survivor
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Learning to show up
                                    </p>
                                </div>
                            </div>
                            {level === 1 && (
                                <span className="text-[10px] font-bold text-cyan-400 px-2 py-1 bg-cyan-950 rounded-full whitespace-nowrap">
                                    CURRENT
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Level 2: Architect */}
                    <div className={`p-4 rounded-lg border transition-all ${level === 2
                        ? 'bg-cyan-950/20 border-cyan-500/50'
                        : level > 2
                            ? 'bg-slate-900 border-slate-800'
                            : 'bg-slate-900/50 border-slate-800/50'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                {level >= 2 ? (
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <Lock className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                    <div className={`font-bold mb-1 ${level >= 2 ? 'text-white' : 'text-slate-500'}`}>
                                        Level 2: Architect
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2">
                                        Building a routine that fits your life
                                    </p>
                                    {level < 2 && (
                                        <p className="text-xs text-slate-600 italic">
                                            {UNLOCK_CRITERIA[2]}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {level === 2 && (
                                <span className="text-[10px] font-bold text-cyan-400 px-2 py-1 bg-cyan-950 rounded-full whitespace-nowrap">
                                    CURRENT
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Level 3: In Control */}
                    <div className={`p-4 rounded-lg border transition-all ${level === 3
                        ? 'bg-cyan-950/20 border-cyan-500/50'
                        : 'bg-slate-900/50 border-slate-800/50'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                {level >= 3 ? (
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <Lock className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                    <div className={`font-bold mb-1 ${level >= 3 ? 'text-white' : 'text-slate-500'}`}>
                                        Level 3: In Control
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2">
                                        Food, movement, and sleep aligned
                                    </p>
                                    {level < 3 && (
                                        <p className="text-xs text-slate-600 italic">
                                            {UNLOCK_CRITERIA[3]}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {level === 3 && (
                                <span className="text-[10px] font-bold text-cyan-400 px-2 py-1 bg-cyan-950 rounded-full whitespace-nowrap">
                                    CURRENT
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 5: "RIGHT NOW" FOCUS */}
            <div className="bg-gradient-to-br from-cyan-950/20 to-slate-900 border border-cyan-500/30 p-5 rounded-xl">
                <div className="text-sm font-bold text-cyan-400 mb-3 tracking-wide">
                    Right now, focus on:
                </div>
                <div className="space-y-2">
                    {focusItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                            <span className="text-sm text-slate-200">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 6: 10-DAY CHECK-IN */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                    <Activity className="w-4 h-4" />
                    10-day check-in
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-sm text-slate-400 mb-3">One data point. No judgement.</p>
                    <WeightTracker />
                    <div className="mt-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                        <p className="text-xs text-slate-500 font-bold mb-1">Tip:</p>
                        <ul className="text-xs text-slate-400 space-y-0.5 list-disc list-inside">
                            <li>Same scale</li>
                            <li>Morning time</li>
                            <li>Don't re-check today</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* SECTION 7: WEEKLY IDENTITY SNAPSHOT */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <div className="text-sm font-bold text-slate-300 mb-3">This week you were:</div>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Active:</span>
                        <span className="text-lg font-bold text-emerald-400">{snapshot.activeDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Ate with awareness:</span>
                        <span className="text-lg font-bold text-cyan-400">{snapshot.awarenessDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Rested:</span>
                        <span className="text-lg font-bold text-slate-400">{snapshot.restDays} days</span>
                    </div>
                </div>
                <p className="text-sm text-slate-500 italic border-t border-slate-800/50 pt-3">
                    Still in the game.
                </p>
            </div>

            {/* USEFUL OPTIONS */}
            <div className="space-y-3 pt-6 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                    <Info className="w-4 h-4" />
                    Data Options
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-between w-full p-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-950 rounded-lg group-hover:bg-slate-900 transition-colors">
                                <Download className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-slate-200">Export Data</span>
                                <span className="block text-xs text-slate-500">Download your logs as CSV</span>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to reset everything? This cannot be undone.')) {
                                localStorage.removeItem('shiftfit-storage');
                                window.location.reload();
                            }
                        }}
                        className="flex items-center justify-between w-full p-4 bg-slate-950/50 border border-slate-800/50 hover:bg-red-950/10 hover:border-red-900/30 rounded-xl transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-900 rounded-lg">
                                <Trash2 className="w-5 h-5 text-slate-600 group-hover:text-red-500 transition-colors" />
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-slate-400 group-hover:text-red-400 transition-colors">Reset Application</span>
                                <span className="block text-xs text-slate-600 group-hover:text-red-800/70">Delete all data & restart</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
