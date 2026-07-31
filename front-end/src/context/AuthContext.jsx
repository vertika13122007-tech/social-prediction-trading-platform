import { createContext, useContext, useState } from "react";
import { socket } from "../socket/socket";
import { useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const login = (token, user) => {

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(token);
        setUser(user);

        socket.connect();

    };

    const logout = () => {

        socket.disconnect();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    useEffect(() => {

        if (!user) return;

        const handleConnect = () => {
            console.log("✅ Connected:", socket.id);
            socket.emit("join", user._id);
            console.log("✅ Join emitted");
        };

        console.log(user._id);

        socket.on("connect", handleConnect);

        if (socket.connected) {
            socket.emit("join", user._id || user.id);
        }

        return () => {
            socket.off("connect", handleConnect);
        };

    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                setUser,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}