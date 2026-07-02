import { useState, useEffect } from "react";
import Header from "../../components/organisms/Header";
import MatkulModal from "./MatkulModal";
import MatkulTable from "./MatkulTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { matkulApi } from "../../api/matkulApi";
import { getUserRole } from "../../utils/permissions";
import { useGetAll, useCreate, useUpdate, useDelete } from "../../utils/useApiQuery";

export default function Matkul() {
  const [selectedMatkul, setSelectedMatkul] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [canManage, setCanManage] = useState(false);
  const navigate = useNavigate();

  const { data: matkul = [], isLoading } = useGetAll("matkul", matkulApi.getAll);
  const createMutation = useCreate("matkul", matkulApi.create);
  const updateMutation = useUpdate("matkul", matkulApi.update);
  const deleteMutation = useDelete("matkul", matkulApi.delete);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const role = await getUserRole();
      const hasManagePermission = role?.permissions?.includes('matkul.manage');
      setCanManage(hasManagePermission);
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const openAddModal = () => {
    setModalOpen(true);
    setSelectedMatkul(null);
  };

  const openViewModal = (id) => {
    const exists = matkul.some((m) => m.id === id);

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
      navigate(`/admin/matkul/${id}`);
    });
  };

  const openEditModal = (selectedMatkulItem) => {
    setModalOpen(true);
    setSelectedMatkul(selectedMatkulItem);
  };

  const handleSubmit = (formValue) => {
    if (!formValue.kode_mk || !formValue.nama_mk) {
      toast.error("Data tidak lengkap!", { position: "top-right" });
      return;
    }

    Swal.fire({
      title: selectedMatkul ? "Update Data?" : "Simpan Data?",
      text: selectedMatkul ? "Perubahan akan disimpan." : "Data baru akan ditambahkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedMatkul) {
          updateMutation.mutate(
            { id: selectedMatkul.id, data: formValue },
            {
              onSuccess: () =>
                toast.success("Data mata kuliah berhasil diupdate.", { position: "top-right", autoClose: 1500 }),
              onError: () =>
                toast.error("Gagal mengupdate data mata kuliah", { position: "top-right" }),
            }
          );
        } else {
          createMutation.mutate(formValue, {
            onSuccess: () =>
              toast.success("Data mata kuliah berhasil ditambahkan.", { position: "top-right", autoClose: 1500 }),
            onError: () =>
              toast.error("Gagal menambahkan data mata kuliah", { position: "top-right" }),
          });
        }
      }
    });
  };

  const handleDelete = (kodeMk) => {
    Swal.fire({
      title: "Yakin?",
      text: "Data mata kuliah akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const target = matkul.find((item) => item.kode_mk === kodeMk);
        if (!target) {
          toast.error("Data tidak ditemukan!", { position: "top-right" });
          return;
        }

        deleteMutation.mutate(target.id, {
          onSuccess: () =>
            toast.success("Data mata kuliah berhasil dihapus.", { position: "top-right", autoClose: 1500 }),
          onError: () =>
            toast.error("Gagal menghapus data mata kuliah", { position: "top-right" }),
        });
      }
    });
  };

  return (
    <>
      <Header title={"Mata Kuliah"} />

      <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow flex flex-col">
        {canManage && (
          <div className="flex justify-end mb-4">
            <button
              onClick={openAddModal}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Tambah Data
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <MatkulTable
            matkul={matkul}
            openEditModal={canManage ? openEditModal : null}
            onDelete={canManage ? handleDelete : null}
            onView={openViewModal}
            readOnly={!canManage}
          />
        )}
      </div>

      {canManage && (
        <MatkulModal
          isModalOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          selectedMatkul={selectedMatkul}
          matkul={matkul}
          setModalOpen={setModalOpen}
        />
      )}
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
