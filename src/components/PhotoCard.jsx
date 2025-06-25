import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import {api_url} from "../config.json";

function PhotoCard({ photo }) {
  const { user } = useAuthContext();
  const [likeCount, setLikeCount] = useState(photo.like_count || 0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const token = localStorage.getItem("token");

  const bgColors = [
    "bg-rose-100",
    "bg-teal-100",
    "bg-indigo-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
  ];
  const randomColor = bgColors[photo.id % bgColors.length];

  useEffect(() => {
    fetch(`${api_url}/comments/photo/${photo.id}`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error("Failed to fetch comments", err));
  }, [photo.id]);

  const handleLike = async () => {
    try {
      const res = await fetch(`${api_url}/likes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photo_id: photo.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.like_count);
      } else {
        const errData = await res.json();
        console.warn("Like failed:", errData.error);
      }
    } catch (err) {
      console.error("Error liking photo:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`${api_url}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          photo_id: photo.id,
          content: commentText,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCommentText("");
      } else {
        console.warn("Comment failed");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const flagPhoto = async () => {
    const reason = prompt("Why are you flagging this photo?");
    if (!reason) return;

    try {
      const res = await fetch(`${api_url}/flags/photo/${photo.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        alert("Photo flagged for review.");
      } else {
        console.warn("Flagging photo failed");
      }
    } catch (err) {
      console.error("Error flagging photo:", err);
    }
  };

  const flagComment = async (commentId) => {
    const reason = prompt("Why are you flagging this comment?");
    if (!reason) return;

    try {
      const res = await fetch(`${api_url}/flags/comment/${commentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        alert("Comment flagged.");
      } else {
        console.warn("Flagging comment failed");
      }
    } catch (err) {
      console.error("Error flagging comment:", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this photo?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${api_url}/photos/${photo.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Photo deleted.");
        window.location.reload(); 
      } else {
        const error = await res.json();
        console.warn("Delete failed:", error.error);
      }
    } catch (err) {
      console.error("Error deleting photo:", err);
    }
  };

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-md ${randomColor} text-black transition hover:scale-105 duration-300`}
    >
      <img
        src={`${api_url}${photo.image_url}`}
        alt={photo.caption}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 bg-white/30 backdrop-blur-md rounded-b-lg">
        <div className="flex justify-between items-center">
          <p className="font-semibold mb-2 text-gray-800">{photo.caption}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={flagPhoto}
              className="text-xs text-red-500 hover:text-red-700"
            >
               Flag
            </button>
            {user && photo.user && user.id === photo.user.id && (
              <button
                onClick={handleDelete}
                className="text-xs text-red-600 hover:text-red-800"
            >
                Delete
            </button>
         )}

          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleLike}
            className="text-red-500 hover:text-red-600 transition text-xl"
          >
            ❤️ {likeCount}
          </button>
        </div>

        <form onSubmit={handleCommentSubmit} className="mb-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full px-3 py-1 border rounded focus:outline-none text-sm bg-white/50 backdrop-blur-sm"
          />
        </form>

        <div className="space-y-1 text-sm text-gray-800 max-h-32 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2 justify-between">
              <div className="flex items-start gap-2">
                <img
                  src={`${api_url}${c.profile_picture}`}
                  alt={c.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <p>
                  <strong>@{c.username}:</strong> {c.content}
                </p>
              </div>
              <button
                onClick={() => flagComment(c.id)}
                className="text-xs text-red-400 hover:text-red-600 ml-2"
              >
                flag
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoCard;
