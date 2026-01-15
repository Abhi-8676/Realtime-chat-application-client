const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Ensure API_URL always ends with /api
const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

export const APP_CONFIG = {
    API_URL: apiUrl,
    REQUEST_TIMEOUT: 20000,
};