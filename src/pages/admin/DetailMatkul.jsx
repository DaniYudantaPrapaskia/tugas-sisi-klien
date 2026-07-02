import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/organisms/Header";
import { matkulApi } from "../../api/matkulApi";
import { toast } from "react-toastify";

export default function DetailMatkul() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matkul, setMatkul] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatkulDetail();
  }, [id]);

  const fetchMatkulDetail = async () => {
    try {
      setLoading(true);
      const data = await matkulApi.getById(id);
      setMatkul(data);
    } catch (error) {
      toast.error("Gagal memuat detail mata kuliah", {
        position: "top-right",
      });
      console.error("Error fetching matkul detail:", error);
      navigate("/admin/matkul");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Detail Mata Kuliah" />
        <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
          <p className="text-center text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  if (!matkul) {
    return (
      <>
        <Header title="Detail Mata Kuliah" />
        <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
          <p className="text-center text-red-500">
            Data mata kuliah tidak ditemukan
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Detail Mata Kuliah" />

      <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/matkul")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">Kode MK</p>
              <p className="text-lg">{matkul.kode_mk}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Nama Mata Kuliah</p>
              <p className="text-lg">{matkul.nama_mk}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">SKS</p>
              <p className="text-lg">{matkul.sks}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Semester</p>
              <p className="text-lg">{matkul.semester}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">Dosen Pengampu</p>
              <p className="text-lg">{matkul.dosen_pengampu}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Status</p>
              <p className="text-lg">
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    matkul.status
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {matkul.status ? "Aktif" : "Nonaktif"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
