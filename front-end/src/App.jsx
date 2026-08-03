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
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";


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
            
              <Home
                firstVisit={!hasVisitedHome}
                onMount={() => setHasVisitedHome(true)}
              />
           
          }
        />
        <Route path="/leaderboard"
          element={
              
                <Leaderboard />
              
          }
        />
        <Route path="/notifications"
          element={
            
              <Notifications />
            
          } 
        />
        <Route path="/wallet"
          element={
           
              <Wallet />
            
          } 
        />
        <Route path="/settings" 
          element={
            
              <Settings />
            
          } 
        />
        <Route path="/profile" 
          element={
          
              <Profile />

          } 
          />
        <Route path="/portfolio" 
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="markets"   element={<AdminDashboard />} />
      <Route path="users"     element={<AdminDashboard />} />
      <Route path="wallet"    element={<AdminDashboard />} />
      <Route path="analytics" element={<AdminDashboard />} />
      <Route path="settings"  element={<AdminDashboard />} />
      </Route>

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
