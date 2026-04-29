import { FaRegEdit, FaEye } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function MahasiswaTable({
   mahasiswa,
   openEditModal,
   onDelete,
   onView,
}) {
   const handleDelete = (nim) => {
      onDelete(nim);
   };

   return (
      <>
         <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-gray-100">
                  <tr>
                     <th className="p-3">No</th>
                     <th className="p-3">NIM</th>
                     <th className="p-3">Nama</th>
                     <th className="p-3">Email</th>
                     <th className="p-3">IPK</th>
                     <th className="p-3">Semester</th>
                     <th className="p-3">No. Telp</th>
                     <th className="p-3">Status</th>
                     <th className="p-3 text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody>
                  {mahasiswa.length > 0 ? (
                     mahasiswa.map((item, index) => (
                        <tr
                           key={item.nim}
                           className="border-t hover:bg-gray-50"
                        >
                           <td className="p-3">{index + 1}</td>
                           <td className="p-3">{item.nim}</td>
                           <td className="p-3">{item.nama}</td>
                           <td className="p-3">{item.email}</td>
                           <td className="p-3">{item.ipk}</td>
                           <td className="p-3">{item.semester}</td>
                           <td className="p-3">{item.no_telp}</td>
                           <td className="p-3">
                              {item.status ? "Aktif" : "Nonaktif"}
                           </td>
                           <td className="p-3 text-center space-x-2">
                              <button
                                 className="inline-flex items-center justify-center bg-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-500 w-10 h-10"
                                 onClick={() => onView(item.id)}
                              >
                                 <FaEye />
                              </button>
                              <button
                                 type="button"
                                 className="inline-flex items-center justify-center bg-yellow-400 px-3 py-1 rounded text-sm hover:bg-yellow-500 w-10 h-10"
                                 onClick={() => openEditModal(item)}
                              >
                                 <FaRegEdit />
                              </button>
                              <button
                                 type="button"
                                 className="inline-flex items-center justify-center bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 w-10 h-10"
                                 onClick={() => handleDelete(item.nim)}
                              >
                                 <MdDeleteOutline />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td
                           colSpan="9"
                           className="p-4 text-center text-gray-500"
                        >
                           Tidak ada data mahasiswa.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </>
   );
}
