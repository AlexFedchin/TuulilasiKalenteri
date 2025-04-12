import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [isTokenExpired, setIsTokenExpired] = useState(() => {
    return localStorage.getItem("isTokenExpired") || false;
  });

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    setIsTokenExpired(false);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwt);
    localStorage.setItem("isTokenExpired", false);
  };

  const logout = () => {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(null);
    setToken(null);
    setIsTokenExpired(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isTokenExpired");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedToken && storedUser) {
      fetch("/api/auth/verify-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token invalid or expired");
          return res.json();
        })
        .then((data) => {
          setUser(data.user);
          setToken(data.token);
          setIsTokenExpired(false);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          localStorage.setItem("isTokenExpired", false);
        })
        .catch(() => {
          // Clear if invalid/expired
          setUser(null);
          setToken(null);
          setIsTokenExpired(true);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.setItem("isTokenExpired", true);
        });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, isTokenExpired, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
