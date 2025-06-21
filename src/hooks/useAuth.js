import { useEffect, useState } from "react";

function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    fetch("http://127.0.0.1:5000/users/current_user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          bio: data.bio,
          is_admin: data.is_admin,     // <- include for admin routes
          created_at: data.created_at,
        });
      })
      .catch((err) => {
        console.error("Auth error:", err);
        setUser(null);
      });
  }, []);

  return user;
}

export default useAuth;
