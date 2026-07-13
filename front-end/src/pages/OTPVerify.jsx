// import { useState, useEffect, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ShieldCheck, ArrowLeft, RefreshCw,
//   CheckCircle, AlertCircle, Clock, Lock,
//   Sparkles
// } from "lucide-react";
// import OTPInput from "../components/OTPInput";

// const DEMO_OTP    = "123456";
// const OTP_LENGTH  = 6;
// const RESEND_SECS = 45;
// const EXPIRE_MINS = 5;

// function maskEmail(email = "") {
//   const [local, domain] = email.split("@");
//   if (!domain || local.length <= 2) return email;
//   return `${local[0]}${"*".repeat(Math.max(local.length - 2, 3))}${local[local.length - 1]}@${domain}`;
// }

// const FLOATERS = [
//   { emoji: "📈", style: { top: "10%",  left: "6%"  }, delay: 0    },
//   { emoji: "💹", style: { top: "72%",  left: "4%"  }, delay: 0.7  },
//   { emoji: "🚀", style: { top: "18%",  right: "5%" }, delay: 1.3  },
//   { emoji: "💰", style: { top: "76%",  right: "5%" }, delay: 0.4  },
//   { emoji: "📊", style: { top: "44%",  left: "2%"  }, delay: 1.0  },
//   { emoji: "💎", style: { top: "48%",  right: "3%" }, delay: 1.7  },
// ];

// export default function OTPVerify() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email    = location.state?.email || "user@example.com";

//   const [otp,       setOtp]       = useState(Array(OTP_LENGTH).fill(""));
//   const [timer,     setTimer]     = useState(RESEND_SECS);
//   const [canResend, setCanResend] = useState(false);
//   const [loading,   setLoading]   = useState(false);
//   const [hasError,  setHasError]  = useState(false);
//   const [errorMsg,  setErrorMsg]  = useState("");
//   const [verified,  setVerified]  = useState(false);
//   const [resending, setResending] = useState(false);

//   // Countdown
//   useEffect(() => {
//     if (timer <= 0) { setCanResend(true); return; }
//     const t = setTimeout(() => setTimer((s) => s - 1), 1000);
//     return () => clearTimeout(t);
//   }, [timer]);

//   // Auto-submit
//   useEffect(() => {
//     if (otp.every((d) => d !== "") && !loading && !verified) {
//       handleVerify(otp.join(""));
//     }
//   }, [otp]);

//   // Enter key
//   useEffect(() => {
//     const handler = (e) => {
//       if (e.key === "Enter" && otp.every((d) => d !== "") && !loading && !verified) {
//         handleVerify(otp.join(""));
//       }
//     };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [otp, loading, verified]);

//   const handleVerify = useCallback((code) => {
//     if (loading || verified) return;
//     setLoading(true);
//     setHasError(false);
//     setErrorMsg("");
//     setTimeout(() => {
//       if (code === DEMO_OTP) {
//         setVerified(true);
//         setTimeout(() => navigate("/home"), 1800);
//       } else {
//         setHasError(true);
//         setErrorMsg("Invalid OTP. Please try again.");
//         setOtp(Array(OTP_LENGTH).fill(""));
//         setTimeout(() => setHasError(false), 700);
//       }
//       setLoading(false);
//     }, 1000);
//   }, [loading, verified, navigate]);

//   const handleResend = () => {
//     if (!canResend || resending) return;
//     setResending(true);
//     setOtp(Array(OTP_LENGTH).fill(""));
//     setHasError(false);
//     setErrorMsg("");
//     setTimeout(() => {
//       setResending(false);
//       setCanResend(false);
//       setTimer(RESEND_SECS);
//     }, 1000);
//   };

//   const allFilled = otp.every((d) => d !== "");
//   const pad = (n) => String(n).padStart(2, "0");

//   return (
//     <div className="min-h-screen relative flex items-center justify-center px-4 py-10 overflow-hidden
//       bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/30
//       dark:from-gray-950 dark:via-blue-950/30 dark:to-slate-950">

//       {/* ── Blurred blobs ── */}
//       <div className="absolute top-[-80px] left-[-80px] w-[380px] h-[380px] bg-blue-300/20 dark:bg-blue-800/15 rounded-full blur-[100px] pointer-events-none" />
//       <div className="absolute bottom-[-60px] right-[-60px] w-[340px] h-[340px] bg-cyan-300/20 dark:bg-cyan-800/10 rounded-full blur-[100px] pointer-events-none" />
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-200/10 dark:bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

//       {/* ── Floating icons ── */}
//       {FLOATERS.map((f, i) => (
//         <motion.div
//           key={i}
//           className="absolute text-2xl opacity-[0.065] dark:opacity-[0.04] pointer-events-none select-none"
//           style={f.style}
//           animate={{ y: [0, -12, 0] }}
//           transition={{ duration: 3.6 + i * 0.35, repeat: Infinity, delay: f.delay, ease: "easeInOut" }}
//         >
//           {f.emoji}
//         </motion.div>
//       ))}

//       {/* ── Card ── */}
//       <motion.div
//         initial={{ opacity: 0, y: 32, scale: 0.96 }}
//         animate={{ opacity: 1, y: 0,  scale: 1    }}
//         transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
//         whileHover={{ y: -3, boxShadow: "0 32px 64px rgba(59,130,246,0.13)" }}
//         className="relative w-full max-w-[460px] z-10 transition-shadow duration-300"
//       >
//         {/* Outer glow ring */}
//         <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-br from-blue-400/20 via-cyan-400/10 to-teal-400/20 dark:from-blue-600/15 dark:via-cyan-600/10 dark:to-teal-600/15 blur-sm pointer-events-none" />

//         <div className="relative bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl rounded-3xl border border-white/70 dark:border-gray-700/50 shadow-2xl shadow-blue-100/50 dark:shadow-blue-950/40 overflow-hidden">

//           {/* Top gradient bar */}
//           <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500" />

//           <div className="px-8 sm:px-10 py-10 sm:py-12">
//             <AnimatePresence mode="wait">

//               {/* ══ SUCCESS ══ */}
//               {verified ? (
//                 <motion.div
//                   key="success"
//                   initial={{ opacity: 0, scale: 0.88 }}
//                   animate={{ opacity: 1, scale: 1    }}
//                   transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
//                   className="flex flex-col items-center text-center gap-5 py-4"
//                 >
//                   <motion.div
//                     initial={{ scale: 0, rotate: -20 }}
//                     animate={{ scale: 1, rotate: 0   }}
//                     transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.1 }}
//                     className="relative"
//                   >
//                     <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-green-500 flex items-center justify-center shadow-2xl shadow-emerald-200/60 dark:shadow-emerald-900/40">
//                       <CheckCircle size={50} className="text-white" strokeWidth={1.8} />
//                     </div>
//                     <motion.div
//                       initial={{ scale: 1, opacity: 0.6 }}
//                       animate={{ scale: 2.2, opacity: 0 }}
//                       transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
//                       className="absolute inset-0 rounded-full bg-emerald-400/30"
//                     />
//                   </motion.div>

//                   <motion.div
//                     initial={{ opacity: 0, y: 12 }}
//                     animate={{ opacity: 1, y: 0  }}
//                     transition={{ delay: 0.35 }}
//                     className="space-y-2"
//                   >
//                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verified Successfully!</h2>
//                     <p className="text-gray-400 dark:text-gray-500 text-sm">Redirecting to your dashboard…</p>
//                     <div className="pt-3 flex justify-center">
//                       <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
//                     </div>
//                   </motion.div>
//                 </motion.div>

//               ) : (

//               /* ══ VERIFY ══ */
//               <motion.div key="verify" className="space-y-8">

//                 {/* Icon + Heading */}
//                 <div className="flex flex-col items-center text-center gap-5">
//                   <motion.div
//                     initial={{ scale: 0.7, opacity: 0 }}
//                     animate={{ scale: 1,   opacity: 1 }}
//                     transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
//                     className="relative"
//                   >
//                     {/* Outer glow pulse */}
//                     <motion.div
//                       animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.1, 0.3] }}
//                       transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
//                       className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 blur-md"
//                     />
//                     <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 flex items-center justify-center shadow-xl shadow-blue-300/40 dark:shadow-blue-900/50">
//                       <ShieldCheck size={36} className="text-white" strokeWidth={1.8} />
//                     </div>
//                   </motion.div>

//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0  }}
//                     transition={{ delay: 0.2, duration: 0.35 }}
//                     className="space-y-2"
//                   >
//                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
//                       Verify Your Identity
//                     </h1>
//                     <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
//                       We sent a 6-digit code to
//                     </p>
//                     <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/25 border border-blue-100 dark:border-blue-800/40">
//                       <Sparkles size={12} className="text-blue-500" />
//                       <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
//                         {maskEmail(email)}
//                       </span>
//                     </div>
//                   </motion.div>
//                 </div>

//                 {/* OTP inputs */}
//                 <div className="space-y-3">
//                   <OTPInput
//                     otp={otp}
//                     setOtp={setOtp}
//                     hasError={hasError}
//                     disabled={loading || verified}
//                   />

//                   {/* Error card */}
//                   <AnimatePresence>
//                     {errorMsg && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -8, scale: 0.97 }}
//                         animate={{ opacity: 1, y: 0,  scale: 1    }}
//                         exit={{    opacity: 0, y: -8, scale: 0.97 }}
//                         transition={{ duration: 0.25 }}
//                         className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/40 shadow-sm shadow-red-100/50"
//                       >
//                         <AlertCircle size={15} className="text-red-500 shrink-0" />
//                         <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errorMsg}</p>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Timer / Resend */}
//                 <div className="flex items-center justify-center">
//                   {canResend ? (
//                     <button
//                       onClick={handleResend}
//                       disabled={resending}
//                       className="group flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200 hover:scale-[1.03] disabled:opacity-60"
//                     >
//                       <RefreshCw size={14} className={`transition-transform duration-300 ${resending ? "animate-spin" : "group-hover:rotate-180"}`} />
//                       {resending ? "Sending new code…" : "Resend Code"}
//                     </button>
//                   ) : (
//                     <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
//                       <Clock size={13} className="text-blue-400" />
//                       <span className="text-gray-500 dark:text-gray-400 text-sm">Resend in</span>
//                       <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums tracking-wider text-sm">
//                         00:{pad(timer)}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Verify button */}
//                 <motion.button
//                   onClick={() => handleVerify(otp.join(""))}
//                   disabled={!allFilled || loading}
//                   whileHover={allFilled && !loading ? { scale: 1.02 } : {}}
//                   whileTap={allFilled && !loading ? { scale: 0.97 } : {}}
//                   transition={{ duration: 0.15 }}
//                   className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide text-white
//                     bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500
//                     hover:from-blue-700 hover:via-cyan-600 hover:to-teal-600
//                     shadow-lg shadow-blue-200/60 dark:shadow-blue-900/40
//                     hover:shadow-xl hover:shadow-blue-300/40 dark:hover:shadow-blue-900/50
//                     disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
//                     transition-all duration-200
//                     flex items-center justify-center gap-2.5"
//                 >
//                   {loading ? (
//                     <>
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//                         className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
//                       />
//                       Verifying…
//                     </>
//                   ) : (
//                     <>
//                       <ShieldCheck size={16} />
//                       Verify OTP
//                     </>
//                   )}
//                 </motion.button>

//                 {/* Back to login */}
//                 <motion.button
//                   onClick={() => navigate("/")}
//                   whileHover={{ scale: 1.01 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="w-full py-3 rounded-2xl font-semibold text-sm
//                     border-2 border-gray-200 dark:border-gray-700
//                     text-gray-600 dark:text-gray-400
//                     hover:border-blue-300 dark:hover:border-blue-600
//                     hover:text-blue-600 dark:hover:text-blue-400
//                     hover:bg-blue-50/50 dark:hover:bg-blue-900/10
//                     transition-all duration-200
//                     flex items-center justify-center gap-2"
//                 >
//                   <ArrowLeft size={15} />
//                   Back to Login
//                 </motion.button>

//                 {/* Demo hint + security note */}
//                 <div className="space-y-3 pt-1">
//                   <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
//                     Demo OTP:{" "}
//                     <span className="font-bold text-blue-500 dark:text-blue-400 tracking-[0.25em]">
//                       123456
//                     </span>
//                   </p>
//                   <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
//                     <Lock size={10} className="shrink-0" />
//                     Your verification code expires in {EXPIRE_MINS} minutes.
//                   </div>
//                 </div>

//               </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Card bottom glow */}
//         <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3/5 h-8 bg-blue-400/20 dark:bg-blue-700/15 blur-2xl rounded-full pointer-events-none" />
//       </motion.div>

//     </div>
//   );
// }






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
                 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600
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