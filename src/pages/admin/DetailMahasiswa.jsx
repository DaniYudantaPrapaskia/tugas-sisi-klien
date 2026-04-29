import { useParams, Link } from "react-router-dom";
import Header from "../../components/organisms/Header";
import { data } from "../../data/data";
import MaleImage from "../../assets/images/Male.jpg";
import FemaleImage from "../../assets/images/Female.jpg";

export default function DetailMahasiswa() {
   const { id } = useParams();
   const mahasiswa = data.find((item) => String(item.id) === id);

   return (
      <>
         <Header title="Detail Mahasiswa" />

         <div className="bg-white p-6 rounded shadow max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Detail Mahasiswa</h2>

            {mahasiswa ? (
               <div className="flex gap-24">
                  {/* KIRI */}
                  <div className="space-y-2">
                     <p>
                        <span className="font-medium">Nama:</span>{" "}
                        {mahasiswa.nama}
                     </p>
                     <p>
                        <span className="font-medium">Email:</span>{" "}
                        {mahasiswa.email}
                     </p>
                     <p>
                        <span className="font-medium">NIM:</span>{" "}
                        {mahasiswa.nim}
                     </p>
                     <p>
                        <span className="font-medium">IPK:</span>{" "}
                        {mahasiswa.ipk}
                     </p>
                     <p>
                        <span className="font-medium">Semester:</span>{" "}
                        {mahasiswa.semester}
                     </p>
                     <p>
                        <span className="font-medium">No Telp:</span>{" "}
                        {mahasiswa.no_telp}
                     </p>
                  </div>

                  {/* KANAN */}
                  <div className="w-36">
                     <img
                        src={
                           mahasiswa.gender === "Male" ? MaleImage : FemaleImage
                        }
                        alt={mahasiswa.nama}
                        className="w-full h-full object-cover rounded-lg shadow"
                     />
                  </div>
               </div>
            ) : (
               <p>Data mahasiswa tidak ditemukan.</p>
            )}

            <Link
               to="/admin/mahasiswa"
               className="inline-block mt-4 px-3 py-1 text-sm border rounded"
            >
               Kembali ke daftar
            </Link>
         </div>
      </>
   );
}
