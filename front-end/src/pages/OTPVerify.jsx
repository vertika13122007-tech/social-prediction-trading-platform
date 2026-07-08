import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  LineChart,
  Rocket,
  DollarSign,
  RefreshCcw,
} from "lucide-react";
import OTPInput from "../components/OTPInput";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;
const DEMO_CODE = "123456"; // replace with real verification call

function maskEmail(email) {
  if (!email || !email.includes("@")) return "your email";
  const [name, domain] = email.split("@");
  if (name.length <= 2) return `${name[0]}****@${domain}`;
  return `${name.slice(0, 1)}****${name.slice(-1)}@${domain}`;
}

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const floatingIcons = [
  { Icon: TrendingUp, top: "12%", left: "8%", delay: 0, size: 28 },
  { Icon: LineChart, top: "22%", left: "88%", delay: 0.6, size: 32 },
  { Icon: Rocket, top: "78%", left: "10%", delay: 1.1, size: 26 },
  { Icon: DollarSign, top: "82%", left: "85%", delay: 0.3, size: 30 },
];

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "user@example.com";

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  const containerRef = useRef(null);

  // Countdown
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleVerify = useCallback(
    (code) => {
      const value = code ?? otp;
      if (value.length !== OTP_LENGTH || loading || verified) return;

      setLoading(true);
      setError("");

      // Simulated verification request
      setTimeout(() => {
        if (value === DEMO_CODE) {
          setLoading(false);
          setVerified(true);
          setTimeout(() => navigate("/home"), 1500);
        } else {
          setLoading(false);
          setError("Invalid OTP. Please try again.");
          setOtp("");
        }
      }, 1100);
    },
    [otp, loading, verified, navigate]
  );

  // Enter key submits
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter" && otp.length === OTP_LENGTH && !loading && !verified) {
        handleVerify(otp);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [otp, loading, verified, handleVerify]);

  const handleResend = () => {
    if (timer > 0 || resending) return;
    setResending(true);
    setError("");
    setTimeout(() => {
      setResending(false);
      setTimer(RESEND_SECONDS);
      setOtp("");
    }, 700);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#070b14] flex items-center justify-center px-4 py-10 transition-colors duration-300"
    >
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-blue-400/30 dark:bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-400/30 dark:bg-cyan-400/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-blue-300/30 dark:bg-blue-400/10 blur-3xl" />
      </div>

      {/* Floating trading icons */}
      {floatingIcons.map(({ Icon, top, left, delay, size }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-blue-500/20 dark:text-cyan-300/15"
          style={{ top, left }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [-10, 10, -10] }}
          transition={{
            opacity: { duration: 1, delay },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] rounded-3xl border border-white/40 dark:border-white/10
                   bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl
                   shadow-[0_8px_40px_rgba(15,23,42,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
                   px-7 py-9 sm:px-9 sm:py-10"
      >
        <AnimatePresence mode="wait">
          {verified ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center py-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex h-20 w-20 items-center justify-center rounded-full
                           bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-green-500/30 mb-5"
              >
                <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2.5} />
              </motion.div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Verified Successfully
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Redirecting...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-7">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full
                             bg-gradient-to-br from-blue-500 to-cyan-400
                             shadow-lg shadow-blue-500/30 mb-4"
                >
                  <ShieldCheck className="h-8 w-8 text-white" strokeWidth={2.2} />
                </motion.div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Verify OTP
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We&apos;ve sent a 6-digit verification code to
                  <br />
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {maskEmail(email)}
                  </span>
                </p>
              </div>

              {/* OTP Boxes */}
              <div className="mb-2">
                <OTPInput
                  length={OTP_LENGTH}
                  value={otp}
                  disabled={loading}
                  error={!!error}
                  onChange={(val) => {
                    setOtp(val);
                    if (error) setError("");
                  }}
                  onComplete={(val) => handleVerify(val)}
                />
              </div>

              {/* Error message */}
              <div className="h-6 mt-2 text-center" role="alert" aria-live="polite">
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Timer / Resend */}
              <div className="flex justify-center mb-6">
                {timer > 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Resend code in{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-cyan-400
                               hover:text-blue-700 dark:hover:text-cyan-300 transition-colors disabled:opacity-60"
                  >
                    {resending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" />
                    )}
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Primary button */}
              <motion.button
                type="button"
                whileHover={{ scale: otp.length === OTP_LENGTH && !loading ? 1.02 : 1 }}
                whileTap={{ scale: otp.length === OTP_LENGTH && !loading ? 0.98 : 1 }}
                disabled={otp.length !== OTP_LENGTH || loading}
                onClick={() => handleVerify(otp)}
                className="w-full flex items-center justify-center gap-2 rounded-xl
                           bg-gradient-to-r from-blue-600 to-cyan-500
                           py-3.5 text-sm font-semibold text-white
                           shadow-lg shadow-blue-500/25
                           transition-all duration-200
                           hover:shadow-xl hover:shadow-cyan-500/30
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </motion.button>

              {/* Secondary button */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl
                           border-2 border-slate-200 dark:border-slate-700
                           py-3 text-sm font-semibold text-slate-600 dark:text-slate-300
                           transition-all duration-200
                           hover:border-blue-400 hover:text-blue-600
                           dark:hover:border-cyan-400 dark:hover:text-cyan-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>

              {/* Security note */}
              <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
                Your verification code expires in 5 minutes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Shake animation for invalid OTP */}
      <style>{`
        @keyframes otp-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .otp-shake {
          animation: otp-shake 0.4s ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .otp-shake { animation: none; }
        }
      `}</style>
    </div>
  );
}