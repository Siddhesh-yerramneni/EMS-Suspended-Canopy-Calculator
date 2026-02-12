// utils/api.js
const DEV = import.meta.env.DEV;
const API_ORIGIN = DEV ? '' : 'https://engexpstaging.wpengine.com';

export function apiUrl(path, params = {}) {
  // normalize to string, strip leading/trailing slashes, and lowercase the whole path
  const cleaned = String(path).replace(/^\/+|\/+$/g, '').toLowerCase();

  const base = DEV ? `/api/${cleaned}` : `${API_ORIGIN}/${cleaned}`;
  const url = new URL(base, window.location.origin);

  // keep query keys/values as-is (no lowercasing)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}
