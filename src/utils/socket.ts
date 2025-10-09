import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // your backend URL

export const joinUserRoom = (userId: string) => {
  socket.emit("joinUserRoom", userId);
};

export default socket;
