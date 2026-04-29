import { NavLink } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { CiUser } from "react-icons/ci";

const navClass = ({ isActive }) =>
  `inline-flex items-center gap-2 ${isActive ? "text-cyan-300 font-semibold" : ""}`;

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-800 text-white p-6">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/admin/dashboard"
            className={navClass}
          >
            <MdSpaceDashboard />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/mahasiswa" className={navClass}>
            <PiStudent />
            Mahasiswa
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/user" className={navClass}>
            <CiUser />
            User
          </NavLink>
        </li>
        <li className="text-red-400 bottom-5 absolute">
          <NavLink to="/" onClick={() => localStorage.removeItem("isLogin")}>
            Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
