import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import Mahasiswa from "./pages/admin/Mahasiswa";
import DetailMahasiswa from "./pages/admin/DetailMahasiswa";
import Dosen from "./pages/admin/Dosen";
import DetailDosen from "./pages/admin/DetailDosen";
import Kelas from "./pages/admin/Kelas";
import Matkul from "./pages/admin/Matkul";
import DetailMatkul from "./pages/admin/DetailMatkul";
import User from "./pages/admin/User";
import DetailUser from "./pages/admin/DetailUser";
import Role from "./pages/admin/Role";
import DetailRole from "./pages/admin/DetailRole";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import { PERMISSION_MAP } from "./utils/permissions";
function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Mahasiswa - requires mahasiswa.manage or mahasiswa.read */}
          <Route element={<RoleRoute requiredPermissions={[PERMISSION_MAP.MAHASISWA_MANAGE, PERMISSION_MAP.MAHASISWA_READ]} />}>
            <Route path="mahasiswa" element={<Mahasiswa />} />
            <Route path="mahasiswa/:id" element={<DetailMahasiswa />} />
          </Route>
          
          {/* Dosen - requires dosen.manage */}
          <Route element={<RoleRoute requiredPermissions={[PERMISSION_MAP.DOSEN_MANAGE]} />}>
            <Route path="dosen" element={<Dosen />} />
            <Route path="dosen/:id" element={<DetailDosen />} />
            <Route path="kelas" element={<Kelas />} />
          </Route>
          
          {/* Matkul - requires matkul.manage or matkul.read */}
          <Route element={<RoleRoute requiredPermissions={[PERMISSION_MAP.MATKUL_MANAGE, PERMISSION_MAP.MATKUL_READ]} />}>
            <Route path="matkul" element={<Matkul />} />
            <Route path="matkul/:id" element={<DetailMatkul />} />
          </Route>
          
          {/* User Management - requires user.read */}
          <Route element={<RoleRoute requiredPermissions={[PERMISSION_MAP.USER_READ]} />}>
            <Route path="user" element={<User />} />
            <Route path="user/:id" element={<DetailUser />} />
          </Route>
          
          {/* Role Management - requires role.read */}
          <Route element={<RoleRoute requiredPermissions={[PERMISSION_MAP.ROLE_READ]} />}>
            <Route path="role" element={<Role />} />
            <Route path="role/:id" element={<DetailRole />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
