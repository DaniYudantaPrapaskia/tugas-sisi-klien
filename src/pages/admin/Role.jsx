import { useState, useEffect } from "react";
import Header from "../../components/organisms/Header";
import RoleModal from "./RoleModal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { roleApi } from "../../api/roleApi";

export default function Role() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleApi.getAll();
      setRoles(data);
    } catch (error) {
      toast.error("Gagal memuat data role", {
        position: "top-right",
      });
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const storeRole = async (newRole) => {
    try {
      const data = await roleApi.create(newRole);
      setRoles((prev) => [...prev, data]);
      toast.success("Role berhasil ditambahkan.", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Gagal menambahkan role", {
        position: "top-right",
      });
      console.error("Error creating role:", error);
    }
  };

  const updateRole = async (updatedRole, idTarget) => {
    try {
      const data = await roleApi.update(idTarget, updatedRole);
      setRoles((prev) =>
        prev.map((item) => (item.id === idTarget ? data : item))
      );
      toast.success("Role berhasil diupdate.", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Gagal mengupdate role", {
        position: "top-right",
      });
      console.error("Error updating role:", error);
    }
  };

  const deleteRole = async (id) => {
    try {
      await roleApi.delete(id);
      setRoles((prev) => prev.filter((item) => item.id !== id));
      toast.success("Role berhasil dihapus.", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Gagal menghapus role", {
        position: "top-right",
      });
      console.error("Error deleting role:", error);
    }
  };

  const openAddModal = () => {
    setModalOpen(true);
    setSelectedRole(null);
  };

  const openViewModal = (id) => {
    const exists = roles.some((r) => r.id === id);

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
      navigate(`/admin/role/${id}`);
    });
  };

  const openEditModal = (selectedRoleItem) => {
    setModalOpen(true);
    setSelectedRole(selectedRoleItem);
  };

  const handleSubmit = (formValue) => {
    if (!formValue.name) {
      toast.error("Nama role wajib diisi!", {
        position: "top-right",
      });
      return;
    }

    Swal.fire({
      title: selectedRole ? "Update Role?" : "Simpan Role?",
      text: selectedRole
        ? "Perubahan akan disimpan."
        : "Role baru akan ditambahkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedRole) {
          updateRole(formValue, selectedRole.id);
        } else {
          storeRole(formValue);
        }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin?",
      text: "Role akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRole(id);
      }
    });
  };

  return (
    <>
      <Header title={"Role Management"} />

      <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow flex flex-col">
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Tambah Role
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    No
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Nama Role
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Permissions
                  </th>
                  <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data role
                    </td>
                  </tr>
                ) : (
                  roles.map((role, index) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 border-b text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-700">
                        {role.name}
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-700">
                        {role.description}
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-700">
                        {role.permissions?.length || 0} permissions
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openViewModal(role.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => openEditModal(role)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RoleModal
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedRole={selectedRole}
        roles={roles}
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
