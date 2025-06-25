import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {api_url} from "../config.json"; 

function EditProfileModal({ onClose }) {
  const { user, setUser } = useAuthContext();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();
    body.append("username", formData.username);
    body.append("email", formData.email);
    body.append("bio", formData.bio);
    if (profilePic) {
      body.append("profile_picture", profilePic);
    }

    try {
      const res = await fetch(`${api_url}/users/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      // Update user context
      setUser((prev) => ({
        ...prev,
        ...data
      }));

      toast.success("Profile updated!");
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className="w-full max-w-lg p-8 rounded-2xl shadow-2xl relative animate-scale-in border border-white/20 bg-cover bg-center backdrop-blur-md"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="bg-white/10 backdrop-blur-lg w-full max-w-lg p-8 rounded-2xl shadow-2xl relative border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-00 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-1000">
          Edit Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block mb-1 font-medium text-left text-gray-00">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-00 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-left text-gray-00">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-00 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-left text-white-00">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-00 rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-left text-gray-00">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
