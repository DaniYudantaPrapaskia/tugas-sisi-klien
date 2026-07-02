import { useState } from "react";
import Pagination from "../../components/molecules/Pagination";

const PAGE_SIZE = 5;

export default function DosenTable({ dosen, openEditModal, onDelete, onView }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dosen.length / PAGE_SIZE);
  const paginated = dosen.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">No</th>
              <th className="border border-gray-300 px-4 py-2">NIDN</th>
              <th className="border border-gray-300 px-4 py-2">Nama</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">No. Telepon</th>
              <th className="border border-gray-300 px-4 py-2">Bidang Keahlian</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Tidak ada data dosen
                </td>
              </tr>
            ) : (
              paginated.map((item, index) => (
                <tr key={item.nidn} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{item.nidn}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.nama}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.no_telp}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.bidang_keahlian}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {item.status ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onView(item.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.nidn)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
