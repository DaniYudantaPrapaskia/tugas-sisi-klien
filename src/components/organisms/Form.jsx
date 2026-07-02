import { useNavigate, Link } from "react-router-dom";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { userApi } from "../../api/userApi";

export default function Form() {
   const navigate = useNavigate();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleLogin = async (e) => {
      e.preventDefault();

      try {
         const user = await userApi.login(email, password);

         if (user) {
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("user", JSON.stringify(user));

            toast.success("Login berhasil!", {
               position: "top-right",
               autoClose: 1500,
            });

            setTimeout(() => {
               navigate("/admin/dashboard");
            }, 1500);
         } else {
            toast.error("Email atau password salah!", {
               position: "top-right",
            });
         }
      } catch (error) {
         toast.error("Login gagal!", {
            position: "top-right",
         });
         console.error("Error login:", error);
      }
   };

   return (
      <>
         <form onSubmit={handleLogin}>
            <FormField
               label="Email"
               type="email"
               placeholder="Masukkan email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />

            <FormField
               label="Password"
               type="password"
               placeholder="Masukkan password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between items-center text-sm mb-6">
               <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600" /> 
                  <span className="text-slate-600">Ingat saya</span>
               </label>
               <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                  Lupa password?
               </span>
            </div>

            <Button type="submit" className="w-full mb-6">
               Login
            </Button>

            <p className="text-center text-sm text-slate-600">
               Belum punya akun?{" "}
               <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Daftar di sini
               </Link>
            </p>
         </form>

         <ToastContainer />
      </>
   );
}
