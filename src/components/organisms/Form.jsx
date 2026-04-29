import { useNavigate } from "react-router-dom";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import users from "../../data/user.json";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Form() {
   const navigate = useNavigate();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleLogin = (e) => {
      e.preventDefault();

      const user = users.find(
         (u) => u.email === email && u.password === password,
      );

      if (user) {
         localStorage.setItem("isLogin", "true");

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

            <div className="flex justify-between text-sm mb-4">
               <label className="flex gap-2">
                  <input type="checkbox" /> Ingat saya
               </label>
               <span className="text-blue-600 cursor-pointer">
                  Lupa password?
               </span>
            </div>

            <Button type="submit" className="w-full">
               Login
            </Button>
         </form>

         <ToastContainer />
      </>
   );
}
