export const clean = (value, max = 5000) =>
  String(value || "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, max);

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());

// Simple client-side throttle to discourage repeated submissions.
export const throttled = (key, seconds = 30) => {
  const last = Number(localStorage.getItem(key) || 0);
  if (Date.now() - last < seconds * 1000) return true;
  localStorage.setItem(key, String(Date.now()));
  return false;
};