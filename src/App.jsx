import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Mahasiswa from "./pages/admin/Mahasiswa";
import DetailMahasiswa from "./pages/admin/DetailMahasiswa";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Protected Admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mahasiswa" element={<Mahasiswa />} />
          <Route path="mahasiswa/:id" element={<DetailMahasiswa />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
