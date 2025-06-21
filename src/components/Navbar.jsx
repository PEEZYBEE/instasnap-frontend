import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="hover:underline">Profile</Link>
            {user.is_admin && (
              <Link to="/admin" className="hover:underline">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="border border-white px-3 py-1 rounded hover:bg-white hover:text-gray-800"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
