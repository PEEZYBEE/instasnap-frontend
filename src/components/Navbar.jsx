import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import {api_url} from "../config.json";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getProfilePicture = () => {
    return user?.profile_picture
      ? `${api_url}${user.profile_picture}`
      : "/default-avatar.png";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="text-xl font-bold text-purple-800 hidden sm:inline ">
            InstaSnap
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 text-gray-800 text-sm font-medium">
          <Link to="/" className="hover:text-purple-700 transition">Home</Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-purple-700 transition">Login</Link>
              <Link to="/register" className="hover:text-purple-700 transition">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-purple-700 transition">Profile</Link>
              {user.is_admin && (
                <Link to="/admin" className="hover:text-purple-700 transition">Admin</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700 transition"
              >
                Logout
              </button>
              <img
                src={getProfilePicture()}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
                alt="Avatar"
                className="h-9 w-9 rounded-full object-cover border-2 border-white"
              />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 hover:text-purple-700"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-3 bg-white/90 rounded-xl p-4 text-gray-800 text-sm font-medium shadow-lg">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-purple-700">Home</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block hover:text-purple-700">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block hover:text-purple-700">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block hover:text-purple-700">Profile</Link>
              {user.is_admin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block hover:text-purple-700">Admin</Link>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block text-left w-full hover:text-purple-700"
              >
                Logout
              </button>
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={getProfilePicture()}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-white"
                />
                <span>@{user.username}</span>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
