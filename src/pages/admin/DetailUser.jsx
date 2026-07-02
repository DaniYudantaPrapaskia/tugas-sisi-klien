import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/organisms/Header";
import { userApi } from "../../api/userApi";
import { roleApi } from "../../api/roleApi";
import { toast } from "react-toastify";

export default function DetailUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const userData = await userApi.getById(id);
      setUser(userData);

      if (userData.role_id) {
        const roleData = await roleApi.getById(userData.role_id);
        setRole(roleData);
      }
    } catch (error) {
      toast.error("Gagal memuat detail user", {
        position: "top-right",
      });
      console.error("Error fetching user detail:", error);
      navigate("/admin/user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Detail User" />
        <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
          <p className="text-center text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header title="Detail User" />
        <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
          <p className="text-center text-red-500">Data user tidak ditemukan</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Detail User" />

      <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/user")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">Nama</p>
              <p className="text-lg">{user.nama}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-600 font-semibold mb-2">Role</p>
            {role ? (
              <div className="border rounded p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama Role:</p>
                  <p className="text-lg font-semibold">{role.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deskripsi:</p>
                  <p>{role.description || "-"}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Role tidak ditemukan</p>
            )}
          </div>

          {role && role.permissions && (
            <div>
              <p className="text-gray-600 font-semibold mb-2">
                Permissions ({role.permissions.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.length > 0 ? (
                  role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm"
                    >
                      {permission}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Tidak ada permission</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
