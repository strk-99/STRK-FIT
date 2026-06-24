import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

/**
 * Exports all user data (Profile, Logs, Shift History, Weight History, Resources) 
 * to a CSV file.
 * - On Web: Triggers a browser download.
 * - On Native (Android/iOS): Saves to Cache and opens Share dialog.
 * 
 * @param state The entire Zustand store state or an object containing the required data slices.
 */
export async function exportUserDataToCSV(state: any) {
    if (!state) {
        console.warn('No state provided for export');
        return;
    }

    let csvContent = '';

    // Profile Information
    csvContent += '=== PROFILE INFORMATION ===\n';
    if (state.profile) {
        csvContent += 'Name,' + (state.profile.name || '') + '\n';
        csvContent += 'Age,' + (state.profile.age || '') + '\n';
        csvContent += 'DOB,' + (state.profile.dob || '') + '\n';
        csvContent += 'Height (cm),' + (state.profile.height || '') + '\n';
        csvContent += 'Current Weight (kg),' + (state.profile.currentWeight || '') + '\n';
        csvContent += 'Target Weight (kg),' + (state.profile.targetWeight || '') + '\n';
        csvContent += 'Level,' + (state.profile.level || 1) + '\n';
        csvContent += 'XP,' + (state.profile.xp || 0) + '\n';
    }

    // helper: escape a value for CSV (wrap in quotes if it contains comma/newline/quote)
    const esc = (v: any): string => {
        const s = String(v ?? '');
        return s.includes(',') || s.includes('\n') || s.includes('"')
            ? `"${s.replace(/"/g, '""')}"` : s;
    };

    // sorted log entries reused across sections
    const sortedLogs: any[] = state.logs
        ? (Array.isArray(state.logs)
            ? state.logs
            : Object.entries(state.logs).map(([date, log]) => ({ date, ...log as any }))
          ).sort((a: any, b: any) => a.date.localeCompare(b.date))
        : [];

    csvContent += '\n=== DAILY LOGS ===\n';
    csvContent += 'Date,Workout Done,Protein Est,Steps,Water (glasses),Sleep (hours),Mood\n';
    sortedLogs.forEach((log: any) => {
        csvContent += `${log.date},${log.workoutDone ? 'Yes' : 'No'},${log.proteinEst || 'med'},${log.steps || 0},${log.water || 0},${log.sleep || 0},${log.mood || ''}\n`;
    });

    csvContent += '\n=== DAILY JOURNAL ===\n';
    csvContent += 'Date,Journal Entry\n';
    sortedLogs.forEach((log: any) => {
        if (log.dailyJournal?.trim()) {
            csvContent += `${log.date},${esc(log.dailyJournal.trim())}\n`;
        }
    });

    csvContent += '\n=== HABITS LOG ===\n';
    csvContent += 'Date,Habit,Done,Note\n';
    if (state.habits && sortedLogs.length > 0) {
        const habitMap: Record<string, string> = {};
        (state.habits as any[]).forEach((h: any) => { habitMap[h.id] = `${h.emoji} ${h.name}`; });
        sortedLogs.forEach((log: any) => {
            if (log.habitLog) {
                Object.entries(log.habitLog).forEach(([habitId, entry]: [string, any]) => {
                    const done = typeof entry === 'boolean' ? entry : entry?.done;
                    const note = typeof entry === 'object' ? (entry?.note || '') : '';
                    if (done || note) {
                        csvContent += `${log.date},${esc(habitMap[habitId] || habitId)},${done ? 'Yes' : 'No'},${esc(note)}\n`;
                    }
                });
            }
        });
    }

    csvContent += '\n=== TASKS ===\n';
    csvContent += 'Date,Title,Priority,Completed,Completed At,Notes\n';
    sortedLogs.forEach((log: any) => {
        if (log.tasks && log.tasks.length > 0) {
            log.tasks.forEach((task: any) => {
                csvContent += `${log.date},${esc(task.title)},${task.priority || ''},${task.completed ? 'Yes' : 'No'},${task.completedAt || ''},${esc(task.notes || '')}\n`;
            });
        }
    });

    csvContent += '\n=== EXERCISES ===\n';
    csvContent += 'Date,Exercise Name,Count,Completed\n';
    sortedLogs.forEach((log: any) => {
        if (log.exercises && log.exercises.length > 0) {
            log.exercises.forEach((ex: any) => {
                csvContent += `${log.date},${esc(ex.name)},${ex.count || ''},${ex.completed ? 'Yes' : 'No'}\n`;
            });
        }
    });

    csvContent += '\n=== FOOD LOG ===\n';
    csvContent += 'Date,Meal Type,Food Item,Time\n';
    sortedLogs.forEach((log: any) => {
        if (log.foodLog && log.foodLog.length > 0) {
            log.foodLog.forEach((food: any) => {
                csvContent += `${log.date},${food.mealType || ''},${esc(food.item)},${food.time || ''}\n`;
            });
        }
    });

    csvContent += '\n=== SHIFT HISTORY ===\n';
    csvContent += 'Date,Shift,Location\n';
    if (state.shiftHistory) {
        const shiftEntries = Array.isArray(state.shiftHistory)
            ? state.shiftHistory
            : Object.entries(state.shiftHistory).map(([date, shift]) => ({ date, ...shift as any }));
        shiftEntries.sort((a: any, b: any) => a.date.localeCompare(b.date)).forEach((shift: any) => {
            csvContent += `${shift.date},${shift.shift || ''},${shift.location || ''}\n`;
        });
    }

    csvContent += '\n=== WEIGHT HISTORY ===\n';
    csvContent += 'Date,Weight (kg)\n';
    if (state.weightHistory) {
        [...state.weightHistory]
            .sort((a: any, b: any) => a.date.localeCompare(b.date))
            .forEach((entry: any) => { csvContent += `${entry.date},${entry.weight}\n`; });
    }

    csvContent += '\n=== WEEKLY INTENTIONS ===\n';
    csvContent += 'Week (Monday),Intention,Achieved\n';
    if (state.weeklyIntentions) {
        Object.values(state.weeklyIntentions as any)
            .sort((a: any, b: any) => a.week.localeCompare(b.week))
            .forEach((wi: any) => {
                if (wi.intention?.trim()) {
                    const achieved = wi.achieved === true ? 'Yes' : wi.achieved === false ? 'No' : 'Not set';
                    csvContent += `${wi.week},${esc(wi.intention)},${achieved}\n`;
                }
            });
    }

    csvContent += '\n=== NOTES ===\n';
    csvContent += 'Title,Created,Updated,Body\n';
    if (state.notes) {
        (state.notes as any[])
            .sort((a: any, b: any) => a.createdAt.localeCompare(b.createdAt))
            .forEach((note: any) => {
                csvContent += `${esc(note.title)},${note.createdAt?.split('T')[0] || ''},${note.updatedAt?.split('T')[0] || ''},${esc(note.body)}\n`;
            });
    }

    csvContent += '\n=== RESOURCES ===\n';
    csvContent += 'Title,Category,URL,Description\n';
    if (state.resources) {
        (state.resources as any[]).forEach((resource: any) => {
            csvContent += `${esc(resource.title)},${resource.category || ''},${esc(resource.url)},${esc(resource.description)}\n`;
        });
    }

    const exportFileDefaultName = `strk-fit-data-${new Date().toISOString().split('T')[0]}.csv`;

    if (Capacitor.getPlatform() !== 'web') {
        // Native (Android/iOS) - Write to Cache & Share
        try {
            await Filesystem.writeFile({
                path: exportFileDefaultName,
                data: csvContent,
                directory: Directory.Cache,
                encoding: Encoding.UTF8
            });

            const uriResult = await Filesystem.getUri({
                directory: Directory.Cache,
                path: exportFileDefaultName
            });

            await Share.share({
                title: 'STRK-FIT Data Export',
                text: 'Here is my STRK-FIT data export.',
                files: [uriResult.uri], // Fix: Use files array for attachment
                dialogTitle: 'Share Data'
            });

        } catch (error) {
            console.error('Export failed:', error);
            alert(`Export failed: ${error}`);
        }
    } else {
        // Web - Download Link
        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}
