import { useState } from 'react';
import { Home, Trophy, User, BookOpen, History, FileText, Menu, X, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

import logo from '../assets/logo.png';

type TabType = 'home' | 'notes' | 'history' | 'review' | 'profile' | 'resources' | 'settings';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleNavClick = (tab: TabType) => {
        onTabChange(tab);
        setSidebarOpen(false);
    };

    return (
        <div className="h-screen bg-slate-950 flex justify-center text-slate-200 overflow-hidden">
            <div className="w-full max-w-md bg-slate-950 h-screen relative flex flex-col shadow-2xl shadow-cyan-900/10 border-x border-slate-900">
                {/* App Header */}
                <header className="flex-shrink-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50 shadow-lg shadow-cyan-900/20" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
                    <div className="px-4 pt-4 pb-0 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-emerald-500/5 to-cyan-500/5 animate-pulse"></div>

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="relative z-20 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="relative z-10 animate-float h-16 flex items-center justify-center overflow-hidden -mb-5">
                            <img
                                src={logo}
                                alt="STRK-FIT"
                                className="w-[200px] max-w-none h-auto object-center"
                            />
                        </div>

                        <div className="w-10"></div>

                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                    </div>
                </header>

                {/* Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Drawer */}
                <div
                    className={cn(
                        "fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    style={{ paddingTop: 'env(safe-area-inset-top)' }}
                >
                    <div className="flex items-center justify-between p-4 border-b border-slate-800">
                        <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-wider">Menu</h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="p-4 space-y-2">
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500 uppercase font-bold px-3 mb-2">Main</p>
                            <button
                                onClick={() => handleNavClick('home')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                                    currentTab === 'home'
                                        ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                                )}
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-semibold">Tracker</span>
                            </button>

                            <button
                                onClick={() => handleNavClick('notes')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                                    currentTab === 'notes'
                                        ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                                )}
                            >
                                <FileText className="w-5 h-5" />
                                <span className="font-semibold">Notes</span>
                            </button>

                            <button
                                onClick={() => handleNavClick('resources')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                                    currentTab === 'resources'
                                        ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                                )}
                            >
                                <BookOpen className="w-5 h-5" />
                                <span className="font-semibold">Knowledge Base</span>
                            </button>
                        </div>

                        <div className="pt-4 space-y-1">
                            <p className="text-xs text-slate-500 uppercase font-bold px-3 mb-2">More</p>
                            <button
                                onClick={() => handleNavClick('history')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                                    currentTab === 'history'
                                        ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                                )}
                            >
                                <History className="w-5 h-5" />
                                <span className="font-semibold">History</span>
                            </button>

                            <button
                                onClick={() => handleNavClick('review')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                                    currentTab === 'review'
                                        ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                                )}
                            >
                                <Trophy className="w-5 h-5" />
                                <span className="font-semibold">Weekly Review</span>
                            </button>

                            <button
                                onClick={() => handleNavClick('settings')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                                    currentTab === 'settings'
                                        ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                                )}
                            >
                                <Settings className="w-5 h-5" />
                                <span className="font-semibold">Settings</span>
                            </button>

                            <button
                                onClick={() => handleNavClick('profile')}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                                    currentTab === 'profile'
                                        ? "bg-cyan-950/50 text-cyan-400 border border-cyan-800/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                                )}
                            >
                                <User className="w-5 h-5" />
                                <span className="font-semibold">Profile</span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Content Area - Scrollable */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
                    {children}
                </main>

                {/* Bottom Navigation - 4 Primary Tabs */}
                <div className="fixed bottom-0 w-full max-w-md bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-2 pt-3 flex justify-around z-40" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
                    <button
                        onClick={() => onTabChange('home')}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all px-3 py-2 rounded-lg flex-1",
                            currentTab === 'home'
                                ? "text-cyan-400 bg-cyan-950/30 border border-cyan-800/50"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Tracker</span>
                    </button>

                    <button
                        onClick={() => onTabChange('notes')}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all px-3 py-2 rounded-lg flex-1",
                            currentTab === 'notes'
                                ? "text-cyan-400 bg-cyan-950/30 border border-cyan-800/50"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Notes</span>
                    </button>

                    <button
                        onClick={() => onTabChange('resources')}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all px-3 py-2 rounded-lg flex-1",
                            currentTab === 'resources'
                                ? "text-cyan-400 bg-cyan-950/30 border border-cyan-800/50"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <BookOpen className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">KB</span>
                    </button>

                    <button
                        onClick={() => onTabChange('profile')}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all px-3 py-2 rounded-lg flex-1",
                            currentTab === 'profile'
                                ? "text-cyan-400 bg-cyan-950/30 border border-cyan-800/50"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <User className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
