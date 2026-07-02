import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/organisms/Header";
import { roleApi } from "../../api/roleApi";
import { userApi } from "../../api/userApi";
import { toast } from "react-toastify";

export default function DetailRole() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoleDetail();
  }, [id]);

  const fetchRoleDetail = async () => {
    try {
      setLoading(true);
      const roleData = await roleApi.getById(id);
      setRole(roleData);

      const allUsers = await userApi.getAll();
      const usersWithRole = allUsers.filter((user) => user.role_id === id);
      setUsers(usersWithRole);
    } catch (error) {
      toast.error("Gagal memuat detail role", {
        position: "top-right",
      });
      console.error("Error fetching role detail:", error);
      navigate("/admin/role");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Detail Role" />
        <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
          <p className="text-center text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  if (!role) {
    return (
      <>
        <Header title="Detail Role" />
        <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
          <p className="text-center text-red-500">Data role tidak ditemukan</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Detail Role" />

      <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/role")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-600 font-semibold">Nama Role</p>
            <p className="text-lg">{role.name}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold">Deskripsi</p>
            <p className="text-lg">{role.description || "-"}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold mb-2">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {role.permissions && role.permissions.length > 0 ? (
                role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {permission}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">Tidak ada permission</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-gray-600 font-semibold mb-2">
              Users dengan Role ini ({users.length})
            </p>
            {users.length > 0 ? (
              <div className="border rounded">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Nama
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{user.nama}</td>
                        <td className="px-4 py-2 text-sm">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Belum ada user dengan role ini</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
