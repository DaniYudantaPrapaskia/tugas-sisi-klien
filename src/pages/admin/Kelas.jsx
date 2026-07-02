import { useState } from "react";
import Header from "../../components/organisms/Header";
import KelasModal from "./KelasModal";
import KelasTable from "./KelasTable";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { kelasApi } from "../../api/kelasApi";
import { matkulApi } from "../../api/matkulApi";
import { dosenApi } from "../../api/dosenApi";
import { mahasiswaApi } from "../../api/mahasiswaApi";
import { useGetAll, useCreate, useUpdate, useDelete } from "../../utils/useApiQuery";

export default function Kelas() {
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: kelas = [], isLoading } = useGetAll("kelas", kelasApi.getAll);
  const { data: matkul = [] } = useGetAll("matkul", matkulApi.getAll);
  const { data: dosen = [] } = useGetAll("dosen", dosenApi.getAll);
  const { data: mahasiswa = [] } = useGetAll("mahasiswa", mahasiswaApi.getAll);

  const createMutation = useCreate("kelas", kelasApi.create);
  const updateMutation = useUpdate("kelas", kelasApi.update);
  const deleteMutation = useDelete("kelas", kelasApi.delete);

  const openAddModal = () => {
    setSelectedKelas(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedKelas(item);
    setModalOpen(true);
  };

  const handleSubmit = (formValue) => {
    if (!formValue.kode_kelas || !formValue.nama_kelas) {
      toast.error("Data tidak lengkap!", { position: "top-right" });
      return;
    }

    Swal.fire({
      title: selectedKelas ? "Update Data?" : "Simpan Data?",
      text: selectedKelas
        ? "Perubahan akan disimpan."
        : "Data baru akan ditambahkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedKelas) {
          updateMutation.mutate(
            { id: selectedKelas.id, data: formValue },
            {
              onSuccess: () =>
                toast.success("Data kelas berhasil diupdate.", {
                  position: "top-right",
                  autoClose: 1500,
                }),
              onError: () =>
                toast.error("Gagal mengupdate data kelas", {
                  position: "top-right",
                }),
            }
          );
        } else {
          createMutation.mutate(formValue, {
            onSuccess: () =>
              toast.success("Data kelas berhasil ditambahkan.", {
                position: "top-right",
                autoClose: 1500,
              }),
            onError: () =>
              toast.error("Gagal menambahkan data kelas", {
                position: "top-right",
              }),
          });
        }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin?",
      text: "Data kelas akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id, {
          onSuccess: () =>
            toast.success("Data kelas berhasil dihapus.", {
              position: "top-right",
              autoClose: 1500,
            }),
          onError: () =>
            toast.error("Gagal menghapus data kelas", {
              position: "top-right",
            }),
        });
      }
    });
  };

  return (
    <>
      <Header title={"Kelas"} />

      <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow flex flex-col">
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            Tambah Data
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <KelasTable
            kelas={kelas}
            openEditModal={openEditModal}
            onDelete={handleDelete}
            matkulList={matkul}
            dosenList={dosen}
            mahasiswaList={mahasiswa}
          />
        )}
      </div>

      {!isLoading && mahasiswa.length > 0 && (
        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Ringkasan SKS Mahasiswa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {mahasiswa.map((mhs) => {
              const matkulSKS = (matkul || []).reduce((map, mk) => {
                map[mk.id] = mk.sks;
                return map;
              }, {});
              const totalSKS = kelas
                .filter((k) => k.mahasiswa_ids?.includes(mhs.id))
                .reduce((sum, k) => sum + (matkulSKS[k.matkul_id] || 0), 0);
              const over = totalSKS > (mhs.max_sks || 24);
              return (
                <div
                  key={mhs.id}
                  className={`rounded-lg p-4 border ${
                    over
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="font-medium text-slate-900 text-sm">{mhs.nama}</p>
                  <p className="text-xs text-slate-500">{mhs.nim}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`text-lg font-bold ${
                        over ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {totalSKS}
                    </span>
                    <span className="text-xs text-slate-400">
                      /{mhs.max_sks || 24} SKS
                    </span>
                  </div>
                  {over && (
                    <p className="text-xs text-red-500 mt-1">Melebihi batas!</p>
                  )}
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        over ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (totalSKS / (mhs.max_sks || 24)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <KelasModal
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedKelas={selectedKelas}
        kelas={kelas}
        matkulList={matkul}
        dosenList={dosen}
        mahasiswaList={mahasiswa}
        setModalOpen={setModalOpen}
      />

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}
