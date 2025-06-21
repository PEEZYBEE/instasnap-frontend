import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Home() {
  const user = useAuth();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/photos") // or /trending/photos if you have that
      .then((r) => r.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error("Failed to fetch photos:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-12 animate-fade-in-down">
        {user ? (
          <>
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome back, {user.username}! 🎉</h1>
            <p className="text-lg">Explore what’s trending and connect with the community.</p>
            <Link
              to="/profile"
              className="mt-6 inline-block px-6 py-3 bg-white text-purple-700 rounded-full shadow-lg font-semibold hover:bg-purple-100 transition duration-300"
            >
              Go to Your Profile
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to InstaSnap 📸</h1>
            <p className="text-lg mb-6">Capture moments. Share stories. Explore the world.</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-full shadow-md hover:bg-purple-100 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-700 transition duration-300"
              >
                Register
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Trending Photos Section */}
      <div className="bg-white text-gray-800 rounded-xl shadow-xl p-6 w-full max-w-5xl animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 text-center">🔥 Trending Posts</h2>
        {photos.length === 0 ? (
          <p className="text-center text-gray-500">No trending posts available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="rounded-lg overflow-hidden shadow-md hover:scale-105 transition duration-300"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center font-semibold">{photo.caption}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
