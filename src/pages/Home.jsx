import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PhotoCard from "../components/PhotoCard";
import {api_url} from "../config.json";

function Home() {
  const user = useAuth();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch(`${api_url}/photos`)
      .then((r) => r.json())
      .then((data) => setPhotos(data))
      .catch((err) => console.error("Failed to fetch photos:", err));
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-start p-6 text-white"
      style={{ backgroundImage: "url('/login-bg.jpg')" }} 
    >
      <div className="text-center mb-12 animate-fade-in-down">
        {user ? (
          <>
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
              Welcome back, {user.username}!
            </h1>
            <p className="text-lg">
              Explore what’s trending and connect with the community.
            </p>
            <Link
              to="/profile"
              className="mt-6 inline-block px-6 py-3 bg-white text-purple-700 rounded-full shadow-lg font-semibold hover:bg-purple-100 transition duration-300"
            >
              Go to Your Profile
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
              Welcome to InstaSnap 
            </h1>
            <p className="text-lg mb-6">
              Capture moments. Share stories. Explore the world.
            </p>
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
  
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          🔥 Trending Posts
        </h2>
        {photos.length === 0 ? (
          <p className="text-center text-white/70">
            No trending posts available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}  
export default Home;