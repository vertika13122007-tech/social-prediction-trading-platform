import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import OTPVerify from "./pages/OTPVerify";

function AnimatedRoutes() {
  const location = useLocation();

  // Track if user has visited /home before (i.e. just came from Login)
  const [hasVisitedHome, setHasVisitedHome] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } 
        />
        <Route path="/signup" 
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          } 
        />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home
                firstVisit={!hasVisitedHome}
                onMount={() => setHasVisitedHome(true)}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/leaderboard"
          element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
          }
        />
        <Route path="/notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />
        <Route path="/wallet" 
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } 
        />
        <Route path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
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
