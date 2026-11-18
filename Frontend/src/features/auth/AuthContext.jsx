import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "./authApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "ride-split-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  function saveUser(nextUser) {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }

  useEffect(() => {
    let isCurrent = true;

    async function validateSession() {
      try {
        const currentUser = await getCurrentUser();
        if (isCurrent) saveUser(currentUser);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        if (isCurrent) setUser(null);
      } finally {
        if (isCurrent) setIsInitializing(false);
      }
    }

    validateSession();
    return () => {
      isCurrent = false;
    };
  }, []);

  async function login(credentials) {
    await loginUser(credentials);
    const currentUser = await getCurrentUser();
    saveUser(currentUser);
    return currentUser;
  }

  async function signUp(details) {
    const account = await registerUser(details);
    try {
      const currentUser = await login({ email: details.email, password: details.password });
      return { account, currentUser, loginError: null };
    } catch (loginError) {
      return { account, currentUser: null, loginError };
    }
  }

  async function logout() {
    await logoutUser();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isInitializing, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
