import React, { createContext, useEffect, useState } from "react";
import api from "../Api/Axios";
import { io } from "socket.io-client";

export interface IUser {
  _id?: string;
  name: string;
  username: string;
  password: string;
  about: string;
  avatar: string;
}

interface IAuthContext {
  user: IUser | null;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  restoreuser: () => void;
  socket: any;
  onlineusers: string[];
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setuser] = useState<IUser | null>(null);
  const [loading, setloading] = useState<boolean>(true);
  const [onlineusers, setonlineusers] = useState<string[]>([]);
  const [socket, setsocket] = useState<any>(null);

  // 🔔 Ask notification permission ONCE
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    restoreuser();
  }, []);

  // 🔥 Disconnect socket when tab closes
  useEffect(() => {
    if (!socket) return;

    const handleUnload = () => socket.disconnect();
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [socket]);

  const login = async (data: any) => {
    try {
      setloading(true);
      const res = await api.post("/api/user/signin", data);
      localStorage.setItem("accessToken", res.data.accessToken);
      setuser(res.data.user);
      connectSocket(res.data.user);
      setloading(false);
    } catch (error: any) {
      setloading(false);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const restoreuser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setloading(false);
        return;
      }

      setloading(true);
      const res = await api.get("/api/user/getme", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setuser(res.data);
      connectSocket(res.data);
      setloading(false);
    } catch {
      setloading(false);
      setuser(null);
    }
  };

  const logout = async () => {
    setloading(true);
    localStorage.removeItem("accessToken");
    socket?.disconnect();
    setsocket(null);
    setuser(null);
    setloading(false);
  };

  const connectSocket = (userdata: IUser) => {
    if (!userdata || socket?.connected) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_SERVER, {
      query: { userId: userdata._id },
      transports: ["websocket"],
    });

    setsocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setonlineusers(userIds);
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, restoreuser, socket, onlineusers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
