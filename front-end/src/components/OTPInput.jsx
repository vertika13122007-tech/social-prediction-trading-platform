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