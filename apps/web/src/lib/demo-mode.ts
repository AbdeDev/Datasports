// A production build can never bypass authentication.
export const isDemo = import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === "true";
