import React, { useEffect, useState } from "react";
import {api_url} from "../config.json";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [flaggedPhotos, setFlaggedPhotos] = useState([]);
  const [flaggedComments, setFlaggedComments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    fetchDataFrom("/admin/users", setUsers);
    fetchDataFrom("/admin/photos", setPhotos);
    fetchDataFrom("/admin/flagged/photos", setFlaggedPhotos);
    fetchDataFrom("/admin/flagged/comments", setFlaggedComments);
  }

  function fetchDataFrom(endpoint, setter) {
    fetch(`${api_url}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log(`${endpoint} response:`, data);
        setter(data);
      })
      .catch(err => console.error(err));
  }

  function toggleBlockUser(id) {
    fetch(`${api_url}/admin/users/${id}/block`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchDataFrom("/admin/users", setUsers));
  }

  function deletePhoto(id) {
    fetch(`${api_url}/admin/photos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      fetchDataFrom("/admin/photos", setPhotos);
      fetchDataFrom("/admin/flagged/photos", setFlaggedPhotos);
    });
  }

  function deleteComment(id) {
    fetch(`${api_url}/admin/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchDataFrom("/admin/flagged/comments", setFlaggedComments));
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Users */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        {users.map(user => (
          <div key={user.id} className="border p-2 my-1 flex justify-between items-center">
            <div>
              {user.username} ({user.email}) - {user.is_blocked ? "Blocked" : "Active"}
            </div>
            <button
              onClick={() => toggleBlockUser(user.id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              {user.is_blocked ? "Unblock" : "Block"}
            </button>
          </div>
        ))}
      </section>

      {/* All Photos */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Photos</h2>
        {photos.map(photo => (
          <div key={photo.id} className="border p-2 my-1">
            <p>Photo #{photo.id} by @{photo.username}</p>
            <p>{photo.caption}</p>
            <img
              src={`${api_url}${photo.image_url}`}
              alt="Uploaded"
              className="w-32 h-32 object-cover"
            />
            <button
              onClick={() => deletePhoto(photo.id)}
              className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      {/* Flagged Comments */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Flagged Comments</h2>
        {flaggedComments.map(comment => (
          <div key={comment.id} className="border p-2 my-1">
            <p>@{comment.username} on Photo #{comment.photo_id}</p>
            <p>{comment.content}</p>
            <p className="text-sm text-red-500">🚩 Reason: {comment.reason}</p>
            <button
              onClick={() => deleteComment(comment.id)}
              className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
            >
              Delete Comment
            </button>
          </div>
        ))}
      </section>

      {/* Flagged Photos */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Flagged Photos</h2>
        {flaggedPhotos.map(photo => (
          <div key={photo.id} className="border p-2 my-1">
            <p>Photo #{photo.id} by @{photo.username}</p>
            <p className="text-sm text-red-500">🚩 Reason: {photo.reason}</p>
            <img
              src={`${api_url}${photo.image_url}`}
              alt="Flagged"
              className="w-32 h-32 object-cover my-2"
            />
            <button
              onClick={() => deletePhoto(photo.id)}
              className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
            >
              Delete Photo
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;
