import { SOCKET_BASE_URL } from "@/apis/api";
import { io, Socket } from "socket.io-client";

export const createAiCopilotSocket = (token: string): Socket => {
  // Use the new SOCKET_BASE_URL to connect to the /chat namespace
  return io(`${SOCKET_BASE_URL}/chat`, {
    path: "/realtime",
    transports: ["websocket"],
    withCredentials: false,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    auth: { token },
    autoConnect: false,
    reconnectionAttempts: 8,
    reconnectionDelay: 800,
  });
};

export const generateClientMsgId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
