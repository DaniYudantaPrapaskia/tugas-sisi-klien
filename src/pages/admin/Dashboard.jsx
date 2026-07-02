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

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const role = await getUserRole();
      setRoleName(role?.name || '');
    } catch (error) {
      console.error('Error fetching role:', error);
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
        <p className="text-center text-slate-600">
          Dashboard untuk role Anda belum tersedia.
        </p>
      </div>
    </>
  );
}
