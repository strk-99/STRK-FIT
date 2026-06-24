import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { useStore, type Note } from '../store';
import { Plus, ArrowLeft, Trash2, Search, X, FileText, CheckCircle2, Circle, CheckSquare } from 'lucide-react';

export function NotesPage() {
    const { notes, addNote, updateNote, deleteNote } = useStore();

    const [viewingNote,         setViewingNote]         = useState<Note | null>(null);
    const [isNew,               setIsNew]               = useState(false);
    const [editTitle,           setEditTitle]           = useState('');
    const [editBody,            setEditBody]            = useState('');
    const [search,              setSearch]              = useState('');
    const [confirmDelete,       setConfirmDelete]       = useState<string | null>(null);
    const [selectMode,          setSelectMode]          = useState(false);
    const [selected,            setSelected]            = useState<Set<string>>(new Set());
    const [confirmMultiDelete,  setConfirmMultiDelete]  = useState(false);

    const bodyRef = useRef<HTMLTextAreaElement>(null);

    const filtered = [...notes]
        .filter(n =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.body.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // ── selection helpers ────────────────────────────────────────────────────
    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const allSelected = filtered.length > 0 && filtered.every(n => selected.has(n.id));

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filtered.map(n => n.id)));
        }
    };

    const exitSelectMode = () => {
        setSelectMode(false);
        setSelected(new Set());
    };

    const handleDeleteSelected = () => {
        selected.forEach(id => deleteNote(id));
        exitSelectMode();
        setConfirmMultiDelete(false);
    };

    // ── editor helpers ───────────────────────────────────────────────────────
    const openNote = (note: Note) => {
        setViewingNote(note);
        setEditTitle(note.title);
        setEditBody(note.body);
        setIsNew(false);
    };

    const openNew = () => {
        setViewingNote({ id: '__new__', title: '', body: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        setEditTitle('');
        setEditBody('');
        setIsNew(true);
        setTimeout(() => bodyRef.current?.focus(), 80);
    };

    const handleBack = () => {
        const hasContent = editTitle.trim() || editBody.trim();
        if (isNew && hasContent) {
            addNote({ title: editTitle.trim() || 'Untitled', body: editBody });
        } else if (!isNew && viewingNote && hasContent) {
            updateNote(viewingNote.id, { title: editTitle.trim() || 'Untitled', body: editBody });
        }
        setViewingNote(null);
        setIsNew(false);
    };

    const handleDeleteSingle = (id: string) => {
        deleteNote(id);
        if (viewingNote?.id === id) setViewingNote(null);
        setConfirmDelete(null);
    };

    // ── Note editor view ─────────────────────────────────────────────────────
    if (viewingNote) {
        return (
            <div className="flex flex-col animate-fade-up">
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80">
                    <button onClick={handleBack}
                        className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold text-sm">Notes</span>
                    </button>
                    {!isNew && (
                        <button onClick={() => setConfirmDelete(viewingNote.id)}
                            className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="px-5 pt-5 pb-32 space-y-2">
                    <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-slate-700 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-600 font-mono pb-1">
                        {format(new Date(viewingNote.updatedAt), 'MMM d, yyyy · HH:mm')}
                    </p>
                    <textarea
                        ref={bodyRef}
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                        placeholder="Start writing..."
                        className="w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-700 focus:outline-none min-h-[60vh] resize-none leading-relaxed"
                    />
                </div>

                {confirmDelete && (
                    <>
                        <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setConfirmDelete(null)} />
                        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 rounded-t-2xl p-6 space-y-4"
                            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
                            <p className="text-white font-bold text-center">Delete this note?</p>
                            <p className="text-slate-400 text-sm text-center">This cannot be undone.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setConfirmDelete(null)}
                                    className="py-3 bg-slate-800 text-slate-300 font-bold rounded-lg">Cancel</button>
                                <button onClick={() => handleDeleteSingle(confirmDelete)}
                                    className="py-3 bg-red-700/70 hover:bg-red-600 text-red-100 font-bold rounded-lg">Delete</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ── Notes list view ──────────────────────────────────────────────────────
    return (
        <div className="px-4 pt-4 pb-24 space-y-4 animate-fade-up">

            {/* header — normal mode */}
            {!selectMode ? (
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight glow-text-cyan">Notes</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {notes.length > 1 && (
                            <button onClick={() => setSelectMode(true)}
                                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-red-800/60 hover:text-red-400 hover:bg-red-950/20 transition-colors">
                                <CheckSquare className="w-3.5 h-3.5" />
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button onClick={openNew}
                            className="w-10 h-10 bg-sky-700/50 hover:bg-sky-600/60 border border-sky-800/50 rounded-full flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5 text-sky-400" />
                        </button>
                    </div>
                </div>
            ) : (
                /* header — select mode */
                <div className="flex items-center justify-between">
                    <button onClick={exitSelectMode}
                        className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <span className="text-sm font-bold text-white">
                        {selected.size > 0 ? `${selected.size} selected` : 'Select notes'}
                    </span>
                    <button
                        onClick={() => selected.size > 0 && setConfirmMultiDelete(true)}
                        disabled={selected.size === 0}
                        className="text-sm font-bold text-red-400 disabled:text-slate-600 transition-colors">
                        Delete
                    </button>
                </div>
            )}

            {/* select-all bar */}
            {selectMode && filtered.length > 0 && (
                <button onClick={toggleSelectAll}
                    className="w-full flex items-center gap-2 py-2 px-3 bg-slate-900/50 border border-slate-800 rounded-lg text-sm transition-colors hover:border-slate-600">
                    {allSelected
                        ? <CheckCircle2 className="w-4 h-4 text-sky-400" />
                        : <Circle className="w-4 h-4 text-slate-500" />}
                    <span className={allSelected ? 'text-sky-400 font-bold' : 'text-slate-400'}>
                        {allSelected ? 'Deselect all' : 'Select all'}
                    </span>
                </button>
            )}

            {/* search */}
            {!selectMode && notes.length > 3 && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-9 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                    />
                    {search && (
                        <button onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {/* notes grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                    <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                    <p className="text-slate-500 text-sm">
                        {search ? 'No notes match your search.' : 'No notes yet.'}
                    </p>
                    {!search && (
                        <button onClick={openNew}
                            className="inline-flex items-center gap-2 text-sm text-sky-400 border border-sky-800/50 px-4 py-2 rounded-lg hover:bg-sky-950/30 transition-colors">
                            <Plus className="w-4 h-4" /> Create your first note
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {filtered.map(note => {
                        const isSelected = selected.has(note.id);
                        return (
                            <button
                                key={note.id}
                                onClick={() => selectMode ? toggleSelect(note.id) : openNote(note)}
                                className={`relative text-left rounded-xl p-3.5 space-y-2 border transition-all active:scale-95 ${
                                    selectMode && isSelected
                                        ? 'bg-sky-950/30 border-sky-600'
                                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-600'
                                }`}
                            >
                                {/* selection indicator */}
                                {selectMode && (
                                    <div className="absolute top-2.5 right-2.5">
                                        {isSelected
                                            ? <CheckCircle2 className="w-4 h-4 text-sky-400" />
                                            : <Circle className="w-4 h-4 text-slate-600" />}
                                    </div>
                                )}
                                <p className={`font-bold text-sm leading-snug line-clamp-2 ${selectMode ? 'pr-5' : ''} ${isSelected ? 'text-sky-300' : 'text-white'}`}>
                                    {note.title || 'Untitled'}
                                </p>
                                {note.body ? (
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{note.body}</p>
                                ) : (
                                    <p className="text-xs text-slate-700 italic">No content</p>
                                )}
                                <p className="text-[10px] text-slate-600 font-mono">
                                    {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* multi-delete confirm */}
            {confirmMultiDelete && (
                <>
                    <div className="fixed inset-0 bg-black/70 z-40" onClick={() => setConfirmMultiDelete(false)} />
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 rounded-t-2xl p-6 space-y-4"
                        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
                        <p className="text-white font-bold text-center">
                            Delete {selected.size} {selected.size === 1 ? 'note' : 'notes'}?
                        </p>
                        <p className="text-slate-400 text-sm text-center">This cannot be undone.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setConfirmMultiDelete(false)}
                                className="py-3 bg-slate-800 text-slate-300 font-bold rounded-lg">Cancel</button>
                            <button onClick={handleDeleteSelected}
                                className="py-3 bg-red-700/70 hover:bg-red-600 text-red-100 font-bold rounded-lg">
                                Delete {selected.size}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
