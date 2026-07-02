import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { CiUser } from "react-icons/ci";
import { FaChalkboardTeacher, FaUserShield, FaSchool } from "react-icons/fa";
import { HiBookOpen } from "react-icons/hi";
import { getUserRole } from "../../utils/permissions";

const navClass = ({ isActive }) =>
   `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
         ? "bg-blue-600 text-white"
         : "text-slate-300 hover:bg-slate-700 hover:text-white"
   }`;

export default function Sidebar() {
   const [permissions, setPermissions] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchUserPermissions();
   }, []);

   const fetchUserPermissions = async () => {
      try {
         const role = await getUserRole();
         setPermissions(role?.permissions || []);
      } catch (error) {
         console.error("Error fetching permissions:", error);
      } finally {
         setLoading(false);
      }
   };

   const hasPermission = (permission) => {
      return permissions.includes(permission);
   };

   const hasAnyPermission = (permissionList) => {
      return permissionList.some((p) => permissions.includes(p));
   };

   if (loading) {
      return (
         <div
            className="w-72 relative overflow-hidden"
            style={{
               background:
                  "linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%)",
            }}
         >
            <div className="p-8">
               <p className="text-center text-gray-400">Loading...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="w-64 bg-slate-800 text-white shadow-xl">
         <div className="p-6">
            <div className="mb-8">
               <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
               <p className="text-sm text-slate-400">Control Panel</p>
            </div>

            <ul className="space-y-1">
               <li>
                  <NavLink to="/admin/dashboard" className={navClass}>
                     <MdSpaceDashboard className="text-lg" />
                     <span>Dashboard</span>
                  </NavLink>
               </li>

               {hasAnyPermission(["mahasiswa.manage", "mahasiswa.read"]) && (
                  <li>
                     <NavLink to="/admin/mahasiswa" className={navClass}>
                        <PiStudent className="text-lg" />
                        <span>Mahasiswa</span>
                     </NavLink>
                  </li>
               )}

               {hasPermission("dosen.manage") && (
                  <li>
                     <NavLink to="/admin/dosen" className={navClass}>
                        <FaChalkboardTeacher className="text-lg" />
                        <span>Dosen</span>
                     </NavLink>
                  </li>
               )}

               {hasAnyPermission(["matkul.manage", "matkul.read"]) && (
                  <li>
                     <NavLink to="/admin/matkul" className={navClass}>
                        <HiBookOpen className="text-lg" />
                        <span>Mata Kuliah</span>
                     </NavLink>
                  </li>
               )}

               {hasPermission("dosen.manage") && (
                  <li>
                     <NavLink to="/admin/kelas" className={navClass}>
                        <FaSchool className="text-lg" />
                        <span>Kelas</span>
                     </NavLink>
                  </li>
               )}

               {hasPermission("user.read") && (
                  <li>
                     <NavLink to="/admin/user" className={navClass}>
                        <CiUser className="text-lg" />
                        <span>User</span>
                     </NavLink>
                  </li>
               )}

               {hasPermission("role.read") && (
                  <li>
                     <NavLink to="/admin/role" className={navClass}>
                        <FaUserShield className="text-lg" />
                        <span>Roles</span>
                     </NavLink>
                  </li>
               )}
            </ul>

            <div className="absolute bottom-6 left-6 right-6 ">
               <div className="w-56 border-t border-slate-700 pt-4">
                  <NavLink
                     to="/"
                     onClick={() => localStorage.removeItem("isLogin")}
                     className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                     <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                     </svg>
                     <span>Logout</span>
                  </NavLink>
               </div>
            </div>
         </div>
      </div>
   );
}
