import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const role = useAuthStore((state) => state.role);

  if (role !== "ADMIN") {
    return <Navigate to="/timeline" replace />;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
