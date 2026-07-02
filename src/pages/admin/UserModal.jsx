import { useState, useEffect } from "react";
import Modal from "../../components/organisms/Modal";

const INITIAL_FORM = {
  nama: "",
  email: "",
  password: "",
  role_id: "",
};

const buildForm = (selectedUser) => {
  if (!selectedUser) return INITIAL_FORM;

  return {
    nama: selectedUser.nama || "",
    email: selectedUser.email || "",
    password: "",
    role_id: selectedUser.role_id || "",
  };
};

export default function UserModal({
  isModalOpen,
  onClose,
  onSubmit,
  selectedUser,
  users,
  roles,
}) {
  useEffect(() => {
    setForm(buildForm(selectedUser));
  }, [selectedUser]);

  const [form, setForm] = useState(() => buildForm(selectedUser));
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ["nama", "email", "role_id"];
    const hasEmptyField = requiredFields.some(
      (field) => String(form[field]).trim() === ""
    );
    if (hasEmptyField) return "Nama, email, dan role wajib diisi.";

    if (!selectedUser && String(form.password).trim() === "") {
      return "Password wajib diisi untuk user baru.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) return "Format email tidak valid.";

    const emailAlreadyUsed = users.some(
      (item) => item.email === form.email && item.id !== selectedUser?.id
    );
    if (emailAlreadyUsed) return "Email sudah digunakan.";

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const dataToSubmit = { ...form };
    if (selectedUser && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    onSubmit(dataToSubmit);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">
        {selectedUser ? "Edit" : "Tambah"} User
      </h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
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
          type="password"
          name="password"
          placeholder={selectedUser ? "Password (kosongkan jika tidak diubah)" : "Password"}
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
        />

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Role
          </label>
          <select
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            className="border p-2 w-full rounded-lg"
          >
            <option value="">-- Pilih Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Simpan
        </button>
      </form>
    </Modal>
  );
}
