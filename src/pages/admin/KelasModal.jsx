import { useState, useEffect } from "react";
import Modal from "../../components/organisms/Modal";

const INITIAL_FORM = {
  kode_kelas: "",
  nama_kelas: "",
  matkul_id: "",
  dosen_id: "",
  semester: "",
  tahun_ajaran: "",
  kapasitas: "",
  mahasiswa_ids: [],
};

const buildForm = (selectedKelas) => {
  if (!selectedKelas) return INITIAL_FORM;
  return {
    kode_kelas: selectedKelas.kode_kelas || "",
    nama_kelas: selectedKelas.nama_kelas || "",
    matkul_id: selectedKelas.matkul_id || "",
    dosen_id: selectedKelas.dosen_id || "",
    semester: selectedKelas.semester || "",
    tahun_ajaran: selectedKelas.tahun_ajaran || "",
    kapasitas: selectedKelas.kapasitas || "",
    mahasiswa_ids: selectedKelas.mahasiswa_ids || [],
  };
};

export default function KelasModal({
  isModalOpen,
  onClose,
  onSubmit,
  selectedKelas,
  kelas,
  matkulList,
  dosenList,
  mahasiswaList,
}) {
  const [form, setForm] = useState(() => buildForm(selectedKelas));
  const [error, setError] = useState("");
  const [mahasiswaSearch, setMahasiswaSearch] = useState("");
  const [showMhsDropdown, setShowMhsDropdown] = useState(false);

  useEffect(() => {
    setForm(buildForm(selectedKelas));
  }, [selectedKelas]);

  const selectedMatkul = matkulList.find((m) => m.id == form.matkul_id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "matkul_id") {
        const mk = matkulList.find((m) => m.id == value);
        if (mk && !selectedKelas) {
          next.nama_kelas = mk.nama_mk + " - Kelas " + (form.kode_kelas || "");
          next.semester = mk.semester;
        }
      }
      return next;
    });
  };

  const toggleMahasiswa = (mhsId) => {
    setForm((prev) => {
      const ids = prev.mahasiswa_ids.includes(mhsId)
        ? prev.mahasiswa_ids.filter((id) => id !== mhsId)
        : [...prev.mahasiswa_ids, mhsId];
      return { ...prev, mahasiswa_ids: ids };
    });
  };

  const getDosenSKS = (dosenId) => {
    return kelas
      .filter((k) => k.dosen_id == dosenId && String(k.id) !== String(selectedKelas?.id))
      .reduce((sum, k) => {
        const mk = matkulList.find((m) => m.id == k.matkul_id);
        return sum + (mk?.sks || 0);
      }, 0);
  };

  const getMhsSKS = (mhsId) => {
    return kelas
      .filter(
        (k) =>
          k.mahasiswa_ids?.includes(mhsId) &&
          String(k.id) !== String(selectedKelas?.id)
      )
      .reduce((sum, k) => {
        const mk = matkulList.find((m) => m.id == k.matkul_id);
        return sum + (mk?.sks || 0);
      }, 0);
  };

  const validateForm = () => {
    const requiredFields = [
      "kode_kelas",
      "nama_kelas",
      "matkul_id",
      "dosen_id",
      "semester",
      "tahun_ajaran",
      "kapasitas",
    ];
    const hasEmpty = requiredFields.some((f) => String(form[f]).trim() === "");
    if (hasEmpty) return "Semua field wajib diisi.";

    if (Number(form.kapasitas) < form.mahasiswa_ids.length) {
      return "Jumlah mahasiswa melebihi kapasitas kelas.";
    }

    const kodeUsed = kelas.some(
      (item) => item.kode_kelas === form.kode_kelas && String(item.id) !== String(selectedKelas?.id)
    );
    if (kodeUsed) return "Kode kelas sudah digunakan.";

    const mkSKS = selectedMatkul?.sks || 0;

    const matkulInOtherKelas = kelas.some(
      (item) =>
        item.matkul_id == form.matkul_id &&
        item.dosen_id != form.dosen_id &&
        String(item.id) !== String(selectedKelas?.id)
    );
    if (matkulInOtherKelas) {
      return "Mata kuliah ini sudah diajar oleh dosen lain di kelas berbeda.";
    }

    const dosen = dosenList.find((d) => d.id == form.dosen_id);
    if (dosen) {
      const existingSKS = getDosenSKS(form.dosen_id);
      if (existingSKS + mkSKS > dosen.max_sks) {
        return `Dosen melebihi batas maksimal SKS (${dosen.max_sks} SKS). Saat ini: ${existingSKS} SKS + ${mkSKS} SKS.`;
      }
    }

    const selectedMhsSKS = form.mahasiswa_ids.map((mhsId) => {
      const mhs = mahasiswaList.find((m) => m.id == mhsId);
      const existing = getMhsSKS(mhsId);
      return { mhs, existing, total: existing + mkSKS };
    });

    const overlimit = selectedMhsSKS.find(
      ({ mhs, total }) => mhs && total > mhs.max_sks
    );
    if (overlimit) {
      return `Mahasiswa "${overlimit.mhs.nama}" melebihi batas SKS (${overlimit.mhs.max_sks}). Saat ini: ${overlimit.existing} SKS + ${mkSKS} SKS.`;
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
    onSubmit({
      ...form,
      semester: Number(form.semester),
      kapasitas: Number(form.kapasitas),
    });
    onClose();
  };

  const filteredMhs = mahasiswaList.filter(
    (m) =>
      m.nama.toLowerCase().includes(mahasiswaSearch.toLowerCase()) ||
      m.nim.toLowerCase().includes(mahasiswaSearch.toLowerCase())
  );

  const getMhsSKSInfo = (mhsId) => {
    const currentKelasSKS = String(selectedKelas?.id)
      ? kelas
          .filter((k) => String(k.id) === String(selectedKelas?.id))
          .reduce((sum, k) => {
            const mk = matkulList.find((m) => m.id == k.matkul_id);
            return sum + (mk?.sks || 0);
          }, 0)
      : 0;
    const otherSKS = getMhsSKS(mhsId);
    const isSelected = form.mahasiswa_ids.includes(mhsId);
    const mkSKS = selectedMatkul?.sks || 0;
    return otherSKS + (isSelected ? currentKelasSKS : (selectedKelas ? 0 : mkSKS) + (form.mahasiswa_ids.includes(mhsId) ? mkSKS : 0));
  };

  const getSimpleMhsSKS = (mhsId) => {
    const otherSKS = getMhsSKS(mhsId);
    const mkSKS = selectedMatkul?.sks || 0;
    if (selectedKelas) {
      const isCurrentlyEnrolled = selectedKelas.mahasiswa_ids?.includes(mhsId);
      if (isCurrentlyEnrolled) {
        if (form.mahasiswa_ids.includes(mhsId)) return otherSKS + mkSKS;
        return otherSKS;
      } else {
        if (form.mahasiswa_ids.includes(mhsId)) return otherSKS + mkSKS;
        return otherSKS;
      }
    } else {
      if (form.mahasiswa_ids.includes(mhsId)) return otherSKS + mkSKS;
      return otherSKS;
    }
  };

  if (!isModalOpen) return null;

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">
        {selectedKelas ? "Edit" : "Tambah"} Kelas
      </h2>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2 mb-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="kode_kelas"
          placeholder="Kode Kelas"
          value={form.kode_kelas}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
          disabled={!!selectedKelas}
        />

        <input
          type="text"
          name="nama_kelas"
          placeholder="Nama Kelas"
          value={form.nama_kelas}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
        />

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Mata Kuliah</label>
          <select
            name="matkul_id"
            value={form.matkul_id}
            onChange={handleChange}
            className="border p-2 w-full rounded-lg"
          >
            <option value="">-- Pilih Mata Kuliah --</option>
            {matkulList.map((mk) => (
              <option key={mk.id} value={mk.id}>
                {mk.kode_mk} - {mk.nama_mk} ({mk.sks} SKS)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1 block">Dosen</label>
          <select
            name="dosen_id"
            value={form.dosen_id}
            onChange={handleChange}
            className="border p-2 w-full rounded-lg"
          >
            <option value="">-- Pilih Dosen --</option>
            {dosenList.map((d) => {
              const existingSKS = getDosenSKS(d.id);
              const mkSKS = selectedMatkul?.sks || 0;
              const total = existingSKS + mkSKS;
              const over = total > d.max_sks;
              return (
                <option key={d.id} value={d.id} disabled={over}>
                  {d.nama} ({d.bidang_keahlian}) — SKS: {existingSKS}/{d.max_sks}
                  {over ? " (LEBIH)" : ""}
                </option>
              );
            })}
          </select>
        </div>

        <input
          type="number"
          name="semester"
          placeholder="Semester"
          value={form.semester}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
          min={1}
          max={8}
        />

        <input
          type="text"
          name="tahun_ajaran"
          placeholder="Tahun Ajaran (cth: 2024/2025)"
          value={form.tahun_ajaran}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
        />

        <input
          type="number"
          name="kapasitas"
          placeholder="Kapasitas"
          value={form.kapasitas}
          onChange={handleChange}
          className="border p-2 w-full rounded-lg"
          min={1}
        />

        <div className="relative">
          <label className="text-xs text-slate-500 mb-1 block">
            Mahasiswa ({form.mahasiswa_ids.length} terpilih)
          </label>
          <div className="border rounded-lg max-h-32 overflow-y-auto p-2 space-y-1">
            {form.mahasiswa_ids.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada mahasiswa dipilih</p>
            ) : (
              form.mahasiswa_ids.map((mhsId) => {
                const mhs = mahasiswaList.find((m) => m.id == mhsId);
                if (!mhs) return null;
                return (
                  <span
                    key={mhsId}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                  >
                    {mhs.nim} - {mhs.nama}
                    <button
                      type="button"
                      className="ml-1 text-red-500 hover:text-red-700 font-bold"
                      onClick={() => toggleMahasiswa(mhsId)}
                    >
                      &times;
                    </button>
                  </span>
                );
              })
            )}
          </div>

          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={mahasiswaSearch}
              onChange={(e) => {
                setMahasiswaSearch(e.target.value);
                setShowMhsDropdown(true);
              }}
              onFocus={() => setShowMhsDropdown(true)}
              onBlur={() => setTimeout(() => setShowMhsDropdown(false), 200)}
              className="border p-2 w-full rounded-lg text-sm"
            />
            {showMhsDropdown && (
              <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto mt-1">
                {filteredMhs.length === 0 ? (
                  <p className="text-xs text-slate-400 p-2">Tidak ditemukan</p>
                ) : (
                  filteredMhs.map((mhs) => {
                    const sksUsed = getSimpleMhsSKS(mhs.id);
                    const isSelected = form.mahasiswa_ids.includes(mhs.id);
                    const mkSKS = selectedMatkul?.sks || 0;
                    const wouldExceed = (isSelected ? sksUsed - mkSKS : sksUsed) + mkSKS > mhs.max_sks;
                    return (
                      <label
                        key={mhs.id}
                        className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 ${
                          wouldExceed ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMahasiswa(mhs.id)}
                            disabled={wouldExceed && !isSelected}
                            className="rounded"
                          />
                          <span>{mhs.nim} - {mhs.nama}</span>
                        </div>
                        <span
                          className={`text-xs ${
                            wouldExceed && !isSelected
                              ? "text-red-500"
                              : "text-slate-400"
                          }`}
                        >
                          {sksUsed}/{mhs.max_sks} SKS
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            )}
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
