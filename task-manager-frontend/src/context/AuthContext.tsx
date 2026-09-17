import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loginRequest, registerRequest } from '../api/auth';
import { AUTH_LOGOUT_EVENT } from '../api/client';
import { clearSession, getStoredUser, getToken, setSession } from '../utils/storage';
import type { LoginInput, RegisterInput, User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    setUser(getStoredUser());
    setToken(getToken());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    function handleForcedLogout() {
      setUser(null);
      setToken(null);
      showToast('Votre session a expiré, veuillez vous reconnecter.', 'error');
    }
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
  }, [showToast]);

  async function login(data: LoginInput) {
    // Laisse l'erreur remonter telle quelle (axios) pour que l'appelant
    // puisse extraire message + éventuelles erreurs de champ.
    const response = await loginRequest(data);
    const loggedUser: User = { userId: response.userId, fullName: response.fullName, email: response.email };
    setSession(response.token, loggedUser);
    setToken(response.token);
    setUser(loggedUser);
    showToast(`Content de te revoir, ${loggedUser.fullName.split(' ')[0]} !`, 'success');
  }

  async function register(data: RegisterInput) {
    const response = await registerRequest(data);
    const newUser: User = { userId: response.userId, fullName: response.fullName, email: response.email };
    setSession(response.token, newUser);
    setToken(response.token);
    setUser(newUser);
    showToast('Compte créé avec succès !', 'success');
  }

  function logout() {
    clearSession();
    setUser(null);
    setToken(null);
    showToast('Déconnecté.', 'info');
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: Boolean(token), isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  return ctx;
}
