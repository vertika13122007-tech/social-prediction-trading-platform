import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { getLiveUpdates } from "../api/liveUpdateApi";

const LiveUpdatesContext = createContext();

export function LiveUpdatesProvider({ children }) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {

    async function loadUpdates() {
      try {
        const history = await getLiveUpdates();
        setUpdates(history);
      } catch (error) {
        console.error("Failed to load live updates:", error);
      }
    }
    loadUpdates();
  }, []);

  useEffect(() => {
    socket.on("liveUpdate", (update) => {
        setUpdates((prev) => [update, ...prev].slice(0, 20));
    });

    return () => {
      socket.off("liveUpdate");
    };
  }, []);

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LiveUpdatesContext.Provider value={{ updates }}>
      {children}
    </LiveUpdatesContext.Provider>
  );
}

export const useLiveUpdates = () => useContext(LiveUpdatesContext);