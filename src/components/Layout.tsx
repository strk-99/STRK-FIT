import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, BookOpen, History, FileText, Menu, X, BarChart2, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import logo from '../assets/logo.png';

type TabType = 'home' | 'notes' | 'history' | 'review' | 'profile' | 'resources' | 'settings';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const BOTTOM_TABS = [
    { id: 'home'      as TabType, icon: Home,     label: 'Today'   },
    { id: 'notes'     as TabType, icon: FileText,  label: 'Notes'   },
    { id: 'resources' as TabType, icon: BookOpen,  label: 'Links'   },
    { id: 'profile'   as TabType, icon: User,      label: 'Profile' },
] as const;

const SIDEBAR_ITEMS = [
    { id: 'home'      as TabType, icon: Home,      label: 'Today'         },
    { id: 'notes'     as TabType, icon: FileText,  label: 'Notes'         },
    { id: 'resources' as TabType, icon: BookOpen,  label: 'Knowledge Base'},
    { id: 'history'   as TabType, icon: History,   label: 'History'       },
    { id: 'review'    as TabType, icon: BarChart2, label: 'Weekly Review' },
    { id: 'profile'   as TabType, icon: User,      label: 'Profile'       },
];

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleNavClick = (tab: TabType) => {
        onTabChange(tab);
        setSidebarOpen(false);
    };

    return (
        <div
            className="h-screen flex justify-center overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #050c1e 0%, #080f24 55%, #060a1a 100%)' }}
        >
            <div className="w-full max-w-md h-screen relative flex flex-col">

                {/* Ambient background orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                        className="absolute top-[-15%] left-[15%] w-72 h-72 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute top-[45%] right-[-8%] w-52 h-52 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute bottom-[15%] left-[-10%] w-44 h-44 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)' }}
                    />
                </div>

                {/* ── Header ── */}
                <header
                    className="flex-shrink-0 z-50 glass-nav border-b"
                    style={{ paddingTop: 'env(safe-area-inset-top)' }}
                >
                    <div className="px-4 py-3 flex items-center justify-between">
                        <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-xl text-sky-400 hover:bg-white/[0.06] transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </motion.button>

                        <div className="h-10 flex items-center justify-center overflow-hidden">
                            <img
                                src={logo}
                                alt="STRK-FIT"
                                className="w-[155px] h-auto object-contain"
                            />
                        </div>

                        <div className="w-9" />
                    </div>
                </header>

                {/* ── Sidebar overlay ── */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 bg-black/55 backdrop-blur-sm z-40"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* ── Sidebar drawer ── */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            key="sidebar"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                            className="fixed top-0 left-0 h-full w-72 z-50 border-r border-white/[0.07]"
                            style={{
                                background: 'rgba(5, 12, 30, 0.96)',
                                backdropFilter: 'blur(32px)',
                                WebkitBackdropFilter: 'blur(32px)',
                                paddingTop: 'env(safe-area-inset-top)',
                            }}
                        >
                            <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.07]">
                                <span className="text-sm font-bold text-sky-400 tracking-widest uppercase">Menu</span>
                                <motion.button
                                    whileTap={{ scale: 0.88 }}
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-white/[0.06] transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>

                            <nav className="p-3 space-y-1">
                                {SIDEBAR_ITEMS.map(({ id, icon: Icon, label }) => {
                                    const active = currentTab === id;
                                    return (
                                        <motion.button
                                            key={id}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleNavClick(id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                                                active
                                                    ? "bg-sky-500/12 text-sky-400 border border-sky-500/20"
                                                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                                                active ? "bg-sky-500/20" : "bg-white/[0.05]"
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-sm">{label}</span>
                                            {active && (
                                                <motion.span
                                                    layoutId="sidebar-dot"
                                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400"
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}

                                {/* Reload button at bottom of sidebar */}
                                <div className="pt-3 mt-3 border-t border-white/[0.07]">
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => window.location.reload()}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/[0.04] hover:text-slate-300 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] flex-shrink-0">
                                            <RefreshCw className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-sm">Reload App</span>
                                    </motion.button>
                                </div>
                            </nav>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* ── Content area ── */}
                <main
                    className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10"
                    style={{ paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* ── Bottom navigation ── */}
                <div
                    className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t"
                    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
                >
                    <div className="max-w-md mx-auto flex justify-around items-end pt-2 px-2">
                        {BOTTOM_TABS.map(({ id, icon: Icon, label }) => {
                            const active = currentTab === id;
                            return (
                                <motion.button
                                    key={id}
                                    whileTap={{ scale: 0.88 }}
                                    onClick={() => onTabChange(id)}
                                    className="relative flex flex-col items-center gap-0.5 flex-1 pb-1"
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="tab-pill"
                                            className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-sky-400"
                                            style={{ boxShadow: '0 0 10px rgba(56,189,248,0.8)' }}
                                        />
                                    )}
                                    <div className={cn(
                                        "w-11 h-10 rounded-2xl flex items-center justify-center transition-all duration-200",
                                        active
                                            ? "bg-sky-500/15 text-sky-400"
                                            : "text-slate-500"
                                    )}>
                                        <Icon className={cn("transition-all duration-200", active ? "w-[22px] h-[22px]" : "w-5 h-5")} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-semibold tracking-wide transition-all duration-200",
                                        active ? "text-sky-400" : "text-slate-600"
                                    )}>
                                        {label}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
