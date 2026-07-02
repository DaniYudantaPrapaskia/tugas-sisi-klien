import { useState, useEffect } from "react";
import Header from "../../components/organisms/Header";
import { dosenApi } from "../../api/dosenApi";
import { matkulApi } from "../../api/matkulApi";
import { mahasiswaApi } from "../../api/mahasiswaApi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#7c3aed"];

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalDosen: 0,
    totalMatkul: 0,
    totalMahasiswa: 0,
    mahasiswaAktif: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentDosen, setRecentDosen] = useState([]);
  const [recentMatkul, setRecentMatkul] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [matkul, setMatkul] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dosen, matkulData, mahasiswaData] = await Promise.all([
        dosenApi.getAll(),
        matkulApi.getAll(),
        mahasiswaApi.getAll(),
      ]);

      setStats({
        totalDosen: dosen.length,
        totalMatkul: matkulData.length,
        totalMahasiswa: mahasiswaData.length,
        mahasiswaAktif: mahasiswaData.filter((m) => m.status).length,
      });

      setRecentDosen(dosen.slice(-5).reverse());
      setRecentMatkul(matkulData.slice(-5).reverse());
      setMahasiswa(mahasiswaData);
      setMatkul(matkulData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const barData = [
    { name: "Dosen", total: stats.totalDosen },
    { name: "Matkul", total: stats.totalMatkul },
    { name: "Mahasiswa", total: stats.totalMahasiswa },
    { name: "Mhs Aktif", total: stats.mahasiswaAktif },
  ];

  const genderData = [
    { name: "Laki-laki", value: mahasiswa.filter((m) => m.gender === "Male").length },
    { name: "Perempuan", value: mahasiswa.filter((m) => m.gender === "Female").length },
  ];

  const sksByMatkul = matkul.map((mk) => ({
    name: mk.kode_mk,
    sks: mk.sks,
  }));

  if (loading) {
    return (
      <>
        <Header title="Dashboard Admin" />
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard Admin" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Dosen", value: stats.totalDosen, color: "text-green-600" },
          { label: "Total Mata Kuliah", value: stats.totalMatkul, color: "text-orange-600" },
          { label: "Total Mahasiswa", value: stats.totalMahasiswa, color: "text-blue-600" },
          { label: "Mahasiswa Aktif", value: stats.mahasiswaAktif, color: "text-cyan-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-slate-600 mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Ringkasan Data</h2>
          <ResponsiveContainer width="100%" height={220}>
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
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Gender Mahasiswa</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {genderData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">SKS per Mata Kuliah</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={sksByMatkul} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="sks" stroke="#16a34a" fill="#bbf7d0" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Dosen Terbaru</h2>
          <div className="space-y-2">
            {recentDosen.map((dosen) => (
              <div
                key={dosen.id}
                className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900">{dosen.nama}</p>
                  <p className="text-sm text-slate-600">{dosen.bidang_keahlian}</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs ${dosen.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {dosen.status ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Mata Kuliah Terbaru</h2>
          <div className="space-y-2">
            {recentMatkul.map((mk) => (
              <div
                key={mk.id}
                className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900">{mk.nama_mk}</p>
                  <p className="text-sm text-slate-600">{mk.kode_mk} • {mk.sks} SKS • Semester {mk.semester}</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs ${mk.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {mk.status ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
