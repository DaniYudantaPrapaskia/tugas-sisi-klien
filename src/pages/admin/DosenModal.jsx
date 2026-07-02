import { useState, useEffect } from "react";
import Modal from "../../components/organisms/Modal";

const INITIAL_FORM = {
  nidn: "",
  nama: "",
  email: "",
  no_telp: "",
  bidang_keahlian: "",
  status: true,
};

const buildForm = (selectedDosen) => {
  if (!selectedDosen) return INITIAL_FORM;

  return {
    nidn: selectedDosen.nidn || "",
    nama: selectedDosen.nama || "",
    email: selectedDosen.email || "",
    no_telp: selectedDosen.no_telp || "",
    bidang_keahlian: selectedDosen.bidang_keahlian || "",
    status: Boolean(selectedDosen.status),
  };
};

export default function DosenModal({
  isModalOpen,
  onClose,
  onSubmit,
  selectedDosen,
  dosen,
}) {
  useEffect(() => {
    setForm(buildForm(selectedDosen));
  }, [selectedDosen]);

  const [form, setForm] = useState(() => buildForm(selectedDosen));
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
      "nidn",
      "nama",
      "email",
      "no_telp",
      "bidang_keahlian",
    ];
    const hasEmptyField = requiredFields.some(
      (field) => String(form[field]).trim() === ""
    );
    if (hasEmptyField) return "Semua field wajib diisi.";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) return "Format email tidak valid.";

    const phonePattern = /^[0-9+\-\s]{8,20}$/;
    if (!phonePattern.test(form.no_telp)) {
      return "Nomor telepon tidak valid.";
    }

    const nidnAlreadyUsed = dosen.some(
      (item) => item.nidn === form.nidn && item.nidn !== selectedDosen?.nidn
    );
    if (nidnAlreadyUsed) return "NIDN sudah digunakan.";

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit(form);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <h2 className="text-lg font-bold mb-4">
          {selectedDosen ? "Edit" : "Tambah"} Dosen
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="nidn"
            placeholder="NIDN"
            value={form.nidn}
            onChange={handleChange}
            className="border p-2 w-full rounded-lg"
            disabled={selectedDosen}
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
            type="text"
            name="no_telp"
            placeholder="No. Telepon"
            value={form.no_telp}
            onChange={handleChange}
            className="border p-2 w-full rounded-lg"
          />

          <input
            type="text"
            name="bidang_keahlian"
            placeholder="Bidang Keahlian"
            value={form.bidang_keahlian}
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
