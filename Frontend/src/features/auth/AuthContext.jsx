import { createContext, useContext, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "./authApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "ride-split-user";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  function saveUser(nextUser) {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }

  async function login(credentials) {
    await loginUser(credentials);
    const currentUser = await getCurrentUser();
    saveUser(currentUser);
    return currentUser;
  }

  async function signUp(details) {
    await registerUser(details);
    return login({ email: details.email, password: details.password });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
