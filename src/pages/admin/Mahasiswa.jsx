import { useState, useEffect } from "react";
import Header from "../../components/organisms/Header";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { getUserRole } from "../../utils/permissions";
import { mahasiswaApi } from "../../api/mahasiswaApi";
import { useGetAll, useCreate, useUpdate, useDelete } from "../../utils/useApiQuery";

export default function Mahasiswa() {
   const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
   const [isModalOpen, setModalOpen] = useState(false);
   const [canManage, setCanManage] = useState(false);
   const navigate = useNavigate();

   const { data: mahasiswa = [], isLoading } = useGetAll("mahasiswa", mahasiswaApi.getAll);
   const createMutation = useCreate("mahasiswa", mahasiswaApi.create);
   const updateMutation = useUpdate("mahasiswa", mahasiswaApi.update);
   const deleteMutation = useDelete("mahasiswa", mahasiswaApi.delete);

   useEffect(() => {
      checkPermissions();
   }, []);

   const checkPermissions = async () => {
      try {
         const role = await getUserRole();
         const hasManagePermission = role?.permissions?.includes('mahasiswa.manage');
         setCanManage(hasManagePermission);
      } catch (error) {
         console.error('Error checking permissions:', error);
      }
   };

   const openAddModal = () => {
      setModalOpen(true);
      setSelectedMahasiswa(null);
   };

   const openViewModal = (id) => {
      const exists = mahasiswa.some((m) => m.id === id);

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
         navigate(`/admin/mahasiswa/${id}`);
      });
   };

   const openEditModal = (selectedMahasiswaItem) => {
      setModalOpen(true);
      setSelectedMahasiswa(selectedMahasiswaItem);
   };

   const handleSubmit = (formValue) => {
      if (!formValue.nim || !formValue.nama) {
         toast.error("Data tidak lengkap!", { position: "top-right" });
         return;
      }

      Swal.fire({
         title: selectedMahasiswa ? "Update Data?" : "Simpan Data?",
         text: selectedMahasiswa ? "Perubahan akan disimpan." : "Data baru akan ditambahkan.",
         icon: "question",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Ya, simpan!",
         cancelButtonText: "Batal",
      }).then((result) => {
         if (result.isConfirmed) {
            if (selectedMahasiswa) {
               updateMutation.mutate(
                  { id: selectedMahasiswa.id, data: formValue },
                  {
                     onSuccess: () =>
                        toast.success("Data mahasiswa berhasil diupdate.", { position: "top-right", autoClose: 1500 }),
                     onError: () =>
                        toast.error("Gagal mengupdate data mahasiswa", { position: "top-right" }),
                  }
               );
            } else {
               createMutation.mutate(formValue, {
                  onSuccess: () =>
                     toast.success("Data mahasiswa berhasil ditambahkan.", { position: "top-right", autoClose: 1500 }),
                  onError: () =>
                     toast.error("Gagal menambahkan data mahasiswa", { position: "top-right" }),
               });
            }
         }
      });
   };

   const handleDelete = (nim) => {
      Swal.fire({
         title: "Yakin?",
         text: "Data mahasiswa akan dihapus!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#d33",
         cancelButtonColor: "#3085d6",
         confirmButtonText: "Ya, hapus!",
         cancelButtonText: "Batal",
      }).then((result) => {
         if (result.isConfirmed) {
            const target = mahasiswa.find((m) => m.nim === nim);
            if (!target) {
               toast.error("Data tidak ditemukan!", { position: "top-right" });
               return;
            }

            deleteMutation.mutate(target.id, {
               onSuccess: () =>
                  toast.success("Data mahasiswa berhasil dihapus.", { position: "top-right", autoClose: 1500 }),
               onError: () =>
                  toast.error("Gagal menghapus data mahasiswa", { position: "top-right" }),
            });
         }
      });
   };

   return (
      <>
         <Header title={"Mahasiswa"} />

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
               <MahasiswaTable
                  mahasiswa={mahasiswa}
                  openEditModal={canManage ? openEditModal : null}
                  onDelete={canManage ? handleDelete : null}
                  onView={openViewModal}
                  readOnly={!canManage}
               />
            )}
         </div>

         {canManage && (
            <MahasiswaModal
               isModalOpen={isModalOpen}
               onClose={() => setModalOpen(false)}
               onSubmit={handleSubmit}
               selectedMahasiswa={selectedMahasiswa}
               mahasiswa={mahasiswa}
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
