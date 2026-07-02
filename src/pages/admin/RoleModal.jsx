import { useState, useEffect } from "react";
import Modal from "../../components/organisms/Modal";

const INITIAL_FORM = {
  name: "",
  description: "",
  permissions: [],
};

const AVAILABLE_PERMISSIONS = [
  { id: "user.read", label: "View Users" },
  { id: "user.create", label: "Create Users" },
  { id: "user.update", label: "Edit Users" },
  { id: "user.delete", label: "Delete Users" },
  { id: "role.read", label: "View Roles" },
  { id: "role.create", label: "Create Roles" },
  { id: "role.update", label: "Edit Roles" },
  { id: "role.delete", label: "Delete Roles" },
  { id: "dosen.manage", label: "Manage Dosen" },
  { id: "matkul.manage", label: "Manage Mata Kuliah" },
  { id: "mahasiswa.manage", label: "Manage Mahasiswa" },
  { id: "matkul.read", label: "View Mata Kuliah" },
  { id: "mahasiswa.read", label: "View Mahasiswa" },
];

const buildForm = (selectedRole) => {
  if (!selectedRole) return INITIAL_FORM;

  return {
    name: selectedRole.name || "",
    description: selectedRole.description || "",
    permissions: selectedRole.permissions || [],
  };
};

export default function RoleModal({
  isModalOpen,
  onClose,
  onSubmit,
  selectedRole,
  roles,
}) {
  useEffect(() => {
    setForm(buildForm(selectedRole));
  }, [selectedRole]);

  const [form, setForm] = useState(() => buildForm(selectedRole));
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setForm((prev) => {
      const permissions = prev.permissions || [];
      const isSelected = permissions.includes(permissionId);

      return {
        ...prev,
        permissions: isSelected
          ? permissions.filter((p) => p !== permissionId)
          : [...permissions, permissionId],
      };
    });
  };

  const validateForm = () => {
    if (String(form.name).trim() === "") {
      return "Nama role wajib diisi.";
    }

    const nameAlreadyUsed = roles.some(
      (item) => item.name === form.name && item.id !== selectedRole?.id
    );
    if (nameAlreadyUsed) {
      return "Nama role sudah digunakan.";
    }

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
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">
        {selectedRole ? "Edit" : "Tambah"} Role
      </h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Nama Role"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Deskripsi"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
          rows="3"
        />

        <div className="border p-3 rounded-lg">
          <p className="font-semibold mb-2 text-sm">Permissions:</p>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {AVAILABLE_PERMISSIONS.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={form.permissions?.includes(permission.id) || false}
                  onChange={() => handlePermissionToggle(permission.id)}
                  className="cursor-pointer"
                />
                <span className="text-sm">{permission.label}</span>
              </label>
            ))}
          </div>
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
