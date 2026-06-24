import { useState } from 'react';
import { useStore, type PriorityLevel, type Task } from '../store';
import { format } from 'date-fns';
import {
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const PRIORITY_CONFIG = {
    critical: {
        label: 'Critical',
        color: 'text-red-400',
        bgColor: 'bg-red-950/30',
        borderColor: 'border-red-800/50',
        hoverBorder: 'hover:border-red-700',
        icon: '🔴',
        order: 0
    },
    high: {
        label: 'High',
        color: 'text-orange-400',
        bgColor: 'bg-orange-950/30',
        borderColor: 'border-orange-800/50',
        hoverBorder: 'hover:border-orange-700',
        icon: '🟠',
        order: 1
    },
    medium: {
        label: 'Medium',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-950/30',
        borderColor: 'border-yellow-800/50',
        hoverBorder: 'hover:border-yellow-700',
        icon: '🟡',
        order: 2
    },
    low: {
        label: 'Low',
        color: 'text-slate-400',
        bgColor: 'bg-slate-950/30',
        borderColor: 'border-slate-800/50',
        hoverBorder: 'hover:border-slate-700',
        icon: '⚪',
        order: 3
    }
};

export function TaskList() {
    const { logs, addTask, deleteTask, toggleTaskComplete, updateTask } = useStore();
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const log = logs[dateStr];
    const tasks = log?.tasks || [];

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>('medium');
    const [reminderTime, setReminderTime] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    // Sort tasks by priority and completion status
    const sortedTasks = [...tasks].sort((a, b) => {
        // Incomplete tasks first
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        // Then by priority
        return PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
    });

    const handleAddTask = () => {
        if (!taskTitle.trim()) return;

        addTask(dateStr, {
            title: taskTitle,
            notes: taskDescription || undefined,
            priority: selectedPriority,
            completed: false,
            reminderEnabled: !!reminderTime,
            reminderTime: reminderTime || undefined,
            reminderRepeat: 'none',
            reminderDays: [],
        });

        // Reset form
        setTaskTitle('');
        setTaskDescription('');
        setSelectedPriority('medium');
        setReminderTime('');
        setShowAddForm(false);
    };

    const handleToggleReminder = (task: Task) => {
        updateTask(dateStr, task.id, {
            reminderEnabled: !task.reminderEnabled
        });
    };

    const handleUpdateReminderTime = (taskId: string, time: string) => {
        updateTask(dateStr, taskId, {
            reminderTime: time,
            reminderEnabled: !!time
        });
    };

    const getPriorityStats = () => {
        const stats = {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            critical: tasks.filter(t => t.priority === 'critical' && !t.completed).length,
            high: tasks.filter(t => t.priority === 'high' && !t.completed).length
        };
        return stats;
    };

    const stats = getPriorityStats();

    return (
        <div className="space-y-4">
            {/* Header with Stats */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Tasks</h2>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="text-slate-400">
                            {stats.completed}/{stats.total} completed
                        </span>
                        {stats.critical > 0 && (
                            <span className="text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {stats.critical} critical
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-sky-700/50 hover:bg-sky-600 text-sky-100 p-2 rounded-lg transition-colors"
                >
                    {showAddForm ? <ChevronUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
            </div>

            {/* Add Task Form */}
            {showAddForm && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-3 animate-fade-up">
                    <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Task title..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddTask()}
                    />

                    <textarea
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Description (optional)..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors resize-none"
                        rows={2}
                    />

                    {/* Priority Selection */}
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Priority</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['critical', 'high', 'medium', 'low'] as PriorityLevel[]).map((priority) => (
                                <button
                                    key={priority}
                                    onClick={() => setSelectedPriority(priority)}
                                    className={`p-2 rounded-lg border transition-all ${
                                        selectedPriority === priority
                                            ? `${PRIORITY_CONFIG[priority].bgColor} ${PRIORITY_CONFIG[priority].borderColor} scale-105`
                                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-1 justify-center">
                                        <span>{PRIORITY_CONFIG[priority].icon}</span>
                                        <span className={`text-xs font-bold ${
                                            selectedPriority === priority
                                                ? PRIORITY_CONFIG[priority].color
                                                : 'text-slate-600'
                                        }`}>
                                            {PRIORITY_CONFIG[priority].label}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reminder Time */}
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Reminder (optional)
                        </label>
                        <input
                            type="time"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                        />
                    </div>

                    <button
                        onClick={handleAddTask}
                        disabled={!taskTitle.trim()}
                        className="w-full bg-sky-700/50 hover:bg-sky-600 disabled:bg-slate-800 disabled:text-slate-600 text-sky-100 font-bold py-2 rounded-lg transition-colors"
                    >
                        Add Task
                    </button>
                </div>
            )}

            {/* Task List */}
            {tasks.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-600 text-sm italic">No tasks yet. Add your first task!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {sortedTasks.map((task) => {
                        const config = PRIORITY_CONFIG[task.priority];
                        const isEditing = editingTaskId === task.id;

                        return (
                            <div
                                key={task.id}
                                className={`group rounded-lg border transition-all ${
                                    task.completed
                                        ? 'bg-slate-900/30 border-slate-800/50'
                                        : `${config.bgColor} ${config.borderColor} ${config.hoverBorder}`
                                }`}
                            >
                                <div className="p-3 flex items-start gap-3">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleTaskComplete(dateStr, task.id)}
                                        className="flex-shrink-0 mt-0.5"
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <Circle className={`w-5 h-5 ${config.color} hover:text-emerald-400`} />
                                        )}
                                    </button>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs">{config.icon}</span>
                                                    <h3 className={`text-sm font-semibold ${
                                                        task.completed
                                                            ? 'text-slate-500 line-through'
                                                            : 'text-white'
                                                    }`}>
                                                        {task.title}
                                                    </h3>
                                                </div>
                                                {task.notes && (
                                                    <p className={`text-xs mt-1 ${
                                                        task.completed ? 'text-slate-600' : 'text-slate-400'
                                                    }`}>
                                                        {task.notes}
                                                    </p>
                                                )}

                                                {/* Reminder */}
                                                {task.reminderTime && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {isEditing ? (
                                                            <input
                                                                type="time"
                                                                value={task.reminderTime}
                                                                onChange={(e) => handleUpdateReminderTime(task.id, e.target.value)}
                                                                onBlur={() => setEditingTaskId(null)}
                                                                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-sky-500"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <button
                                                                onClick={() => setEditingTaskId(task.id)}
                                                                className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                                                    task.reminderEnabled
                                                                        ? 'bg-sky-950/50 text-sky-400 border border-sky-800/50'
                                                                        : 'bg-slate-950/50 text-slate-500 border border-slate-800/50'
                                                                }`}
                                                            >
                                                                <Clock className="w-3 h-3" />
                                                                {task.reminderTime}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleToggleReminder(task)}
                                                            className="text-xs text-slate-500 hover:text-sky-400 transition-colors"
                                                        >
                                                            {task.reminderEnabled ? 'Enabled' : 'Disabled'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => deleteTask(dateStr, task.id)}
                                                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
