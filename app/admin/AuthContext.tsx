"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => { success: boolean; error?: string; retryAfter?: number };
  logout: () => void;
  isLoading: boolean;
  changeCredentials: (email: string, password: string, name: string) => void;
  sessionTimeLeft: number;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  adminEmail: null,
  login: () => ({ success: false }),
  logout: () => {},
  isLoading: true,
  changeCredentials: () => {},
  sessionTimeLeft: 0,
});

const DEFAULT_ADMIN = {
  email: "admin@smilecare.com",
  password: "smilecare2024",
  name: "Dr. Ahmed Khan",
};

const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE = 5 * 60 * 1000; // 5 min warning before expiry

function getAdminCredentials() {
  if (typeof window === "undefined") return DEFAULT_ADMIN;
  const stored = localStorage.getItem("smilecare_admin_credentials");
  if (stored) {
    try { return JSON.parse(stored); } catch { return DEFAULT_ADMIN; }
  }
  return DEFAULT_ADMIN;
}

function saveAdminCredentials(email: string, password: string, name: string) {
  localStorage.setItem("smilecare_admin_credentials", JSON.stringify({ email, password, name }));
}

function getLoginAttempts() {
  const data = localStorage.getItem("smilecare_login_attempts");
  if (!data) return { count: 0, lockedUntil: 0 };
  try { return JSON.parse(data); } catch { return { count: 0, lockedUntil: 0 }; }
}

function recordFailedAttempt() {
  const data = getLoginAttempts();
  const newCount = data.count + 1;
  const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_DURATION : 0;
  localStorage.setItem("smilecare_login_attempts", JSON.stringify({ count: newCount, lockedUntil }));
  return { count: newCount, lockedUntil };
}

function resetAttempts() {
  localStorage.setItem("smilecare_login_attempts", JSON.stringify({ count: 0, lockedUntil: 0 }));
}

function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const sessionStartRef = useRef<number>(0);
  const csrfTokenRef = useRef<string>("");

  // Validate token on mount
  useEffect(() => {
    const token = document.cookie.split("; ").find((r) => r.startsWith("admin_token="));
    if (token) {
      const tokenValue = token.split("=")[1];
      const parts = tokenValue.split(":");
      const timestamp = parseInt(parts[1] || "0", 10);
      const elapsed = Date.now() - timestamp;
      if (elapsed < SESSION_DURATION) {
        setIsAuthenticated(true);
        const stored = getAdminCredentials();
        setAdminEmail(stored.email);
        sessionStartRef.current = timestamp;
        csrfTokenRef.current = generateCSRFToken();
      } else {
        document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    }
    setIsLoading(false);
  }, []);

  // Session timer — auto-logout and warning
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStartRef.current;
      const remaining = Math.max(0, SESSION_DURATION - elapsed);
      setSessionTimeLeft(Math.floor(remaining / 1000));
      if (remaining <= 0) {
        logout();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Warn before session expires
  useEffect(() => {
    if (sessionTimeLeft > 0 && sessionTimeLeft <= WARNING_BEFORE / 1000 && sessionTimeLeft % 60 === 0) {
      const mins = Math.ceil(sessionTimeLeft / 60);
      alert(`Your session expires in ${mins} minute(s). Please save your work.`);
    }
  }, [sessionTimeLeft]);

  const login = useCallback((email: string, password: string) => {
    // Rate limiting check
    const attempts = getLoginAttempts();
    if (attempts.lockedUntil > Date.now()) {
      const retryAfter = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      return { success: false, error: `Account locked. Try again in ${retryAfter} minutes.`, retryAfter };
    }

    // Input validation
    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email format." };
    }

    // Credential check
    const creds = getAdminCredentials();
    if (email.toLowerCase() === creds.email.toLowerCase() && password === creds.password) {
      resetAttempts();
      const now = Date.now();
      const token = btoa(`${email}:${now}:${generateCSRFToken().slice(0, 16)}`);
      const expiry = new Date(now + SESSION_DURATION);
      document.cookie = `admin_token=${token}; expires=${expiry.toUTCString()}; path=/; SameSite=Strict; Secure`;
      sessionStartRef.current = now;
      csrfTokenRef.current = generateCSRFToken();
      setIsAuthenticated(true);
      setAdminEmail(email);
      return { success: true };
    }

    // Record failed attempt
    const result = recordFailedAttempt();
    const remaining = MAX_ATTEMPTS - result.count;
    if (remaining > 0) {
      return { success: false, error: `Invalid credentials. ${remaining} attempt(s) remaining before lockout.` };
    }
    return { success: false, error: "Too many failed attempts. Account locked for 15 minutes." };
  }, []);

  const logout = useCallback(() => {
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure";
    setIsAuthenticated(false);
    setAdminEmail(null);
    sessionStartRef.current = 0;
    csrfTokenRef.current = "";
  }, []);

  const changeCredentials = useCallback((newEmail: string, newPassword: string, newName: string) => {
    saveAdminCredentials(newEmail, newPassword, newName);
    setAdminEmail(newEmail);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminEmail, login, logout, isLoading, changeCredentials, sessionTimeLeft }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
