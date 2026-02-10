// Simple runtime config helpers
// Toggle API call logging via environment variable.
// For server-side usage set API_LOGGING=true in environment (e.g. .env).
export const API_LOGGING = (() => {
  try {
    const val = process.env.API_LOGGING ?? process.env.NEXT_PUBLIC_API_LOGGING ?? "false";
    return String(val).toLowerCase() === "true";
  } catch (e) {
    return false;
  }
})();

export const WEAVER_ENABLED = (() => {
  try {
    const val = process.env.NEXT_PUBLIC_ENABLE_WEAVER ?? "false";
    return String(val).toLowerCase() === "true";
  } catch (e) {
    return false;
  }
})();

export default {
  API_LOGGING,
  WEAVER_ENABLED,
};
