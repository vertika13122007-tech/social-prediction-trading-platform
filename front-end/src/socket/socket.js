import { io } from "socket.io-client";

export const socket = io("https://predictx-social-prediction-trading.onrender.com", {
    withCredentials: true,
});