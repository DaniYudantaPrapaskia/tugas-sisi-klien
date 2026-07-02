import { useState } from "react";
import Header from "../../components/organisms/Header";
import DosenModal from "./DosenModal";
import DosenTable from "./DosenTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { dosenApi } from "../../api/dosenApi";
import { useGetAll, useCreate, useUpdate, useDelete } from "../../utils/useApiQuery";

export default function Dosen() {
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: dosen = [], isLoading } = useGetAll("dosen", dosenApi.getAll);
  const createMutation = useCreate("dosen", dosenApi.create);
  const updateMutation = useUpdate("dosen", dosenApi.update);
  const deleteMutation = useDelete("dosen", dosenApi.delete);

  const openAddModal = () => {
    setModalOpen(true);
    setSelectedDosen(null);
  };

  const openViewModal = (id) => {
    const exists = dosen.some((d) => d.id === id);

    if (!exists) {
      toast.error("Data tidak ditemukan!", { position: "top-right" });
      return;
    }

    Swal.fire({
      title: "Membuka Detail...",
      icon: "info",
      timer: 800,
      showConfirmButton: false,
    }).then(() => {
      navigate(`/admin/dosen/${id}`);
    });
  };

  const openEditModal = (selectedDosenItem) => {
    setModalOpen(true);
    setSelectedDosen(selectedDosenItem);
  };

  const handleSubmit = (formValue) => {
    if (!formValue.nidn || !formValue.nama) {
      toast.error("Data tidak lengkap!", { position: "top-right" });
      return;
    }

    Swal.fire({
      title: selectedDosen ? "Update Data?" : "Simpan Data?",
      text: selectedDosen ? "Perubahan akan disimpan." : "Data baru akan ditambahkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedDosen) {
          updateMutation.mutate(
            { id: selectedDosen.id, data: formValue },
            {
              onSuccess: () =>
                toast.success("Data dosen berhasil diupdate.", { position: "top-right", autoClose: 1500 }),
              onError: () =>
                toast.error("Gagal mengupdate data dosen", { position: "top-right" }),
            }
          );
        } else {
          createMutation.mutate(formValue, {
            onSuccess: () =>
              toast.success("Data dosen berhasil ditambahkan.", { position: "top-right", autoClose: 1500 }),
            onError: () =>
              toast.error("Gagal menambahkan data dosen", { position: "top-right" }),
          });
        }
      }
    });
  };

  const handleDelete = (nidn) => {
    Swal.fire({
      title: "Yakin?",
      text: "Data dosen akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const target = dosen.find((item) => item.nidn === nidn);
        if (!target) {
          toast.error("Data tidak ditemukan!", { position: "top-right" });
          return;
        }

        deleteMutation.mutate(target.id, {
          onSuccess: () =>
            toast.success("Data dosen berhasil dihapus.", { position: "top-right", autoClose: 1500 }),
          onError: () =>
            toast.error("Gagal menghapus data dosen", { position: "top-right" }),
        });
      }
    });
  };

  return (
    <>
      <Header title={"Dosen"} />

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
          <DosenTable
            dosen={dosen}
            openEditModal={openEditModal}
            onDelete={handleDelete}
            onView={openViewModal}
          />
        )}
      </div>

      <DosenModal
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedDosen={selectedDosen}
        dosen={dosen}
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
