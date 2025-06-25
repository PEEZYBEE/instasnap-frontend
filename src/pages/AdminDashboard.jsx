import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized or token expired");
        return r.json();
      })
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, []);

  function toggleBlock(userId) {
    fetch(`http://127.0.0.1:5000/admin/users/${userId}/block`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to toggle block status");
        return r.json();
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, is_blocked: !user.is_blocked }
              : user
          )
        );
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white/30 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
          🛠️ Admin Dashboard
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-white/20 text-gray-700">
              <tr>
                <th className="border p-3">Username</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Role</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="even:bg-white/10 hover:bg-white/20 transition">
                  <td className="border p-2 text-center">{user.username}</td>
                  <td className="border p-2 text-center">{user.email}</td>
                  <td className="border p-2 text-center">{user.is_admin ? "Admin" : "User"}</td>
                  <td className="border p-2 text-center">
                    {user.is_blocked ? (
                      <span className="text-red-600 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => toggleBlock(user.id)}
                      className={`px-4 py-1 rounded-full font-semibold text-sm ${
                        user.is_blocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white transition`}
                    >
                      {user.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
