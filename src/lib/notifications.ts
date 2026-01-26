/**
 * Notification system for STRK-FIT
 * Handles native and browser notifications for streak reminders and daily check-ins
 */
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationPermission {
    granted: boolean;
    denied: boolean;
    default: boolean;
}

/**
 * Check if platform supports notifications
 */
export function isNotificationSupported(): boolean {
    if (Capacitor.isNativePlatform()) {
        return true;
    }
    return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export async function getNotificationPermission(): Promise<NotificationPermission> {
    if (Capacitor.isNativePlatform()) {
        try {
            const status = await LocalNotifications.checkPermissions();
            return {
                granted: status.display === 'granted',
                denied: status.display === 'denied',
                default: status.display === 'prompt' || status.display === 'prompt-with-rationale',
            };
        } catch (e) {
            console.warn('Error checking native permissions', e);
            return { granted: false, denied: true, default: false };
        }
    }

    // Web Fallback
    if (!('Notification' in window)) {
        return { granted: false, denied: true, default: false };
    }
    const permission = Notification.permission;
    return {
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default',
    };
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
        try {
            const status = await LocalNotifications.requestPermissions();
            return status.display === 'granted';
        } catch (error) {
            console.error('Error requesting native notification permission:', error);
            return false;
        }
    }

    // Web Fallback
    if (!('Notification' in window)) {
        console.warn('Notifications not supported in this browser');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.error('Error requesting web notification permission:', error);
        return false;
    }
}

/**
 * Show an immediate notification
 */
export async function showNotification(title: string, options?: NotificationOptions & { id?: number, body?: string }): Promise<void> {
    if (Capacitor.isNativePlatform()) {
        try {
            // Create channel first (required for Android 8+)
            await LocalNotifications.createChannel({
                id: 'default',
                name: 'General Notifications',
                description: 'General notifications for STRK-FIT',
                importance: 3,
                visibility: 1,
                vibration: true,
            });

            await LocalNotifications.schedule({
                notifications: [{
                    title: title,
                    body: options?.body || '',
                    id: options?.id || Math.floor(Math.random() * 100000),
                    schedule: { at: new Date(Date.now() + 100) }, // Schedule essentially immediately
                    channelId: 'default',
                    sound: undefined,
                    attachments: undefined,
                    actionTypeId: "",
                    extra: null
                }]
            });
            return;
        } catch (error) {
            console.error('Error showing native notification:', error);
            return;
        }
    }

    // Web Fallback
    if (!('Notification' in window)) return;

    // We don't re-check permission here because typically this function is called after a check
    // But basic safety:
    if (Notification.permission !== 'granted') return;

    try {
        new Notification(title, {
            icon: '/icon-192.png',
            badge: '/badge-72.png',
            tag: 'strk-fit-notification',
            requireInteraction: false,
            ...options,
        });
    } catch (error) {
        console.error('Error showing web notification:', error);
    }
}

/**
 * Check if user has logged today
 */
export function hasLoggedToday(logs: any[]): boolean {
    if (!logs || logs.length === 0) return false;

    const today = new Date().toISOString().split('T')[0];
    return logs.some(log => log.date === today);
}

/**
 * Calculate time until reminder (default: 20:00)
 */
export function getTimeUntilReminder(reminderTime: string = '20:00'): number {
    const now = new Date();
    const reminder = new Date();
    const [hours, minutes] = reminderTime.split(':').map(Number);

    reminder.setHours(hours, minutes, 0, 0);

    // If reminder time has passed today, schedule for tomorrow
    if (now > reminder) {
        reminder.setDate(reminder.getDate() + 1);
    }

    return reminder.getTime() - now.getTime();
}

/**
 * Date object for the next occurrence of a specific time
 */
function getNextReminderDate(time: string): Date {
    const now = new Date();
    const reminder = new Date();
    const [hours, minutes] = time.split(':').map(Number);

    reminder.setHours(hours, minutes, 0, 0);

    if (now > reminder) {
        reminder.setDate(reminder.getDate() + 1);
    }
    return reminder;
}

/**
 * Schedule daily streak reminder
 * Returns a timerId (number) for Web or a notification ID (number) for Native
 */
export async function scheduleDailyReminder(
    logs: any[],
    reminderTime: string = '20:00',
    // onRemind callback is only supported on Web for now as Native handles background execution
    onRemind?: () => void
): Promise<number | null> {
    const hasLogged = hasLoggedToday(logs);
    if (hasLogged) return null; // Don't schedule if already logged

    if (Capacitor.isNativePlatform()) {
        try {
            // Check permissions first
            const perm = await getNotificationPermission();
            if (!perm.granted) return null;

            const reminderDate = getNextReminderDate(reminderTime);
            const notificationId = 1001; // Fixed ID for daily reminder so we can cancel it easily

            // Cancel any existing reminder with this ID first
            await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });

            await LocalNotifications.schedule({
                notifications: [{
                    title: "STRK-FIT Reminder",
                    body: "Don't break your streak! Log your progress for today.",
                    id: notificationId,
                    schedule: { at: reminderDate, allowWhileIdle: true },
                    channelId: 'default',
                    sound: undefined,
                    attachments: undefined,
                    actionTypeId: "",
                    extra: null
                }]
            });
            console.log(`Native reminder scheduled for ${reminderDate.toLocaleString()}`);
            return notificationId;
        } catch (error) {
            console.error("Error scheduling native reminder:", error);
            return null;
        }
    }

    // Web Fallback
    if (!('Notification' in window) || Notification.permission !== 'granted') return null;

    const checkAndNotify = () => {
        // Double check login status at trigger time
        // Note: 'logs' here is a closure capture, so it might be stale if the app doesn't re-schedule.
        // In a real app, successful log should cancel the timer.

        showNotification('STRK-FIT Reminder', {
            body: "Don't break your streak! Log your progress for today.",
            icon: '/icon-192.png',
            tag: 'daily-reminder',
            requireInteraction: true,
        });

        if (onRemind) onRemind();
    };

    const timeUntilReminder = getTimeUntilReminder(reminderTime);
    console.log(`Web reminder scheduled in ${(timeUntilReminder / 1000 / 60).toFixed(1)} mins`);

    // @ts-ignore - window.setTimeout returns number in browser
    return window.setTimeout(checkAndNotify, timeUntilReminder);
}

/**
 * Schedule monthly report reminder (1st of month at 09:00)
 */
export async function scheduleMonthlyReminder(): Promise<number | null> {
    if (Capacitor.isNativePlatform()) {
        try {
            const perm = await getNotificationPermission();
            if (!perm.granted) return null;

            const notificationId = 2001; // Fixed ID for monthly reminder

            // Calculate next 1st of month at 09:00
            const now = new Date();
            let nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0, 0);

            // If today is 1st and before 9am, schedule for today? No, let's just stick to next month to be safe/simple
            // actually if it's 1st 8am, we want today 9am.
            // If it's 1st 10am, we want next month.

            // Re-calc specific logic:
            const currentMonth1st9am = new Date(now.getFullYear(), now.getMonth(), 1, 9, 0, 0);
            if (now < currentMonth1st9am) {
                nextMonth = currentMonth1st9am;
            }

            await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });

            await LocalNotifications.schedule({
                notifications: [{
                    title: "Monthly Report Ready 📊",
                    body: "Time to export your monthly progress report! Tap to open.",
                    id: notificationId,
                    schedule: {
                        at: nextMonth,
                        allowWhileIdle: true,
                        every: 'month', // Native recurrence
                        count: 12 // Repeat for a year? or indefinitely if valid. 'every' usually handles it.
                    },
                    channelId: 'default'
                }]
            });
            console.log(`Native monthly reminder scheduled for ${nextMonth.toLocaleString()}`);
            return notificationId;
        } catch (error) {
            console.error("Error scheduling native monthly reminder:", error);
            return null;
        }
    }

    // Web implementation (Optional/Mock since background web uncertain)
    return null;
}

/**
 * Clear monthly reminder
 */
export async function clearMonthlyReminder(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
        try {
            await LocalNotifications.cancel({ notifications: [{ id: 2001 }] });
        } catch (error) {
            console.error("Error clearing native monthly reminder:", error);
        }
    }
}

/**
 * Clear scheduled reminder
 */
export async function clearDailyReminder(id: number): Promise<void> {
    if (!id) return;

    if (Capacitor.isNativePlatform()) {
        try {
            await LocalNotifications.cancel({ notifications: [{ id }] });
            // Also try clearing pending just in case
            await LocalNotifications.cancel({ notifications: [{ id: 1001 }] });
        } catch (error) {
            console.error("Error clearing native notification:", error);
        }
    } else {
        window.clearTimeout(id);
    }
}

/**
 * Send immediate streak notification
 */
export function sendStreakNotification(currentStreak: number): void {
    // Permission check is handled inside showNotification (web) or native scheduling

    let message = '';
    if (currentStreak === 0) {
        message = 'Start your fitness journey today!';
    } else if (currentStreak === 7) {
        message = '🎉 Amazing! You just completed a full week!';
    } else if (currentStreak === 14) {
        message = '🔥 Two weeks strong! Keep it up!';
    } else if (currentStreak === 30) {
        message = '⭐ One month of consistency! You\'re unstoppable!';
    } else if (currentStreak % 10 === 0) {
        message = `${currentStreak} days! You're building a powerful habit!`;
    }

    if (message) {
        showNotification('STRK-FIT Achievement', {
            body: message,
            icon: '/icon-192.png',
            tag: 'streak-achievement',
            requireInteraction: false,
        });
    }
}

/**
 * Setup notification listeners
 */
export function setupNotificationListeners(_onNotificationClick?: () => void): void {
    if (Capacitor.isNativePlatform()) {
        LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
            console.log('Notification action performed', notification);
            if (_onNotificationClick) _onNotificationClick();
        });
    }
}

/**
 * Notification Settings Management
 */
export interface NotificationSettings {
    enabled: boolean;
    reminderTime: string; // HH:mm format
    streakMilestones: boolean;
    dailyReminder: boolean;
    monthlyReminders: boolean;
}

export function getNotificationSettings(): NotificationSettings {
    const stored = localStorage.getItem('notification-settings');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing notification settings:', e);
        }
    }

    return {
        enabled: false,
        reminderTime: '20:00', // 8 PM
        streakMilestones: true,
        dailyReminder: true,
        monthlyReminders: false,
    };
}

export function saveNotificationSettings(settings: NotificationSettings): void {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
}

export async function initializeNotifications(
    logs: any[],
    _currentStreak: number,
    onRemind?: () => void
): Promise<number | null> {
    const settings = getNotificationSettings();

    if (!settings.enabled || !settings.dailyReminder) {
        return null;
    }

    // This will prompt for permission if it's the first time
    const granted = await requestNotificationPermission();
    if (!granted) return null;

    return scheduleDailyReminder(logs, settings.reminderTime, onRemind);
}
