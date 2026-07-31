import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {

    const [count, setCount] = useState(0);

    return (
        <NotificationContext.Provider
            value={{
                count,
                setCount
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () =>
    useContext(NotificationContext);