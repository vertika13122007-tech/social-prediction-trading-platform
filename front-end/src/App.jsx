import { useState, useEffect } from "react";
import { playClickSound } from "./utils/soundUtils";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Notifications from "./pages/Notifications";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import OTPVerify from "./pages/OTPVerify";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import AdminMarkets from "./pages/AdminMarkets";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminLeaderboard from "./pages/AdminLeaderboard";


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
        <Route path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
          />
        <Route path="/portfolio" 
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="markets"     element={<AdminMarkets />} />
          <Route path="users"       element={<AdminUsers />} />
          <Route path="leaderboard" element={<AdminLeaderboard />} />
          <Route path="analytics"   element={<AdminAnalytics />} />
          <Route path="settings"    element={<AdminSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function GlobalClickListener() {
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest("button, a, [role='button'], input[type='submit'], input[type='button'], .cursor-pointer");
      if (target) {
        playClickSound();
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <GlobalClickListener />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
