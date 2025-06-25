import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext'; 

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from "./components/Navbar";
import Profile from './pages/Profile';
import UploadPhoto from "./pages/UploadPhoto";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user,loading } = useContext(AuthContext); 
   

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<UploadPhoto />} />
        <Route
          path="/admin"
          element={
            loading ? (
              <div className="text-center mt-8 text-gray-600">Loading user info...</div>
            ) : user && user.is_admin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
     }
   />

      </Routes>
    </div>
  );
}

export default App;
