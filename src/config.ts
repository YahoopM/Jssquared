// Where "Login / Explore EduPaper" buttons go. Same project: '/app/dashboard'.
// Separate deployment: set VITE_APP_URL=https://your-host/app/dashboard in .env
export const APP_URL:string=(import.meta as any).env?.VITE_APP_URL||'/app/dashboard';
// Replace with real contact details (set VITE_CONTACT_EMAIL in .env)
export const CONTACT_EMAIL:string=(import.meta as any).env?.VITE_CONTACT_EMAIL||'contact@your-domain.example';
