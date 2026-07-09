import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { MOCK_USERS, type MockUser, type UserRole } from '../types/auth';

const STORAGE_KEY = 'routewander-mock-auth';

type AuthContextValue = {
  user: MockUser | null;
  role: UserRole;
  isLoggedIn: boolean;
  login: (role: Exclude<UserRole, 'guest'>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredRole(): UserRole {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'traveler' || raw === 'hotel' || raw === 'creator') return raw;
  } catch {
    /* ignore */
  }
  return 'guest';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => readStoredRole());

  const login = useCallback((nextRole: Exclude<UserRole, 'guest'>) => {
    setRole(nextRole);
    try {
      localStorage.setItem(STORAGE_KEY, nextRole);
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setRole('guest');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = role === 'guest' ? null : MOCK_USERS[role];
    return {
      user,
      role,
      isLoggedIn: role !== 'guest',
      login,
      logout,
    };
  }, [role, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
