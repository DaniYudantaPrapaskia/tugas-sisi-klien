import Header from "../../components/organisms/Header";
import { data } from "../../data/data";

export default function Dashboard() {
  const totalMahasiswa = data.length;
  const totalAktif = data.filter((item) => item.status).length;
  const totalTidakAktif = totalMahasiswa - totalAktif;
  const rataRataIpk =
    totalMahasiswa > 0
      ? (
          data.reduce((sum, item) => sum + Number(item.ipk || 0), 0) /
          totalMahasiswa
        ).toFixed(2)
      : "0.00";

  const topMahasiswa = [...data].sort((a, b) => b.ipk - a.ipk)[0];

  const semesterStats = data.reduce((acc, item) => {
    const key = `Semester ${item.semester}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const semesterEntries = Object.entries(semesterStats).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return (
    <>
      <Header title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Mahasiswa</p>
          <p className="text-2xl font-bold">{totalMahasiswa}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Mahasiswa Aktif</p>
          <p className="text-2xl font-bold text-green-600">{totalAktif}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Mahasiswa Tidak Aktif</p>
          <p className="text-2xl font-bold text-red-600">{totalTidakAktif}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Rata-rata IPK</p>
          <p className="text-2xl font-bold text-blue-600">{rataRataIpk}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Top Performer</h2>
          {topMahasiswa ? (
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Nama:</span> {topMahasiswa.nama}
              </p>
              <p>
                <span className="font-medium">NIM:</span> {topMahasiswa.nim}
              </p>
              <p>
                <span className="font-medium">IPK:</span> {topMahasiswa.ipk}
              </p>
              <p>
                <span className="font-medium">Semester:</span>{" "}
                {topMahasiswa.semester}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Belum ada data.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Distribusi Semester</h2>
          <div className="space-y-2">
            {semesterEntries.length > 0 ? (
              semesterEntries.map(([semester, total]) => (
                <div
                  key={semester}
                  className="flex items-center justify-between text-sm border rounded px-3 py-2"
                >
                  <span>{semester}</span>
                  <span className="font-semibold">{total} orang</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Belum ada data.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
