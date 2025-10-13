import { io } from "socket.io-client";
import { backendUrl } from "../common/api/baseApi";

const socket = io(backendUrl.replace('/api','')); // your backend URL

export const joinUserRoom = (userId: string) => {
  socket.emit("joinUserRoom", userId);
};

export default socket;
