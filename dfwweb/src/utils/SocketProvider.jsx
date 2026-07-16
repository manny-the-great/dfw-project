import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { get_unread_notification_count } from "./thunkApis";
import { useDispatch, useSelector } from "react-redux";

const SocketContext = createContext();
const backend_url = import.meta.env.VITE_BASE_URL;

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.users.user);

  const [socket, setSocket] = useState(null);

  const user = JSON.parse(localStorage.getItem("userData")) || null;
  const userId = user?.id;

  // 🔥 SOCKET INITIALIZATION
  useEffect(() => {
    if (!userId) return;

    const socketConnection = io(backend_url, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketConnection);

    // When connected
    socketConnection.on("connect", () => {
      // console.log("🟢 Socket Connected:", socketConnection.id);
      socketConnection.emit("connect_user", { user_id: userId });
    });

    socketConnection.on("notification_count_refresh", () => {
      // console.log("🔔 Notification refresh event received");

      if (userDetails && userId) {
        dispatch(get_unread_notification_count());
      }
    });

    socketConnection.on("disconnect", () => {
      // console.log("🔴 Socket Disconnected");
    });

    return () => {
      socketConnection.disconnect();
      // console.log("⚪ Socket Closed");
    };
  }, [userId]);


  return (
    <SocketContext.Provider
      value={{
        socket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
