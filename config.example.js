/*
  Copy this file to config.js and replace only the placeholder values.
  The production config.js contains only browser-safe values. A Supabase publishable key is
  suitable for browser use when Row Level Security is enabled; never place a
  service_role key, database password, SMTP password, or private token here.
*/
window.DASHBOARD_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  storageBucket: "event-files",
  signedUrlExpiresIn: 300,
  enableRealtime: true
};
