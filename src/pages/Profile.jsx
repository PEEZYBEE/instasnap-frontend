import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";
import { Link } from "react-router-dom";
import {api_url} from "../config.json";

function Profile() {
  const { user } = useAuthContext();
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome back, {user.username}!
        </h1>
        <p className="text-lg text-white/80">
          Here's your InstaSnap profile summary.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl space-y-6 text-center">
        <img
          src={`${api_url}${user.profile_picture}`}
          alt="Profile"
          className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
        />
        <h2 className="text-2xl font-bold text-white mt-4">{user.username}</h2>

        <div className="text-white/90 space-y-2 mt-4">
          <p>
            <span className="font-semibold text-white">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold text-white">Bio:</span>{" "}
            {user.bio || "No bio provided"}
          </p>
          <p>
            <span className="font-semibold text-white">Joined:</span>{" "}
            {user.created_at
              ? new Date(user.created_at).toDateString()
              : "Date unavailable"}
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/upload"
            className="bg-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition duration-300"
          >
            Upload Photo
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {showModal && <EditProfileModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default Profile;
