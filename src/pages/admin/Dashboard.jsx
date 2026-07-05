import { useState, useEffect } from "react";
import { getUserRole } from "../../utils/permissions";
import DashboardSuperAdmin from "./DashboardSuperAdmin";
import DashboardAdmin from "./DashboardAdmin";
import DashboardDosen from "./DashboardDosen";
import DashboardMahasiswa from "./DashboardMahasiswa";
import Header from "../../components/organisms/Header";

export default function Dashboard() {
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleObject, setRoleObject] = useState(null);
  const [debugError, setDebugError] = useState('');

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const role = await getUserRole();
      setRoleObject(role);
      setRoleName(role?.name || '');
      if (!role) {
        setDebugError('Role API returned null or undefined');
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      setDebugError(error.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat dashboard...</p>
        </div>
      </>
    );
  }

  if (roleName === 'Super Admin') {
    return <DashboardSuperAdmin />;
  }

  if (roleName === 'Admin') {
    return <DashboardAdmin />;
  }

  if (roleName === 'Dosen') {
    return <DashboardDosen />;
  }

  if (roleName === 'Mahasiswa') {
    return <DashboardMahasiswa />;
  }

  return (
    <>
      <Header title="Dashboard" />
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-center text-slate-600 font-bold mb-4">
          Dashboard untuk role Anda belum tersedia.
        </p>
        <div className="mt-4 p-4 bg-slate-100 rounded text-xs font-mono text-slate-700 overflow-auto max-w-full">
          <p className="font-bold text-slate-900 border-b pb-1 mb-2">DEBUG INFO:</p>
          <p className="mb-1"><strong>localStorage.user:</strong> {localStorage.getItem('user') || 'Not found'}</p>
          <p className="mb-1"><strong>roleName state:</strong> "{roleName}"</p>
          <p className="mb-1"><strong>roleObject:</strong> {roleObject ? JSON.stringify(roleObject) : 'null'}</p>
          <p className="mb-1"><strong>Error/Status:</strong> {debugError || 'None'}</p>
          <p className="mb-1"><strong>API URL:</strong> {import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3000')}</p>
        </div>
      </div>
    </>
  );
}
