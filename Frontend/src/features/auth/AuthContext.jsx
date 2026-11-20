import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "./authApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "ride-split-user";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function isUnauthenticated(error) {
  return error?.status === 401 || error?.status === 403;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [hasSession, setHasSession] = useState(Boolean(user));
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProfileReady, setIsProfileReady] = useState(Boolean(user));
  const [profileError, setProfileError] = useState("");
  const authOperationRef = useRef(0);

  function saveUser(nextUser) {
    setUser(nextUser);
    setHasSession(true);
    setIsProfileReady(true);
    setProfileError("");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }

  function clearSession() {
    setUser(null);
    setHasSession(false);
    setIsProfileReady(false);
    setProfileError("");
    localStorage.removeItem(STORAGE_KEY);
  }

  async function loadProfile(operation) {
    try {
      const currentUser = await getCurrentUser();
      if (operation !== authOperationRef.current) return null;
      saveUser(currentUser);
      return currentUser;
    } catch (error) {
      if (operation !== authOperationRef.current) return null;
      if (isUnauthenticated(error)) {
        clearSession();
        throw error;
      }
      // A transport failure does not prove the session expired. Preserve the
      // cached profile but keep profile-dependent content behind a retry state.
      setIsProfileReady(false);
      setProfileError(error.message);
      return null;
    } finally {
      if (operation === authOperationRef.current) setIsInitializing(false);
    }
  }

  useEffect(() => {
    const operation = authOperationRef.current;
    loadProfile(operation).catch(() => {});
    return () => {
      // Invalidate an in-flight check before a replacement provider can save
      // a newer session to storage.
      authOperationRef.current += 1;
    };
    // The session check deliberately starts once; authOperationRef prevents its
    // result from committing after a newer login or logout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(credentials) {
    const operation = ++authOperationRef.current;
    setIsInitializing(true);
    setIsProfileReady(false);
    setProfileError("");
    await loginUser(credentials);
    if (operation !== authOperationRef.current) return null;
    setHasSession(true);
    return loadProfile(operation);
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
    ++authOperationRef.current;
    await logoutUser();
    clearSession();
    setIsInitializing(false);
  }

  async function retryProfile() {
    const operation = ++authOperationRef.current;
    setIsInitializing(true);
    setProfileError("");
    return loadProfile(operation);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: hasSession, isInitializing, isProfileReady, profileError, login, signUp, logout, retryProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
