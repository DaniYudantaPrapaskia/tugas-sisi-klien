import { useState } from "react";
import Modal from "../../components/organisms/Modal";
import { useEffect } from "react";
const INITIAL_FORM = {
   nim: "",
   nama: "",
   email: "",
   ipk: "",
   semester: "",
   no_telp: "",
   status: true,
};

const buildForm = (selectedMahasiswa) => {
   if (!selectedMahasiswa) return INITIAL_FORM;

   return {
      nim: selectedMahasiswa.nim || "",
      nama: selectedMahasiswa.nama || "",
      email: selectedMahasiswa.email || "",
      ipk: selectedMahasiswa.ipk ?? "",
      semester: selectedMahasiswa.semester ?? "",
      no_telp: selectedMahasiswa.no_telp || "",
      status: Boolean(selectedMahasiswa.status),
   };
};

export default function MahasiswaModal({
   isModalOpen,
   onClose,
   onSubmit,
   selectedMahasiswa,
   mahasiswa,
}) {
   useEffect(() => {
      setForm(buildForm(selectedMahasiswa));
   }, [selectedMahasiswa]);

   const [form, setForm] = useState(() => buildForm(selectedMahasiswa));
   const [error, setError] = useState("");

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const validateForm = () => {
      const requiredFields = [
         "nim",
         "nama",
         "email",
         "ipk",
         "semester",
         "no_telp",
      ];
      const hasEmptyField = requiredFields.some(
         (field) => String(form[field]).trim() === "",
      );
      if (hasEmptyField) return "Semua field wajib diisi.";

      const ipkValue = Number(form.ipk);
      if (Number.isNaN(ipkValue) || ipkValue < 0 || ipkValue > 4) {
         return "IPK harus di antara 0 sampai 4.";
      }

      const semesterValue = Number(form.semester);
      if (
         Number.isNaN(semesterValue) ||
         semesterValue < 1 ||
         semesterValue > 14
      ) {
         return "Semester harus di antara 1 sampai 14.";
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(form.email)) return "Format email tidak valid.";

      const phonePattern = /^[0-9+\-\s]{8,20}$/;
      if (!phonePattern.test(form.no_telp)) {
         return "Nomor telepon tidak valid.";
      }

      const nimAlreadyUsed = mahasiswa.some(
         (item) => item.nim === form.nim && item.nim !== selectedMahasiswa?.nim,
      );
      if (nimAlreadyUsed) return "NIM sudah digunakan.";

      return "";
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      const validationError = validateForm();
      if (validationError) {
         setError(validationError);
         return;
      }

      onSubmit({
         ...form,
         ipk: Number(form.ipk),
         semester: Number(form.semester),
      });
      onClose();
   };

   if (!isModalOpen) return null;

   return (
      <>
         <Modal isOpen={isModalOpen} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">
               {selectedMahasiswa ? "Edit" : "Tambah"} Mahasiswa
            </h2>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
               <input
                  type="text"
                  name="nim"
                  placeholder="NIM"
                  value={form.nim}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg"
               />

               <input
                  type="text"
                  name="nama"
                  placeholder="Nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg"
               />

               <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg"
               />

               <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  name="ipk"
                  placeholder="IPK"
                  value={form.ipk}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg"
               />

               <input
                  type="number"
                  min="1"
                  max="14"
                  name="semester"
                  placeholder="Semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg"
               />

               <input
                  type="text"
                  name="no_telp"
                  placeholder="No. Telepon"
                  value={form.no_telp}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg"
               />

               <label className="flex items-center gap-2">
                  <input
                     type="checkbox"
                     name="status"
                     checked={form.status}
                     onChange={handleChange}
                  />
                  Aktif
               </label>

               <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
               >
                  Simpan
               </button>
            </form>
         </Modal>
      </>
   );
}
