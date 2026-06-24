import { registerPlugin, Capacitor } from '@capacitor/core';

interface PedometerPlugin {
    isAvailable(): Promise<{ available: boolean }>;
    start(): Promise<void>;
    stop(): Promise<void>;
    getStepCount(): Promise<{ steps: number; rawSteps: number }>;
    addListener(event: 'stepUpdate', handler: (data: { steps: number; rawSteps: number }) => void): Promise<{ remove: () => void }>;
}

const Pedometer = registerPlugin<PedometerPlugin>('Pedometer');

export async function isPedometerAvailable(): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') return false;
    try {
        const { available } = await Pedometer.isAvailable();
        return available;
    } catch {
        return false;
    }
}

export async function requestActivityPermission(): Promise<boolean> {
    if (Capacitor.getPlatform() !== 'android') return true;
    try {
        // Capacitor 8 permission request via the plugin's built-in permission flow
        // The plugin declares ACTIVITY_RECOGNITION in @CapacitorPlugin so Capacitor handles it
        await Pedometer.start();
        await Pedometer.stop();
        return true;
    } catch {
        return false;
    }
}

export async function startPedometer(
    onStep: (steps: number) => void
): Promise<(() => void) | null> {
    if (Capacitor.getPlatform() === 'web') return null;
    try {
        await Pedometer.start();
        const listener = await Pedometer.addListener('stepUpdate', ({ steps }) => {
            onStep(steps);
        });
        return () => {
            listener.remove();
            Pedometer.stop().catch(() => {});
        };
    } catch {
        return null;
    }
}

export async function getStepCount(): Promise<number> {
    if (Capacitor.getPlatform() === 'web') return 0;
    try {
        const { steps } = await Pedometer.getStepCount();
        return steps;
    } catch {
        return 0;
    }
}
