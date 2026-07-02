import { useState, useEffect } from "react";
import Modal from "../../components/organisms/Modal";

const INITIAL_FORM = {
  kode_mk: "",
  nama_mk: "",
  sks: "",
  semester: "",
  dosen_pengampu: "",
  status: true,
};

const buildForm = (selectedMatkul) => {
  if (!selectedMatkul) return INITIAL_FORM;

  return {
    kode_mk: selectedMatkul.kode_mk || "",
    nama_mk: selectedMatkul.nama_mk || "",
    sks: selectedMatkul.sks ?? "",
    semester: selectedMatkul.semester ?? "",
    dosen_pengampu: selectedMatkul.dosen_pengampu || "",
    status: Boolean(selectedMatkul.status),
  };
};

export default function MatkulModal({
  isModalOpen,
  onClose,
  onSubmit,
  selectedMatkul,
  matkul,
}) {
  useEffect(() => {
    setForm(buildForm(selectedMatkul));
  }, [selectedMatkul]);

  const [form, setForm] = useState(() => buildForm(selectedMatkul));
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
      "kode_mk",
      "nama_mk",
      "sks",
      "semester",
      "dosen_pengampu",
    ];
    const hasEmptyField = requiredFields.some(
      (field) => String(form[field]).trim() === ""
    );
    if (hasEmptyField) return "Semua field wajib diisi.";

    const sksValue = Number(form.sks);
    if (Number.isNaN(sksValue) || sksValue < 1 || sksValue > 6) {
      return "SKS harus di antara 1 sampai 6.";
    }

    const semesterValue = Number(form.semester);
    if (
      Number.isNaN(semesterValue) ||
      semesterValue < 1 ||
      semesterValue > 14
    ) {
      return "Semester harus di antara 1 sampai 14.";
    }

    const kodeMkAlreadyUsed = matkul.some(
      (item) =>
        item.kode_mk === form.kode_mk &&
        item.kode_mk !== selectedMatkul?.kode_mk
    );
    if (kodeMkAlreadyUsed) return "Kode MK sudah digunakan.";

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
      sks: Number(form.sks),
      semester: Number(form.semester),
    });
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <h2 className="text-lg font-bold mb-4">
          {selectedMatkul ? "Edit" : "Tambah"} Mata Kuliah
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="kode_mk"
            placeholder="Kode MK"
            value={form.kode_mk}
            onChange={handleChange}
            className="border p-2 w-full rounded-lg"
            disabled={selectedMatkul}
          />

          <input
            type="text"
            name="nama_mk"
            placeholder="Nama Mata Kuliah"
            value={form.nama_mk}
            onChange={handleChange}
            className="border p-2 w-full rounded-lg"
          />

          <input
            type="number"
            min="1"
            max="6"
            name="sks"
            placeholder="SKS"
            value={form.sks}
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
            name="dosen_pengampu"
            placeholder="Dosen Pengampu"
            value={form.dosen_pengampu}
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
