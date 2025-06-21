// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((r) => {
        if (!r.ok) throw new Error("Invalid credentials");
        return r.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.access_token);
        toast.success("Login successful!");
        navigate("/profile");
      })
      .catch((err) => {
        toast.error(err.message || "Login failed");
      });
  }

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-lg p-12 max-w-xl w-full text-white">

        <h2 className="text-3xl font-bold mb-6 text-center">Login to InstaSnap</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded-md font-semibold text-white transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-pink-300 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
