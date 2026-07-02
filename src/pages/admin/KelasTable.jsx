import { useState } from "react";
import Pagination from "../../components/molecules/Pagination";

const PAGE_SIZE = 5;

export default function KelasTable({
  kelas,
  openEditModal,
  onDelete,
  matkulList,
  dosenList,
  mahasiswaList,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSKS, setExpandedSKS] = useState(null);

  const totalPages = Math.ceil(kelas.length / PAGE_SIZE);
  const paginated = kelas.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getMatkulName = (id) => {
    const mk = matkulList.find((m) => m.id == id);
    return mk ? `${mk.kode_mk} - ${mk.nama_mk}` : "-";
  };

  const getMatkulSKS = (id) => {
    const mk = matkulList.find((m) => m.id == id);
    return mk?.sks || 0;
  };

  const getDosenName = (id) => {
    const d = dosenList.find((d) => d.id == id);
    return d?.nama || "-";
  };

  const getMhsName = (id) => {
    const m = mahasiswaList.find((m) => m.id == id);
    return m ? `${m.nim} - ${m.nama}` : "-";
  };

  const getMhsSKS = (mhsId) => {
    return kelas.reduce((sum, k) => {
      if (k.mahasiswa_ids?.includes(mhsId)) {
        return sum + getMatkulSKS(k.matkul_id);
      }
      return sum;
    }, 0);
  };

  const getMhsMaxSKS = (mhsId) => {
    const m = mahasiswaList.find((m) => m.id == mhsId);
    return m?.max_sks || 0;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">No</th>
              <th className="border border-gray-300 px-4 py-2">Kode Kelas</th>
              <th className="border border-gray-300 px-4 py-2">Mata Kuliah</th>
              <th className="border border-gray-300 px-4 py-2">Dosen</th>
              <th className="border border-gray-300 px-4 py-2">SKS</th>
              <th className="border border-gray-300 px-4 py-2">Mhs</th>
              <th className="border border-gray-300 px-4 py-2">Kapasitas</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Tidak ada data kelas
                </td>
              </tr>
            ) : (
              paginated.map((item, index) => {
                const mhsCount = item.mahasiswa_ids?.length || 0;
                return (
                  <>
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {item.kode_kelas}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {getMatkulName(item.matkul_id)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {getDosenName(item.dosen_id)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {getMatkulSKS(item.matkul_id)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() =>
                            setExpandedSKS(expandedSKS === item.id ? null : item.id)
                          }
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {mhsCount} mhs
                        </button>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                        <span
                          className={
                            mhsCount >= item.kapasitas
                              ? "text-red-600 font-semibold"
                              : ""
                          }
                        >
                          {mhsCount}/{item.kapasitas}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openEditModal(item)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedSKS === item.id && item.mahasiswa_ids?.length > 0 && (
                      <tr key={`sks-${item.id}`} className="bg-slate-50">
                        <td colSpan="8" className="border border-gray-300 px-4 py-2">
                          <div className="text-xs space-y-1">
                            <p className="font-semibold text-slate-600 mb-1">
                              Detail SKS Mahasiswa:
                            </p>
                            {item.mahasiswa_ids.map((mhsId) => {
                              const mhs = mahasiswaList.find((m) => m.id == mhsId);
                              const totalSKS = getMhsSKS(mhsId);
                              const maxSKS = getMhsMaxSKS(mhsId);
                              const over = totalSKS > maxSKS;
                              return (
                                <div
                                  key={mhsId}
                                  className="flex justify-between px-2"
                                >
                                  <span>{mhs ? `${mhs.nim} - ${mhs.nama}` : "-"}</span>
                                  <span
                                    className={
                                      over ? "text-red-600 font-semibold" : "text-slate-500"
                                    }
                                  >
                                    {totalSKS}/{maxSKS} SKS
                                    {over ? " (LEBIH)" : ""}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
