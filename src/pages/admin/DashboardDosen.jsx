import { useState, useEffect } from "react";
import Header from "../../components/organisms/Header";
import { matkulApi } from "../../api/matkulApi";
import { mahasiswaApi } from "../../api/mahasiswaApi";
import { getUserFromStorage } from "../../utils/permissions";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#ea580c"];

export default function DashboardDosen() {
  const [myMatkul, setMyMatkul] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchMyMatkul();
  }, []);

  const fetchMyMatkul = async () => {
    try {
      setLoading(true);
      const currentUser = getUserFromStorage();
      setUser(currentUser);

      const [allMatkul, allMahasiswa] = await Promise.all([
        matkulApi.getAll(),
        mahasiswaApi.getAll(),
      ]);

      const myMatkulList = allMatkul.filter(
        (matkul) => matkul.dosen_pengampu === currentUser?.nama
      );

      setMyMatkul(myMatkulList);
      setMahasiswa(allMahasiswa);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSKS = myMatkul.reduce((sum, mk) => sum + (mk.sks || 0), 0);
  const matkulAktif = myMatkul.filter((mk) => mk.status).length;

  const sksData = myMatkul.map((mk) => ({
    name: mk.kode_mk,
    sks: mk.sks,
  }));

  const statusData = [
    { name: "Aktif", value: matkulAktif },
    { name: "Nonaktif", value: myMatkul.length - matkulAktif },
  ];

  const mahasiswaPerSemester = Array.from({ length: 8 }, (_, i) => {
    const sem = i + 1;
    return {
      semester: `Sem ${sem}`,
      jumlah: mahasiswa.filter((m) => m.semester === sem).length,
    };
  });

  if (loading) {
    return (
      <>
        <Header title="Dashboard Dosen" />
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard Dosen" />

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Selamat Datang, {user?.nama}!
        </h2>
        <p className="text-slate-600">Berikut adalah mata kuliah yang Anda ampu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-slate-600 mb-2">Total Mata Kuliah</p>
          <p className="text-3xl font-bold text-blue-600">{myMatkul.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-slate-600 mb-2">Mata Kuliah Aktif</p>
          <p className="text-3xl font-bold text-green-600">{matkulAktif}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-slate-600 mb-2">Total SKS</p>
          <p className="text-3xl font-bold text-orange-600">{totalSKS}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">SKS per Matkul</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sksData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="sks" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Status Matkul</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {statusData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Mahasiswa per Semester</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mahasiswaPerSemester} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="jumlah" stroke="#16a34a" fill="#bbf7d0" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Mata Kuliah Saya</h2>
        {myMatkul.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kode MK</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKS</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Semester</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {myMatkul.map((matkul) => (
                  <tr key={matkul.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{matkul.kode_mk}</td>
                    <td className="px-6 py-4 text-sm">{matkul.nama_mk}</td>
                    <td className="px-6 py-4 text-sm">{matkul.sks}</td>
                    <td className="px-6 py-4 text-sm">{matkul.semester}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded text-xs ${matkul.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {matkul.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-500 py-8">Anda belum mengampu mata kuliah apapun.</p>
        )}
      </div>
    </>
  );
}
