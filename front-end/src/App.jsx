import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import VerifyOTP from "./pages/OTPVerify";
import OTPVerify from "./pages/OTPVerify";

function AnimatedRoutes() {
  const location = useLocation();

  // Track if user has visited /home before (i.e. just came from Login)
  const [hasVisitedHome, setHasVisitedHome] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route
          path="/home"
          element={
            <Home
              firstVisit={!hasVisitedHome}
              onMount={() => setHasVisitedHome(true)}
            />
          }
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
