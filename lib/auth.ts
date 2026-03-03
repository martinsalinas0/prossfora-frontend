// Client-side token and user storage for API auth. Centralized so we can swap to httpOnly cookies later if needed.

const ACCESS_TOKEN_KEY = "prossfora_access_token";
const REFRESH_TOKEN_KEY = "prossfora_refresh_token";
const USER_KEY = "prossfora_user";
const CONTRACTOR_ID_KEY = "prossfora_contractor_id";

export type StoredUser = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function setUser(user: StoredUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getContractorId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONTRACTOR_ID_KEY);
}

export function setContractorId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONTRACTOR_ID_KEY, id);
}

export function clearContractorId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONTRACTOR_ID_KEY);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function clearRefreshToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function clearAuth(): void {
  clearAccessToken();
  clearRefreshToken();
  clearUser();
  clearContractorId();
}
