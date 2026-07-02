import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/molecules/Card";
import FormField from "../components/molecules/FormField";
import Button from "../components/atoms/Button";
import { userApi } from "../api/userApi";
import { toast, ToastContainer } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok!", {
        position: "top-right",
      });
      return;
    }

    if (formData.password.length < 3) {
      toast.error("Password minimal 3 karakter!", {
        position: "top-right",
      });
      return;
    }

    try {
      const users = await userApi.getAll();
      const emailExists = users.some((u) => u.email === formData.email);

      if (emailExists) {
        toast.error("Email sudah terdaftar!", {
          position: "top-right",
        });
        return;
      }

      const newUser = {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        role_id: "4",
      };

      await userApi.create(newUser);

      toast.success("Registrasi berhasil! Silakan login.", {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error("Registrasi gagal!", {
        position: "top-right",
      });
      console.error("Error registering:", error);
    }
  };

  return (
    <Card>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Buat Akun Baru
        </h1>
        <p className="text-slate-600">
          Daftar untuk memulai
        </p>
      </div>
      <form onSubmit={handleRegister}>
        <FormField
          label="Nama Lengkap"
          type="text"
          name="nama"
          placeholder="Masukkan nama lengkap"
          value={formData.nama}
          onChange={handleChange}
          required
        />

        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="Masukkan email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="Masukkan password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <FormField
          label="Konfirmasi Password"
          type="password"
          name="confirmPassword"
          placeholder="Masukkan ulang password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" className="w-full mb-6">
          Daftar
        </Button>

        <p className="text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            Login di sini
          </Link>
        </p>
      </form>

      <ToastContainer />
    </Card>
  );
}
