import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {api_url} from "../config.json";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${api_url}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((r) => {
        if (!r.ok) return r.json().then(data => { throw new Error(data.error || "Registration failed") });
        return r.json();
      })
      .then(() => {
        toast.success("Account created! Please log in.");
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err.message || "Registration failed");
      });
  }

  return (
    <div className="min-h-screen bg-[url('/1.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-lg p-8 max-w-md w-full text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white focus:ring-2 focus:ring-pink-500"
              placeholder="Your username"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white focus:ring-2 focus:ring-pink-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white focus:ring-2 focus:ring-pink-500"
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
            Register
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-pink-300 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
