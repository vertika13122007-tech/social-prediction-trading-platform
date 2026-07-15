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
  Sparkles,
  Lock,
} from "lucide-react";
import OTPInput from "../components/OTPInput";
import { verifyOtp } from "../api/authApi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

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

const sparkles = [
  { top: "6%", left: "22%", delay: 0.2, size: 14 },
  { top: "18%", left: "78%", delay: 0.9, size: 10 },
  { top: "88%", left: "20%", delay: 0.5, size: 12 },
  { top: "70%", left: "82%", delay: 1.3, size: 16 },
];

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {

    if(!email){
      navigate("/signup");
    }

  }, [email,navigate]);
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
    async (code) => {
      const value = code ?? otp;
      
      if( value.length !== OTP_LENGTH || loading || verified )
        return;

      setLoading(true);
      setError("");

      try{

        await verifyOtp({
          email,
          otp: value,
        });

        setLoading(false);

        setVerified(true);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }catch (error) {

        setLoading(false);

        setError(
          error.response?.data?.message ||
          "Verification failed"
        );

        setOtp("");
      }

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
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-10
                 bg-gradient-to-br from-blue-600 to-teal-700
                 bg-[length:200%_200%] animate-gradient-slow transition-colors duration-300"
    >
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
      </div>

      {/* Floating trading icons */}
      {floatingIcons.map(({ Icon, top, left, delay, size }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute text-white/15"
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

      {/* Tiny sparkle icons around the card */}
      {sparkles.map(({ top, left, delay, size }, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="pointer-events-none absolute text-white/40"
          style={{ top, left }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Sparkles size={size} />
        </motion.div>
      ))}

      {/* Soft glow halo behind the card */}
      <div className="absolute z-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-cyan-300/30 to-blue-400/30 blur-3xl" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] rounded-3xl border border-white/60
                   bg-white/95 backdrop-blur-xl
                   shadow-2xl shadow-blue-900/20
                   transition-shadow duration-300
                   hover:shadow-[0_30px_80px_rgba(15,23,42,0.35)]
                   px-7 py-9 sm:px-9 sm:py-10"
      >
        {/* Floating verification badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: [0, -4, 0] }}
          transition={{ opacity: { duration: 0.5 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5
                     rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-blue-700
                     shadow-md border border-blue-100"
        >
          <Lock className="h-3 w-3" />
          Secured Verification
        </motion.div>

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
                Account verified!
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Redirecting to Login...
              </p>
              <p className="text-sm text-gray-400 mt-2">
                  Please wait while we redirect you...
              </p>
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
              >
                  <Loader2
                      className="mx-auto mt-6 animate-spin text-blue-600"
                      size={28}
                  />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-7 mt-2">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full
                             bg-gradient-to-br from-blue-500 to-teal-500
                             shadow-lg shadow-blue-500/30 mb-4
                             ring-4 ring-blue-100"
                >
                  <ShieldCheck className="h-8 w-8 text-white" strokeWidth={2.2} />
                </motion.div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Verify Your Account
                </h1>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  We&apos;ve sent a secure verification code to
                  <br />
                  <span className="font-medium text-slate-700">
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
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    Resend code in
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 tabular-nums">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="group flex items-center gap-1.5 text-sm font-semibold text-blue-600
                               cursor-pointer transition-colors hover:text-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {resending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" />
                    )}
                    <span className="relative">
                      Resend OTP
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                    </span>
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
                className="relative w-full flex items-center justify-center gap-2 rounded-xl overflow-hidden
                           bg-gradient-to-r from-blue-600 to-teal-500
                           py-3.5 text-sm font-semibold text-white
                           shadow-lg shadow-blue-500/25
                           transition-all duration-300
                           hover:shadow-xl hover:shadow-teal-500/30
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                           before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r
                           before:from-transparent before:via-white/25 before:to-transparent
                           hover:before:translate-x-full before:transition-transform before:duration-700"
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
                onClick={() => navigate("/")}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl
                           border-2 border-slate-200
                           py-3 text-sm font-semibold text-slate-600
                           transition-all duration-300
                           hover:border-blue-400 hover:text-blue-600 hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>

              {/* Security note */}
              <p className="mt-6 text-center text-xs text-slate-400">
                Your verification code expires in 5 minutes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Shake animation for invalid OTP + slow gradient background movement */}
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
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-slow {
          animation: gradient-slow 18s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .otp-shake { animation: none; }
          .animate-gradient-slow { animation: none; }
        }
      `}</style>
    </div>
  );
}