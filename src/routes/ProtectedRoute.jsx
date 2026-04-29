import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isLogin = localStorage.getItem("isLogin") === "true";

  return isLogin ? <Outlet /> : <Navigate to="/" />;
}
