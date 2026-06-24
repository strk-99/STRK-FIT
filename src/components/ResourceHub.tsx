import { useState } from 'react';
import { Brain, Scale, Zap, Plus, Link as LinkIcon, Trash2, ExternalLink, Play } from 'lucide-react';
import { useStore } from '../store';

// Helper to extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Helper to get YouTube thumbnail URL
function getYouTubeThumbnail(url: string): string | null {
    const videoId = getYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
}

// Helper to check if URL is a YouTube link
function isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
}

export function ResourceHub() {
    const { resources, addResource, removeResource } = useStore();
    const [activeTab, setActiveTab] = useState<'Fitness' | 'Food' | 'Learnings'>('Fitness');

    // Local state for adding resource
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = () => {
        if (!newTitle || !newUrl) return;
        addResource({
            id: crypto.randomUUID(),
            title: newTitle,
            url: newUrl,
            category: activeTab, // Use current tab as category
            description: ''
        });
        setNewTitle('');
        setNewUrl('');
        setIsAdding(false);
    };

    const filteredResources = resources.filter(r => r.category === activeTab);

    return (
        <div className="p-4 space-y-6 pb-24 animate-fade-up">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Brain className="w-6 h-6 text-white" />
                    Your knowledge base
                </h1>
                <p className="text-sm text-white/35">Use these when you're unsure</p>
            </div>

            <div className="space-y-2">
                <p className="text-xs text-white/35 uppercase font-bold tracking-wider">Quick Access</p>
                {/* 3 TOP CARDS */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => setActiveTab('Food')}
                        className="bg-white/[0.06] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.07] transition-colors"
                    >
                        <div className="p-2 bg-white/[0.06] rounded-full text-white">
                            <Scale className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Food</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('Fitness')}
                        className="bg-white/[0.06] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.07] transition-colors"
                    >
                        <div className="p-2 bg-purple-950/30 rounded-full text-purple-400">
                            <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Fitness</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('Learnings')}
                        className="bg-white/[0.06] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.07] transition-colors"
                    >
                        <div className="p-2 bg-orange-950/30 rounded-full text-orange-400">
                            <Brain className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Learnings</span>
                    </button>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="space-y-4">
                {/* Category Header with Add Button */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-emerald-400 uppercase tracking-wider">
                        {activeTab}
                    </h2>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/[0.13] text-white/50 hover:text-white transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                {isAdding && (
                    <div className="bg-white/[0.06] p-4 rounded-xl border border-white/10 space-y-3 mb-4 animate-in slide-in-from-top-2">
                        <input
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder="Resource Title"
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                        />
                        <input
                            value={newUrl}
                            onChange={e => setNewUrl(e.target.value)}
                            placeholder="Link URL"
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleAdd} className="flex-1 bg-white/[0.12] hover:bg-sky-500 text-white py-2 rounded font-bold text-sm transition-colors">Save</button>
                            <button onClick={() => setIsAdding(false)} className="flex-1 bg-white/10 hover:bg-white/[0.13] text-white/70 py-2 rounded font-bold text-sm transition-colors">Cancel</button>
                        </div>
                    </div>
                )}

                {filteredResources.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-black/30">
                        <p className="text-white/35 text-sm italic">No {activeTab.toLowerCase()} resources saved.</p>
                        <button onClick={() => setIsAdding(true)} className="text-emerald-500 text-xs font-bold mt-2 hover:underline">
                            Tap + to add one
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredResources.map(res => {
                            const isYouTube = isYouTubeUrl(res.url);
                            const thumbnail = isYouTube ? getYouTubeThumbnail(res.url) : null;

                            return (
                                <div key={res.id} className="group relative">
                                    <a
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-white/[0.06] border border-white/10 rounded-xl overflow-hidden hover:border-white/40 hover:shadow-lg hover:shadow-sky-500/10 transition-all"
                                    >
                                        <div className="flex gap-3 p-3">
                                            {/* Thumbnail or Icon */}
                                            <div className="flex-shrink-0">
                                                {thumbnail ? (
                                                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black">
                                                        <img
                                                            src={thumbnail}
                                                            alt={res.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                                            <div className="bg-red-600 rounded-full p-1.5">
                                                                <Play className="w-3 h-3 text-white fill-white" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-16 bg-gradient-to-br from-sky-950/30 to-slate-950 border border-white/10 rounded-lg flex items-center justify-center">
                                                        <LinkIcon className="w-6 h-6 text-white/50" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-bold text-white/90 text-sm leading-tight group-hover:text-white transition-colors">
                                                        {res.title || 'Untitled Resource'}
                                                    </h3>
                                                    <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white flex-shrink-0 transition-colors" />
                                                </div>
                                                <p className="text-xs text-white/35 mt-1 truncate">
                                                    {isYouTube ? 'YouTube Video' : (() => {
                                                        try {
                                                            return new URL(res.url).hostname;
                                                        } catch {
                                                            return res.url;
                                                        }
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                    </a>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeResource(res.id);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-black/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-950 hover:text-red-400 text-white/50 transition-all z-10"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
