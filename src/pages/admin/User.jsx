import { useState, useEffect } from "react";
import Header from "../../components/organisms/Header";
import UserModal from "./UserModal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { userApi } from "../../api/userApi";
import { roleApi } from "../../api/roleApi";

export default function User() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      toast.error("Gagal memuat data user", {
        position: "top-right",
      });
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await roleApi.getAll();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown Role";
  };

  const storeUser = async (newUser) => {
    try {
      const data = await userApi.create(newUser);
      setUsers((prev) => [...prev, data]);
      toast.success("User berhasil ditambahkan.", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Gagal menambahkan user", {
        position: "top-right",
      });
      console.error("Error creating user:", error);
    }
  };

  const updateUser = async (updatedUser, idTarget) => {
    try {
      const data = await userApi.update(idTarget, updatedUser);
      setUsers((prev) =>
        prev.map((item) => (item.id === idTarget ? data : item))
      );
      toast.success("User berhasil diupdate.", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Gagal mengupdate user", {
        position: "top-right",
      });
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await userApi.delete(id);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      toast.success("User berhasil dihapus.", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Gagal menghapus user", {
        position: "top-right",
      });
      console.error("Error deleting user:", error);
    }
  };

  const openAddModal = () => {
    setModalOpen(true);
    setSelectedUser(null);
  };

  const openViewModal = (id) => {
    const exists = users.some((u) => u.id === id);

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
      navigate(`/admin/user/${id}`);
    });
  };

  const openEditModal = (selectedUserItem) => {
    setModalOpen(true);
    setSelectedUser(selectedUserItem);
  };

  const handleSubmit = (formValue) => {
    if (!formValue.nama || !formValue.email) {
      toast.error("Data tidak lengkap!", {
        position: "top-right",
      });
      return;
    }

    Swal.fire({
      title: selectedUser ? "Update User?" : "Simpan User?",
      text: selectedUser
        ? "Perubahan akan disimpan."
        : "User baru akan ditambahkan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedUser) {
          updateUser(formValue, selectedUser.id);
        } else {
          storeUser(formValue);
        }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin?",
      text: "User akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
      }
    });
  };

  return (
    <>
      <Header title={"User Management"} />

      <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow flex flex-col">
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Tambah User
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
                    Nama
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data user
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 border-b text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-700">
                        {user.nama}
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-700">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 border-b text-sm text-gray-700">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {getRoleName(user.role_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openViewModal(user.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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

      <UserModal
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedUser={selectedUser}
        users={users}
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
