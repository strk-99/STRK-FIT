/**
 * Environment Configuration
 *
 * This file manages API URLs for different environments (development, production, mobile).
 * Update the PRODUCTION_API_URL when you deploy your backend server.
 */

// Determine if running in mobile app (Capacitor)
const isCapacitor = () => {
    return (window as any).Capacitor !== undefined;
};

// API URL Configuration
const DEVELOPMENT_API_URL = 'http://localhost:3001';
const PRODUCTION_API_URL = 'https://api.strkfit.com'; // Placeholder for future backend

/**
 * Get the appropriate API URL based on environment
 *
 * - Development (web): http://localhost:3001
 * - Production (web): Your deployed backend URL
 * - Mobile (Capacitor): Your deployed backend URL (localhost won't work on mobile)
 */
export const getApiUrl = (): string => {
    // If running in Capacitor (mobile app), always use production URL
    if (isCapacitor()) {
        console.log('[ENV] Running in Capacitor, using production API');
        return PRODUCTION_API_URL;
    }

    // Check if we're in production mode (Vite sets this)
    if (import.meta.env.PROD) {
        console.log('[ENV] Running in production mode');
        return PRODUCTION_API_URL;
    }

    // Development mode
    console.log('[ENV] Running in development mode');
    return DEVELOPMENT_API_URL;
};

/**
 * Get the base API endpoint for all requests
 * Usage: `${API_BASE_URL}/auth/login`
 */
export const API_BASE_URL = getApiUrl() + '/api';

/**
 * Check if backend is deployed
 */
export const isBackendDeployed = (): boolean => {
    return PRODUCTION_API_URL !== 'https://api.strkfit.com';
};

/**
 * Environment info (for debugging)
 */
export const ENV_INFO = {
    apiUrl: getApiUrl(),
    isProduction: import.meta.env.PROD,
    isMobile: isCapacitor(),
    isBackendDeployed: isBackendDeployed(),
};

// Log environment info in development
if (import.meta.env.DEV) {
    console.log('[ENV] Environment Configuration:', ENV_INFO);
}
