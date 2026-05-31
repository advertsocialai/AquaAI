import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/components/dashboard/RoleSelector';
import { DASHBOARD_ROUTE } from '@/pages/dashboards/configs';

/**
 * Gates a route behind authentication. If a `role` is given, the signed-in
 * user must also hold that role — otherwise they're bounced to their own
 * dashboard rather than peeking at someone else's.
 */
export function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const { session, role: userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-foreground/40 text-sm">
          <div className="w-4 h-4 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  if (!session) {
    // Remember where they were headed so login can send them back.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && userRole && userRole !== role) {
    return <Navigate to={DASHBOARD_ROUTE[userRole]} replace />;
  }

  return <>{children}</>;
}
