import { useState, useEffect } from "react";
import Header from "../../components/organisms/Header";
import { userApi } from "../../api/userApi";
import { roleApi } from "../../api/roleApi";
import { dosenApi } from "../../api/dosenApi";
import { matkulApi } from "../../api/matkulApi";
import { mahasiswaApi } from "../../api/mahasiswaApi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";

const COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#ea580c", "#0891b2"];

export default function DashboardSuperAdmin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalDosen: 0,
    totalMatkul: 0,
    totalMahasiswa: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [matkul, setMatkul] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [users, rolesData, dosen, matkulData, mahasiswaData] = await Promise.all([
        userApi.getAll(),
        roleApi.getAll(),
        dosenApi.getAll(),
        matkulApi.getAll(),
        mahasiswaApi.getAll(),
      ]);

      setStats({
        totalUsers: users.length,
        totalRoles: rolesData.length,
        totalDosen: dosen.length,
        totalMatkul: matkulData.length,
        totalMahasiswa: mahasiswaData.length,
      });

      setRecentUsers(users.slice(-5).reverse());
      setRoles(rolesData);
      setMahasiswa(mahasiswaData);
      setMatkul(matkulData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.name || "Unknown";
  };

  const barData = [
    { name: "Users", total: stats.totalUsers },
    { name: "Dosen", total: stats.totalDosen },
    { name: "Mahasiswa", total: stats.totalMahasiswa },
    { name: "Matkul", total: stats.totalMatkul },
    { name: "Roles", total: stats.totalRoles },
  ];

  const pieData = roles.map((role) => ({
    name: role.name,
    value: role.permissions?.length || 0,
  }));

  const semesterGroups = Array.from({ length: 8 }, (_, i) => {
    const sem = i + 1;
    return {
      semester: `Sem ${sem}`,
      mahasiswa: mahasiswa.filter((m) => m.semester === sem).length,
    };
  });

  if (loading) {
    return (
      <>
        <Header title="Dashboard Super Admin" />
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard Super Admin" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {[
          { label: "Total Users", value: stats.totalUsers, color: "text-blue-600" },
          { label: "Total Roles", value: stats.totalRoles, color: "text-purple-600" },
          { label: "Total Dosen", value: stats.totalDosen, color: "text-green-600" },
          { label: "Total Mata Kuliah", value: stats.totalMatkul, color: "text-orange-600" },
          { label: "Total Mahasiswa", value: stats.totalMahasiswa, color: "text-cyan-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-slate-600 mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Ringkasan Data Sistem</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Jumlah Permission per Role</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Mahasiswa per Semester</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={semesterGroups} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="mahasiswa" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Users</h2>
          <div className="space-y-2">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-900">{user.nama}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {getRoleName(user.role_id)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Belum ada user.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
