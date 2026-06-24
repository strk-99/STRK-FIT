import { useState } from 'react';
import { useStore } from '../store';
import { format } from 'date-fns';
import { Plus, Trash2, Edit2, Save, X, StickyNote, Tag } from 'lucide-react';

export function NotesList() {
    const { logs, addNote, updateNote, deleteNote } = useStore();
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const log = logs[dateStr];
    const notes = log?.notes || [];

    const [showAddForm, setShowAddForm] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteCategory, setNoteCategory] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editCategory, setEditCategory] = useState('');

    const handleAddNote = () => {
        if (!noteTitle.trim() && !noteContent.trim()) return;

        addNote(dateStr, {
            title: noteTitle || 'Untitled Note',
            content: noteContent,
            category: noteCategory || undefined
        });

        // Reset form
        setNoteTitle('');
        setNoteContent('');
        setNoteCategory('');
        setShowAddForm(false);
    };

    const handleStartEdit = (noteId: string) => {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            setEditingNoteId(noteId);
            setEditTitle(note.title);
            setEditContent(note.content);
            setEditCategory(note.category || '');
        }
    };

    const handleSaveEdit = () => {
        if (!editingNoteId) return;

        updateNote(dateStr, editingNoteId, {
            title: editTitle || 'Untitled Note',
            content: editContent,
            category: editCategory || undefined
        });

        setEditingNoteId(null);
        setEditTitle('');
        setEditContent('');
        setEditCategory('');
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditTitle('');
        setEditContent('');
        setEditCategory('');
    };

    const getCategoryColor = (category?: string) => {
        if (!category) return 'text-slate-500';

        const hash = category.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        const colors = [
            'text-purple-400',
            'text-blue-400',
            'text-green-400',
            'text-yellow-400',
            'text-pink-400',
            'text-indigo-400',
            'text-cyan-400',
            'text-orange-400'
        ];
        return colors[hash % colors.length];
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                        <StickyNote className="w-5 h-5 text-violet-400" />
                        Notes
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-violet-700/50 hover:bg-violet-600 text-violet-100 p-2 rounded-lg transition-colors"
                >
                    {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
            </div>

            {/* Add Note Form */}
            {showAddForm && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-3 animate-fade-up">
                    <input
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Note title..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-violet-500 transition-colors"
                    />

                    <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Write your thoughts..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                        rows={4}
                    />

                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <input
                            value={noteCategory}
                            onChange={(e) => setNoteCategory(e.target.value)}
                            placeholder="Category (optional)..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleAddNote}
                            className="flex-1 bg-violet-700/50 hover:bg-violet-600 text-violet-100 font-bold py-2 rounded-lg transition-colors"
                        >
                            Save Note
                        </button>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setNoteTitle('');
                                setNoteContent('');
                                setNoteCategory('');
                            }}
                            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Notes List */}
            {notes.length === 0 ? (
                <div className="text-center py-8">
                    <StickyNote className="w-12 h-12 text-slate-800 mx-auto mb-3" />
                    <p className="text-slate-600 text-sm italic">No notes yet. Start writing!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => {
                        const isEditing = editingNoteId === note.id;

                        return (
                            <div
                                key={note.id}
                                className="group bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-violet-700/50 transition-all"
                            >
                                {isEditing ? (
                                    // Edit Mode
                                    <div className="space-y-3">
                                        <input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-violet-500 transition-colors"
                                        />
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                                            rows={4}
                                        />
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-slate-500" />
                                            <input
                                                value={editCategory}
                                                onChange={(e) => setEditCategory(e.target.value)}
                                                placeholder="Category..."
                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-violet-700/50 hover:bg-violet-600 text-violet-100 text-xs font-bold rounded transition-colors"
                                            >
                                                <Save className="w-3 h-3" />
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold text-white mb-1">
                                                    {note.title}
                                                </h3>
                                                {note.category && (
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <Tag className={`w-3 h-3 ${getCategoryColor(note.category)}`} />
                                                        <span className={`text-xs ${getCategoryColor(note.category)}`}>
                                                            {note.category}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleStartEdit(note.id)}
                                                    className="p-1.5 text-slate-500 hover:text-violet-400 transition-colors"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteNote(dateStr, note.id)}
                                                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                                            {note.content}
                                        </p>
                                        <div className="mt-3 pt-2 border-t border-slate-800/50">
                                            <p className="text-[10px] text-slate-600 font-mono">
                                                {format(new Date(note.updatedAt), 'MMM d, yyyy • h:mm a')}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
