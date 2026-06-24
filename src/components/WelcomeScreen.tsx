import { useEffect } from 'react';

interface WelcomeScreenProps {
    onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            onClick={onComplete}
            className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden cursor-pointer"
        >
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px] animate-pulse"></div>

            {/* Glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Main card container */}
            <div className="relative max-w-md w-full">
                {/* Futuristic card with glowing border */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-3xl p-4 border-2 border-white/20 shadow-2xl shadow-sky-500/20 animate-fade-in">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-sky-400/50 rounded-tl-3xl"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-sky-400/50 rounded-tr-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-sky-400/50 rounded-bl-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-sky-400/50 rounded-br-3xl"></div>

                    <div className="text-center space-y-2 relative z-10">
                        {/* Welcome text */}
                        <div className="space-y-1 animate-slide-up">
                            <h1 className="text-4xl font-black text-white tracking-wider uppercase">
                                Welcome
                            </h1>
                            <h2 className="text-3xl font-black text-white tracking-wider uppercase">
                                to
                            </h2>
                        </div>

                        {/* Logo */}
                        <div className="flex justify-center py-2 animate-float">
                            <img
                                src="/logo.png"
                                alt="STRK-FIT"
                                className="h-32 w-auto object-contain scale-[2.0] drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                            />
                        </div>

                        {/* Subtitle */}
                        <p className="text-lg font-black text-white uppercase tracking-widest animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            Your Personal Fitness Diary
                        </p>

                        {/* Loading indicator */}
                        <div className="flex justify-center pt-4">
                            <div className="flex gap-3">
                                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse shadow-lg shadow-sky-400/50"></div>
                                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse shadow-lg shadow-sky-400/50" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse shadow-lg shadow-sky-400/50" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Animated scan line effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent animate-scan-line"></div>
                    </div>
                </div>

                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-emerald-500/5 to-sky-500/5 rounded-3xl blur-xl -z-10"></div>
            </div>
        </div>
    );
}
