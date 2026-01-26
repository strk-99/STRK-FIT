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

    csvContent += '\n=== DAILY LOGS ===\n';
    csvContent += 'Date,Workout Done,Protein Est,Steps,Water (glasses),Sleep (hours)\n';

    if (state.logs) {
        // Handle both array (if refactored) and object (current) formats
        const logEntries = Array.isArray(state.logs)
            ? state.logs
            : Object.entries(state.logs).map(([date, log]) => ({ date, ...log as any }));

        logEntries.sort((a: any, b: any) => a.date.localeCompare(b.date)).forEach((log: any) => {
            csvContent += `${log.date},${log.workoutDone ? 'Yes' : 'No'},${log.proteinEst || 'med'},${log.steps || 0},${log.water || 0},${log.sleep || 0}\n`;
        });
    }

    csvContent += '\n=== EXERCISES ===\n';
    csvContent += 'Date,Exercise Name,Count,Completed\n';

    if (state.logs) {
        const logEntries = Array.isArray(state.logs)
            ? state.logs
            : Object.entries(state.logs).map(([date, log]) => ({ date, ...log as any }));

        logEntries.sort((a: any, b: any) => a.date.localeCompare(b.date)).forEach((log: any) => {
            if (log.exercises && log.exercises.length > 0) {
                log.exercises.forEach((ex: any) => {
                    csvContent += `${log.date},${ex.name || ''},${ex.count || ''},${ex.completed ? 'Yes' : 'No'}\n`;
                });
            }
        });
    }

    csvContent += '\n=== FOOD LOG ===\n';
    csvContent += 'Date,Meal Type,Food Item,Time\n';

    if (state.logs) {
        const logEntries = Array.isArray(state.logs)
            ? state.logs
            : Object.entries(state.logs).map(([date, log]) => ({ date, ...log as any }));

        logEntries.sort((a: any, b: any) => a.date.localeCompare(b.date)).forEach((log: any) => {
            if (log.foodLog && log.foodLog.length > 0) {
                log.foodLog.forEach((food: any) => {
                    csvContent += `${log.date},${food.mealType || ''},${food.item || ''},${food.time || ''}\n`;
                });
            }
        });
    }

    csvContent += '\n=== SHIFT HISTORY ===\n';
    csvContent += 'Date,Shift,Location\n';

    if (state.shiftHistory) {
        // Check if shiftHistory is array or object map (it seems to be object map in UserProfile but let's be safe)
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
        const weightEntries = [...state.weightHistory];
        weightEntries.sort((a: any, b: any) => a.date.localeCompare(b.date)).forEach((entry: any) => {
            csvContent += `${entry.date},${entry.weight}\n`;
        });
    }

    csvContent += '\n=== RESOURCES ===\n';
    csvContent += 'Title,Category,URL,Description\n';

    if (state.resources) {
        state.resources.forEach((resource: any) => {
            const desc = (resource.description || '').replace(/,/g, ';');
            csvContent += `${resource.title || ''},${resource.category || ''},${resource.url || ''},${desc}\n`;
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
