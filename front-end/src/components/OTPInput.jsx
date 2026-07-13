// import { useRef, useEffect } from "react";
// import { motion } from "framer-motion";

// export default function OTPInput({ otp, setOtp, hasError, disabled }) {
//   const inputRefs = useRef([]);
//   const OTP_LENGTH = 6;

//   useEffect(() => {
//     inputRefs.current[0]?.focus();
//   }, []);

//   const handleChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return;
//     const updated = [...otp];
//     updated[index] = value;
//     setOtp(updated);
//     if (value && index < OTP_LENGTH - 1) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace") {
//       if (otp[index]) {
//         const updated = [...otp];
//         updated[index] = "";
//         setOtp(updated);
//       } else if (index > 0) {
//         inputRefs.current[index - 1]?.focus();
//       }
//     }
//     if (e.key === "ArrowLeft"  && index > 0)             inputRefs.current[index - 1]?.focus();
//     if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
//     if (!pasted) return;
//     const updated = Array(OTP_LENGTH).fill("");
//     pasted.split("").forEach((ch, i) => { updated[i] = ch; });
//     setOtp(updated);
//     inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
//   };

//   return (
//     <div className="flex justify-center gap-2.5 sm:gap-3" role="group" aria-label="OTP input">
//       {otp.map((digit, i) => (
//         <motion.div
//           key={i}
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1,  y: 0  }}
//           transition={{ delay: 0.15 + i * 0.07, duration: 0.35, ease: "easeOut" }}
//           whileTap={!disabled ? { scale: 0.93 } : {}}
//           className="relative"
//         >
//           {/* Filled gradient border glow */}
//           {digit && !hasError && (
//             <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-500 opacity-30 blur-sm pointer-events-none" />
//           )}

//           <input
//             ref={(el) => (inputRefs.current[i] = el)}
//             id={`otp-${i}`}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             disabled={disabled}
//             aria-label={`OTP digit ${i + 1}`}
//             onChange={(e) => handleChange(i, e.target.value)}
//             onKeyDown={(e) => handleKeyDown(i, e)}
//             onPaste={i === 0 ? handlePaste : undefined}
//             className={`
//               relative z-10
//               w-11 h-12 sm:w-12 sm:h-[56px] md:w-[58px] md:h-[62px]
//               text-center text-xl sm:text-2xl font-bold rounded-xl border-2
//               outline-none transition-all duration-200 select-none
//               disabled:opacity-40 disabled:cursor-not-allowed
//               ${hasError
//                 ? "border-red-400 bg-red-50/80 dark:bg-red-900/20 text-red-500 dark:text-red-400 shadow-sm shadow-red-200/50 dark:shadow-red-900/20 animate-[shake_0.4s_ease]"
//                 : digit
//                   ? "border-blue-400 dark:border-blue-500 bg-gradient-to-b from-blue-50 to-cyan-50/50 dark:from-blue-900/30 dark:to-cyan-900/10 text-blue-700 dark:text-blue-300 shadow-md shadow-blue-200/60 dark:shadow-blue-900/40 scale-[1.04]"
//                   : "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 text-gray-800 dark:text-white focus:border-cyan-400 dark:focus:border-cyan-500 focus:bg-blue-50/60 dark:focus:bg-blue-900/20 focus:scale-[1.06] focus:shadow-[0_0_0_3px_rgba(6,182,212,0.18)] dark:focus:shadow-[0_0_0_3px_rgba(6,182,212,0.12)]"
//               }
//             `}
//           />
//         </motion.div>
//       ))}
//     </div>
//   );
// }



import { useRef, useEffect } from "react";

/**
 * OTPInput
 * Renders `length` individual boxes that behave like a single OTP field.
 *
 * Props:
 *  - length      : number of digits (default 6)
 *  - value       : current string value, e.g. "123"
 *  - onChange    : (nextValue: string) => void
 *  - error       : boolean - shows red border + shake animation
 *  - disabled    : boolean - disables all boxes (e.g. while verifying)
 *  - onComplete  : (value: string) => void - fires once all boxes are filled
 */
export default function OTPInput({
  length = 6,
  value = "",
  onChange,
  error = false,
  disabled = false,
  onComplete,
}) {
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const commit = (next) => {
    onChange(next);
    if (next.length === length && !next.includes("")) {
      onComplete?.(next);
    }
  };

  const updateAt = (index, digit) => {
    const arr = Array.from({ length }, (_, i) => value[i] || "");
    arr[index] = digit;
    commit(arr.join(""));
  };

  const handleChange = (e, index) => {
    const digit = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    updateAt(index, digit || "");
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        updateAt(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        updateAt(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
    if (!pasted) return;
    const arr = Array.from({ length }, (_, i) => pasted[i] || "");
    commit(arr.join(""));
    const focusIndex = Math.min(pasted.length, length - 1);
    requestAnimationFrame(() => inputsRef.current[focusIndex]?.focus());
  };

  return (
    <div
      className="flex justify-center gap-2.5 sm:gap-3.5"
      role="group"
      aria-label={`One-time passcode, ${length} digits`}
    >
      {Array.from({ length }).map((_, i) => {
        const filled = Boolean(value[i]);
        const stateClasses = error
          ? "border-red-500 text-red-500 dark:text-red-400 otp-shake"
          : filled
          ? "border-blue-300 dark:border-blue-500/40 bg-blue-50/80 dark:bg-blue-500/10"
          : "border-slate-200 dark:border-slate-700";

        return (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            id={`otp-box-${i}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={value[i] || ""}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={error}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={(e) => handlePaste(e, i)}
            className={[
              "h-14 w-12 sm:h-16 sm:w-14",
              "rounded-xl border-2 text-center text-xl sm:text-2xl font-bold",
              "bg-white dark:bg-slate-800/60",
              "text-slate-900 dark:text-white",
              "outline-none transition-all duration-300 ease-out",
              "focus:scale-105 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20",
              "focus:shadow-[0_0_20px_rgba(37,99,235,0.35)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              stateClasses,
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}