import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/organisms/Header";
import { dosenApi } from "../../api/dosenApi";
import { toast } from "react-toastify";

export default function DetailDosen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dosen, setDosen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDosenDetail();
  }, [id]);

  const fetchDosenDetail = async () => {
    try {
      setLoading(true);
      const data = await dosenApi.getById(id);
      setDosen(data);
    } catch (error) {
      toast.error("Gagal memuat detail dosen", {
        position: "top-right",
      });
      console.error("Error fetching dosen detail:", error);
      navigate("/admin/dosen");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Detail Dosen" />
        <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
          <p className="text-center text-gray-500">Memuat data...</p>
        </div>
      </>
    );
  }

  if (!dosen) {
    return (
      <>
        <Header title="Detail Dosen" />
        <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
          <p className="text-center text-red-500">Data dosen tidak ditemukan</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Detail Dosen" />

      <div className="bg-white w-full min-h-[70vh] p-6 rounded shadow">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/dosen")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">NIDN</p>
              <p className="text-lg">{dosen.nidn}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Nama</p>
              <p className="text-lg">{dosen.nama}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">Email</p>
              <p className="text-lg">{dosen.email}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">No. Telepon</p>
              <p className="text-lg">{dosen.no_telp}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">Bidang Keahlian</p>
              <p className="text-lg">{dosen.bidang_keahlian}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Status</p>
              <p className="text-lg">
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    dosen.status
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {dosen.status ? "Aktif" : "Nonaktif"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
