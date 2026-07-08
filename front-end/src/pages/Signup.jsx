import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle,
  User,
  Mail,
  Lock,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const avatars = [
    "👩",
    "👨",
    "🧑",
    "👩‍💼",
    "👨‍💼",
    "👩‍💻",
    "👨‍💻",
    "👩‍🎓",
    "👨‍🎓",
    "🧑‍🚀",
  ];

  const [selectedAvatar, setSelectedAvatar] = useState("👩");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
        await register({
            name: formData.username,
            email: formData.email,
            password: formData.password,
        });

        navigate("/verify-otp", {
            state: {
                email: formData.email,
            },
        });

    } catch (error) {
        console.error(error);

        alert(
            error.response?.data?.message ||
            "Registration failed"
        );
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-teal-600 flex items-center justify-center p-3 md:p-5">

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0,x: -80}}
        transition={{ duration: 0.45 }}
        className="w-full max-w-7xl min-h-[94vh] flex items-center justify-between"
      >

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center text-white max-w-xl p-10">

          <div className="flex items-center gap-4 mb-10">
            <div className="bg-white/10 border border-white/20 p-3 rounded-2xl backdrop-blur-md shadow-lg">
              <TrendingUp size={30} />
            </div>

            <h1 className="text-4xl font-bold">
              Live Market
            </h1>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Start Your <br />
            Trading Journey
          </h2>

          <p className="text-blue-100 text-lg mb-10">
            Join thousands of traders making smart
            predictions and earning rewards through
            real-time market insights.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Secure Trading Platform</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Real-Time Market Updates</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>AI Powered Predictions</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white flex items-center justify-center p-6 md:p-10 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] w-full max-w-[520px] ml-auto">

          <div className="w-full max-w-md">

            {/* MOBILE HEADER */}
            <div className="md:hidden bg-gradient-to-r from-blue-700 to-teal-600 text-white rounded-2xl p-5 mb-6 text-center">
              <h2 className="text-2xl font-bold">
                Live Market
              </h2>

              <p className="text-sm mt-2">
                Start Your Trading Journey
              </p>
            </div>

            <h2 className="text-4xl font-bold mb-2">
              Create Account
            </h2>

            <p className="text-gray-500 mb-6">
              Join the future of prediction trading
            </p>

            {/* AVATAR SECTION */}
            <div className="mb-6">
              <label className="font-medium">
                Choose Avatar
              </label>

              <div className="grid grid-cols-5 gap-3 mt-3">

                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() =>
                      setSelectedAvatar(avatar)
                    }
                    className={`h-14 w-14 rounded-full text-2xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                      selectedAvatar === avatar
                        ? "border-blue-600 bg-blue-50 scale-105"
                        : "border-gray-200"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <User
                    size={18}
                    className="text-gray-400"
                  />

                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-4 outline-none"
                  />
                </div>

                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username}
                  </p>
                )}
              </div>

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

              <div>
                <div className="flex items-center border border-gray-300 rounded-xl px-4 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <Lock
                    size={18}
                    className="text-gray-400"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-4 outline-none"
                  />
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
              >
                Create Account
              </button>

            </form>

            <p className="text-center mt-6">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-blue-600 font-semibold"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  );
}