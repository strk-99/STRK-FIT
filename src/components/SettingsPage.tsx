import { useState } from 'react';
import { Mail, Bell, Shield, FileText, Trash2, Scale, HelpCircle, ArrowLeft, Clock } from 'lucide-react';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsAndConditions } from './TermsAndConditions';
import { DataDeletionPolicy } from './DataDeletionPolicy';
import { HealthDisclaimer } from './HealthDisclaimer';
import { SupportContact } from './SupportContact';
import { useStore } from '../store';
import {
    saveNotificationSettings,
    requestNotificationPermission,
    getNotificationSettings,
    scheduleMonthlyReminder,
    clearMonthlyReminder
} from '../lib/notifications';

interface SettingsPageProps {
    onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
    const { profile, updateProfile } = useStore();
    const [monthlyReportsEnabled, setMonthlyReportsEnabled] = useState(profile?.monthlyDownloadEnabled || false);

    // Legal page modals
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showDataDeletion, setShowDataDeletion] = useState(false);
    const [showHealthDisclaimer, setShowHealthDisclaimer] = useState(false);
    const [showSupport, setShowSupport] = useState(false);

    const handleToggleNotifications = async () => {
        if (!profile) return;

        const newValue = !profile.reminderEnabled;

        if (newValue) {
            // Request permission if turning on
            const granted = await requestNotificationPermission();
            if (!granted) {
                alert('Please enable notifications for STRK-FIT in your device Settings.');
                return;
            }
        }

        updateProfile({ reminderEnabled: newValue });

        // Sync with notification system
        const currentSettings = getNotificationSettings();
        saveNotificationSettings({
            ...currentSettings,
            enabled: newValue,
            dailyReminder: newValue,
            reminderTime: profile.reminderTime || '20:00'
        });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;
        const newTime = e.target.value;

        updateProfile({ reminderTime: newTime });

        // Sync with notification system
        const currentSettings = getNotificationSettings();
        saveNotificationSettings({
            ...currentSettings,
            reminderTime: newTime
        });
    };

    const handleToggleMonthlyReports = async () => {
        const newValue = !monthlyReportsEnabled;
        setMonthlyReportsEnabled(newValue);
        if (profile) {
            updateProfile({ monthlyDownloadEnabled: newValue });
        }

        const currentSettings = getNotificationSettings();
        if (newValue) {
            // Schedule the monthly reminder
            // Request permission first if needed (should be covered by generic request, but good to be safe)
            const granted = await requestNotificationPermission();
            if (granted) {
                await scheduleMonthlyReminder();
            } else {
                alert('Notification permission required for monthly reports.');
                // Revert visual toggle if permission denied? Optional. 
                // For this demo let's keep it simple.
            }
        } else {
            // Clear the monthly reminder
            await clearMonthlyReminder();
        }

        saveNotificationSettings({
            ...currentSettings,
            monthlyReminders: newValue
        });
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
            {/* Header */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-4 p-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Settings</h1>
                        <p className="text-sm text-slate-400">Manage your preferences</p>
                    </div>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6 max-w-2xl mx-auto pb-8">
                    {/* Monthly Email Reports Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            Email Reports
                        </h3>
                        <button
                            onClick={handleToggleMonthlyReports}
                            className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-violet-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-white">Monthly Progress Reports</p>
                                    <p className="text-xs text-slate-400">CSV reports sent monthly</p>
                                </div>
                            </div>
                            <div className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${monthlyReportsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                                }`}>
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${monthlyReportsEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </div>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-800" />

                    {/* Notification Settings */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            Notifications
                        </h3>

                        {/* Streak Reminders Toggle */}
                        <button
                            onClick={handleToggleNotifications}
                            className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-white">Streak Reminders</p>
                                    <p className="text-xs text-slate-400">Get reminded to log daily</p>
                                </div>
                            </div>
                            <div className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${profile?.reminderEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                                }`}>
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${profile?.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </div>
                        </button>

                        {/* Reminder Frequency/Time (Conditional) */}
                        {profile?.reminderEnabled && (
                            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900 border border-slate-800/50 animate-fade-in">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">Daily Reminder Time</p>
                                        <p className="text-xs text-slate-500">When should we check in?</p>
                                    </div>
                                </div>
                                <input
                                    type="time"
                                    value={profile.reminderTime || '20:00'}
                                    onChange={handleTimeChange}
                                    className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-800" />

                    {/* Legal & Support Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            Legal & Support
                        </h3>

                        <div className="space-y-3">
                            {/* Privacy Policy */}
                            <button
                                onClick={() => setShowPrivacy(true)}
                                className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-violet-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">Privacy Policy</p>
                                        <p className="text-xs text-slate-400">Data protection & privacy</p>
                                    </div>
                                </div>
                                <div className="text-xs text-violet-400">
                                    View →
                                </div>
                            </button>

                            {/* Terms & Conditions */}
                            <button
                                onClick={() => setShowTerms(true)}
                                className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">Terms & Conditions</p>
                                        <p className="text-xs text-slate-400">Usage terms & agreements</p>
                                    </div>
                                </div>
                                <div className="text-xs text-cyan-400">
                                    View →
                                </div>
                            </button>

                            {/* Data Deletion */}
                            <button
                                onClick={() => setShowDataDeletion(true)}
                                className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-red-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                        <Trash2 className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">Data Deletion Policy</p>
                                        <p className="text-xs text-slate-400">Account & data removal</p>
                                    </div>
                                </div>
                                <div className="text-xs text-red-400">
                                    View →
                                </div>
                            </button>

                            {/* Health Disclaimer */}
                            <button
                                onClick={() => setShowHealthDisclaimer(true)}
                                className="w-full flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-emerald-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Scale className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">Health Disclaimer</p>
                                        <p className="text-xs text-slate-400">Medical & fitness notices</p>
                                    </div>
                                </div>
                                <div className="text-xs text-emerald-400">
                                    View →
                                </div>
                            </button>

                            {/* Support Contact */}
                            <button
                                onClick={() => setShowSupport(true)}
                                className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                        <HelpCircle className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white">Contact Support</p>
                                        <p className="text-xs text-slate-400">Get help & report issues</p>
                                    </div>
                                </div>
                                <div className="text-xs text-cyan-400">
                                    Open →
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Modals */}
            {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
            {showTerms && <TermsAndConditions onClose={() => setShowTerms(false)} />}
            {showDataDeletion && <DataDeletionPolicy onClose={() => setShowDataDeletion(false)} />}
            {showHealthDisclaimer && <HealthDisclaimer onClose={() => setShowHealthDisclaimer(false)} />}
            {showSupport && <SupportContact onClose={() => setShowSupport(false)} />}
        </div>
    );
}
