import { useEffect, useState } from "react";
import {api_url} from "../config.json";

function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    fetch(`${api_url}/users/current_user`, {
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
          is_admin: data.is_admin,    
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
