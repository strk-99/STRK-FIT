import { Calendar, Home, Trophy, User, BookOpen, History } from 'lucide-react';
import { cn } from '../lib/utils';

import logo from '../assets/logo.png';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: 'home' | 'calendar' | 'history' | 'review' | 'profile' | 'resources';
    onTabChange: (tab: 'home' | 'calendar' | 'history' | 'review' | 'profile' | 'resources') => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
    return (
        <div className="h-screen bg-slate-950 flex justify-center text-slate-200 overflow-hidden">
            <div className="w-full max-w-md bg-slate-950 h-screen relative flex flex-col shadow-2xl shadow-cyan-900/10 border-x border-slate-900">
                {/* App Header */}
                <header className="flex-shrink-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50 shadow-lg shadow-cyan-900/20">
                    <div className="px-4 pt-4 pb-0 flex items-center justify-center relative overflow-hidden">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-emerald-500/5 to-cyan-500/5 animate-pulse"></div>

                        {/* Main logo - Fixed height container to crop vertical whitespace */}
                        <div className="relative z-10 animate-float h-16 w-full flex items-center justify-center overflow-hidden -mb-5">
                            <img
                                src={logo}
                                alt="STRK-FIT"
                                className="w-[250px] max-w-none h-auto object-center"
                            />
                        </div>

                        {/* Glow effects */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                    </div>
                </header>

                {/* Content Area - Scrollable */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24">
                    {children}
                </main>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 w-full max-w-md bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-2 py-4 flex justify-between z-40">
                    <button
                        onClick={() => onTabChange('home')}
                        className={cn("flex-1 flex flex-col items-center gap-1 transition-all", currentTab === 'home' ? "text-cyan-400" : "text-slate-600 hover:text-slate-400")}
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Today</span>
                    </button>

                    <button
                        onClick={() => onTabChange('calendar')}
                        className={cn("flex-1 flex flex-col items-center gap-1 transition-all", currentTab === 'calendar' ? "text-cyan-400" : "text-slate-600 hover:text-slate-400")}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Schedule</span>
                    </button>

                    <button
                        onClick={() => onTabChange('history')}
                        className={cn("flex-1 flex flex-col items-center gap-1 transition-all", currentTab === 'history' ? "text-cyan-400" : "text-slate-600 hover:text-slate-400")}
                    >
                        <History className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">History</span>
                    </button>

                    <button
                        onClick={() => onTabChange('resources')}
                        className={cn("flex-1 flex flex-col items-center gap-1 transition-all", currentTab === 'resources' ? "text-cyan-400" : "text-slate-600 hover:text-slate-400")}
                    >
                        <BookOpen className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Rules</span>
                    </button>

                    <button
                        onClick={() => onTabChange('review')}
                        className={cn("flex-1 flex flex-col items-center gap-1 transition-all", currentTab === 'review' ? "text-cyan-400" : "text-slate-600 hover:text-slate-400")}
                    >
                        <Trophy className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Review</span>
                    </button>

                    <button
                        onClick={() => onTabChange('profile')}
                        className={cn("flex-1 flex flex-col items-center gap-1 transition-all", currentTab === 'profile' ? "text-cyan-400" : "text-slate-600 hover:text-slate-400")}
                    >
                        <User className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
