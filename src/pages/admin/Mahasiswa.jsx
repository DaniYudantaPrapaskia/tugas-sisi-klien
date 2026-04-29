import { useState } from "react";
import Header from "../../components/organisms/Header";
import { data } from "../../data/data";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

export default function Mahasiswa() {
   const [mahasiswa, setMahasiswa] = useState(data);
   const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
   const [isModalOpen, setModalOpen] = useState(false);
   const navigate = useNavigate();

   const storeMahasiswa = (newMahasiswa) => {
      setMahasiswa((prev) => [...prev, newMahasiswa]);
   };

   const updateMahasiswa = (updatedMahasiswa, nimTarget) => {
      setMahasiswa((prev) =>
         prev.map((item) =>
            item.nim === nimTarget ? { ...item, ...updatedMahasiswa } : item,
         ),
      );
   };

   const deleteMahasiswa = (nim) => {
      setMahasiswa((prev) => prev.filter((item) => item.nim !== nim));
   };

   const openAddModal = () => {
      setModalOpen(true);
      setSelectedMahasiswa(null);
   };

   const openViewModal = (id) => {
      const exists = mahasiswa.some((m) => m.id === id);

      if (!exists) {
         toast.error("Data tidak ditemukan!", {
            position: "top-right",
         });
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
         toast.error("Data tidak lengkap!", {
            position: "top-right",
         });
         return;
      }

      Swal.fire({
         title: selectedMahasiswa ? "Update Data?" : "Simpan Data?",
         text: selectedMahasiswa
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
            if (selectedMahasiswa) {
               updateMahasiswa(formValue, selectedMahasiswa.nim);

               toast.success("Data mahasiswa berhasil diupdate.", {
                  position: "top-right",
                  autoClose: 1500,
               });
            } else {
               storeMahasiswa(formValue);

               toast.success("Data mahasiswa berhasil ditambahkan.", {
                  position: "top-right",
                  autoClose: 1500,
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
            const exists = mahasiswa.some((m) => m.nim === nim);

            if (!exists) {
               toast.error("Data tidak ditemukan!", {
                  position: "top-right",
               });
               return;
            }

            deleteMahasiswa(nim);

            toast.success("Data mahasiswa berhasil dihapus.", {
               position: "top-right",
               autoClose: 1500,
            });
         }
      });
   };

   return (
      <>
         <Header title={"Mahasiswa"} />

         <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow flex flex-col">
            <div className="flex justify-end mb-4">
               <button
                  onClick={openAddModal}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
               >
                  Tambah Data
               </button>
            </div>

            <MahasiswaTable
               mahasiswa={mahasiswa}
               openEditModal={openEditModal}
               onDelete={handleDelete}
               onView={openViewModal}
            />
         </div>

         <MahasiswaModal
            isModalOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
            selectedMahasiswa={selectedMahasiswa}
            mahasiswa={mahasiswa}
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
