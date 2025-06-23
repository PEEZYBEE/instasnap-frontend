import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";

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
    fetch(`http://127.0.0.1:5000/comments/photo/${photo.id}`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error("Failed to fetch comments", err));
  }, [photo.id]);

  const handleLike = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/likes/", {
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
      const res = await fetch("http://127.0.0.1:5000/comments/", {
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

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-md ${randomColor} text-black transition hover:scale-105 duration-300`}
    >
      <img
        src={`http://127.0.0.1:5000${photo.image_url}`}
        alt={photo.caption}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 bg-white/30 backdrop-blur-md rounded-b-lg">
        <p className="font-semibold mb-2 text-gray-800">{photo.caption}</p>

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
            <div key={c.id} className="flex items-start gap-2">
              <img
                src={c.profile_picture}
                alt={c.username}
                className="w-6 h-6 rounded-full object-cover"
              />
              <p>
                <strong>@{c.username}:</strong> {c.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoCard;
