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

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#7c3aed", "#0891b2", "#d946ef"];

export default function DashboardMahasiswa() {
  const [matkul, setMatkul] = useState([]);
  const [allMatkul, setAllMatkul] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mahasiswaInfo, setMahasiswaInfo] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = getUserFromStorage();
      setUser(currentUser);

      const [matkulData, mahasiswaData] = await Promise.all([
        matkulApi.getAll(),
        mahasiswaApi.getAll(),
      ]);

      const myMahasiswaData = mahasiswaData.find(
        (mhs) => mhs.email === currentUser?.email
      );
      setMahasiswaInfo(myMahasiswaData);

      setAllMatkul(matkulData);

      const filteredMatkul = myMahasiswaData
        ? matkulData.filter((mk) => mk.semester <= myMahasiswaData.semester)
        : [];

      setMatkul(filteredMatkul);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSKS = matkul.reduce((sum, mk) => sum + (mk.sks || 0), 0);
  const matkulAktif = matkul.filter((mk) => mk.status).length;

  const sksPerSemester = Array.from({ length: mahasiswaInfo?.semester || 0 }, (_, i) => {
    const sem = i + 1;
    const matkulInSem = matkul.filter((mk) => mk.semester === sem);
    return {
      semester: `Sem ${sem}`,
      sks: matkulInSem.reduce((s, mk) => s + (mk.sks || 0), 0),
    };
  });

  const statusData = [
    { name: "Aktif", value: matkulAktif },
    { name: "Nonaktif", value: matkul.length - matkulAktif },
  ];

  const allMatkulBySemester = Array.from({ length: 8 }, (_, i) => {
    const sem = i + 1;
    return {
      semester: `Sem ${sem}`,
      jumlah: allMatkul.filter((mk) => mk.semester === sem).length,
    };
  });

  if (loading) {
    return (
      <>
        <Header title="Dashboard Mahasiswa" />
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Dashboard Mahasiswa" />

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Selamat Datang, {user?.nama}!
        </h2>
        {mahasiswaInfo ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-sm text-slate-600">NIM</p>
              <p className="font-semibold text-slate-900">{mahasiswaInfo.nim}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Gender</p>
              <p className="font-semibold text-slate-900">{mahasiswaInfo.gender}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Semester</p>
              <p className="font-semibold text-slate-900">{mahasiswaInfo.semester}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">IPK</p>
              <p className="font-semibold text-blue-600 text-lg">{mahasiswaInfo.ipk}</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-600 mt-2">Data mahasiswa tidak ditemukan.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-slate-600 mb-2">Total Mata Kuliah Tersedia</p>
          <p className="text-3xl font-bold text-blue-600">{matkul.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-slate-600 mb-2">Total SKS</p>
          <p className="text-3xl font-bold text-orange-600">{totalSKS}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">SKS per Semester</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sksPerSemester} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
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
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Matkul per Semester (Global)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={allMatkulBySemester} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Mata Kuliah Tersedia</h2>
        {matkul.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kode MK</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SKS</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Semester</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dosen</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {matkul.map((mk) => (
                  <tr key={mk.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{mk.kode_mk}</td>
                    <td className="px-6 py-4 text-sm">{mk.nama_mk}</td>
                    <td className="px-6 py-4 text-sm">{mk.sks}</td>
                    <td className="px-6 py-4 text-sm">{mk.semester}</td>
                    <td className="px-6 py-4 text-sm">{mk.dosen_pengampu}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded text-xs ${mk.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {mk.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-500 py-8">
            Belum ada mata kuliah tersedia untuk semester Anda.
          </p>
        )}
      </div>
    </>
  );
}
