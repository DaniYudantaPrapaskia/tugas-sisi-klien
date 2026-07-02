import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRole } from "../utils/permissions";

export default function RoleRoute({ requiredPermissions = [] }) {
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAccess();
  }, [location.pathname]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      
      if (requiredPermissions.length === 0) {
        setHasAccess(true);
        return;
      }

      const role = await getUserRole();
      if (!role || !role.permissions) {
        setHasAccess(false);
        return;
      }

      const userPermissions = role.permissions;
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );

      setHasAccess(hasPermission);
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (hasAccess === false) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
