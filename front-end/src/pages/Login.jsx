import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckCircle,
  Mail,
  Lock,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    alert("Login Successful!");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-teal-600 flex items-center justify-center p-3 md:p-5">

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0,x:-80}}
        transition={{ duration: 0.45 }}
        className="w-full max-w-7xl min-h-[94vh] flex items-center justify-between gap-12"
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
              Sign in to continue trading
            </p>

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

                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-blue-600"
                >
                  Forgot Password?
                </button>

              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:scale-[1.02] transition"
              >
                Sign In
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
    </div>
  );
}