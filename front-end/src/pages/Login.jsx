import { useState, useEffect } from "react";
import { Link , useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { login, forgotPassword, resetPassword } from "../api/authApi";
import {
  TrendingUp,
  CheckCircle,
  Mail,
  Lock,
  X,
  KeyRound,
  Send,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "otp" | "success"
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // Pre-fill email if Remember me was checked previously
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRemember = localStorage.getItem("rememberMe") === "true";
    if (savedEmail && savedRemember) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await login(formData);

      // Persist / clear remembered email
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }

      authLogin(
        response.token,
        response.user
      );

      navigate("/home");
    } catch (err) {
      console.error(err);
      setErrors({
        server: err.response?.data?.message || "Invalid email or password"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email address");
      return;
    }
    setForgotLoading(true);
    setForgotError("");

    try {
      await forgotPassword(forgotEmail);
      setForgotStep("otp");
    } catch (err) {
      console.error(err);
      setForgotError(err.response?.data?.message || "Failed to send reset email. Please check the email address.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetOtp.trim() || !newPassword.trim()) {
      setForgotError("OTP and new password are required");
      return;
    }
    setForgotLoading(true);
    setForgotError("");

    try {
      await resetPassword({ email: forgotEmail, otp: resetOtp, newPassword });
      setForgotStep("success");
    } catch (err) {
      console.error(err);
      setForgotError(err.response?.data?.message || "Failed to reset password. Please check your OTP.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-teal-600 flex items-center justify-center p-3 md:p-5 relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0,x:-80}}
        transition={{ duration: 0.45 }}
        className="w-full max-w-7xl min-h-[94vh] flex items-center justify-between gap-12 relative z-10"
      >

        {/* LEFT CONTENT */}
        <div className="hidden md:flex flex-col justify-center text-white max-w-xl px-8">

          <div className="flex items-center gap-4 mb-10">
            <div className="bg-white/10 border border-white/20 p-3 rounded-2xl backdrop-blur-md shadow-lg">
              <TrendingUp size={30} />
            </div>

            <h1 className="text-4xl font-bold">
              Live Market
            </h1>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Trade on Predictions,
            <br />
            Win Big
          </h2>

          <p className="text-blue-100 text-lg mb-10">
            Join the most exciting prediction market platform
            where your insights can turn into rewards.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Real-Time Trading Markets</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Instant Reward Distribution</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Advanced Analytics Dashboard</span>
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white flex items-center justify-center p-6 md:p-10 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] w-full max-w-[520px] ml-auto">

          <div className="w-full">

            {/* MOBILE HEADER */}
            <div className="md:hidden bg-gradient-to-r from-blue-700 to-teal-600 text-white rounded-2xl p-5 mb-6 text-center">
              <h2 className="text-2xl font-bold">
                Live Market
              </h2>

              <p className="text-sm mt-2">
                Trade on Predictions, Win Big
              </p>
            </div>

            <h2 className="text-4xl font-bold mb-2">
              Welcome Back
            </h2>

            <p className="text-gray-500 mb-8">
              Log in to continue trading
            </p>

            {errors.server && (
              <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                {errors.server}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail
                    size={18}
                    className="text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 outline-none"
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <Lock
                    size={18}
                    className="text-gray-400"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-4 outline-none"
                  />
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">

                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer accent-blue-600"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotStep("email");
                    setForgotEmail(formData.email);
                    setResetOtp("");
                    setNewPassword("");
                    setForgotError("");
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
                >
                  Forgot Password?
                </button>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:scale-[1.02] transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in…
                  </span>
                ) : (
                  "Log In"
                )}
              </button>

            </form>

            <p className="text-center mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-semibold"
              >
                Create Account
              </Link>
            </p>

          </div>
        </div>

      </motion.div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-gray-100 overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                  <KeyRound size={24} />
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* STEP 1: REQUEST EMAIL */}
              {forgotStep === "email" && (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Forgot Password?
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Enter your registered email address and we'll send a 6-digit OTP verification code to reset your password.
                  </p>

                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    {forgotError && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
                        {forgotError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                        <Mail size={18} className="text-gray-400 shrink-0" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full p-3.5 outline-none text-sm text-gray-800"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(false)}
                        className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {forgotLoading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send size={15} /> Send Code
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* STEP 2: VERIFY OTP & NEW PASSWORD */}
              {forgotStep === "otp" && (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Reset Your Password
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Enter the 6-digit verification code sent to <span className="font-semibold text-gray-800">{forgotEmail}</span> and choose a new password.
                  </p>

                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    {forgotError && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">
                        {forgotError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        6-Digit OTP Code
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                        <ShieldCheck size={18} className="text-gray-400 shrink-0" />
                        <input
                          type="text"
                          maxLength={6}
                          value={resetOtp}
                          onChange={(e) => setResetOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="w-full p-3.5 outline-none text-sm text-gray-800 font-mono tracking-widest text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                        <Lock size={18} className="text-gray-400 shrink-0" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full p-3.5 outline-none text-sm text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setForgotStep("email")}
                        className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {forgotLoading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* STEP 3: SUCCESS */}
              {forgotStep === "success" && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle size={36} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Password Reset Successfully!</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Your password has been updated. You can now log in with your new password.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-sm hover:scale-[1.02] transition shadow-md"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}