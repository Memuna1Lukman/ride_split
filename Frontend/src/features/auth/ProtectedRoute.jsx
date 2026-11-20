import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing, isProfileReady, profileError, retryProfile } = useAuth();
  const location = useLocation();
  if (isInitializing) return <p className="p-6 text-sm text-neutral-600">Checking your session…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isProfileReady) return (
    <div className="p-6 text-sm text-neutral-600">
      <p>{profileError || "Loading your profile…"}</p>
      {profileError && <button type="button" onClick={retryProfile} className="mt-3 rounded bg-lime-400 px-3 py-2 font-semibold text-neutral-900">Try again</button>}
    </div>
  );
  return children;
}
