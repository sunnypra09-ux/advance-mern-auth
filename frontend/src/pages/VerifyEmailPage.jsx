import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const VerifyEmailPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email Verified Successfully!!");
      navigate("/sign-in");
    } catch (error) {
      toast.error(error.response?.data?.message || "Email verification failed");
    }
  };

  const handelkeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handelChange = (value, index) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  return (
    <div className="max-w-md w-full rounded-2xl backdrop-blur-xl backdrop-filter-xl shadow-2xl bg-gray-900 bg-opacity-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-2xl text-center font-bold bg-linear-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
          Verify Email
        </h1>

        <p className="text-gray-400 text-md text-center my-2 font-semibold font-md">
          Enter the 6-digits code send to your email address.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3 my-5">
            {code.map((digit, idx) => (
              <input
                type="text"
                key={idx}
                maxLength={6}
                value={digit}
                ref={(el) => (inputRefs.current[idx] = el)}
                onKeyDown={(e) => handelkeyDown(e, idx)}
                onChange={(e) => handelChange(e.target.value, idx)}
                className="size-10 text-xl text-center font-bold bg-gray-700 text-white border-2 outline-0 border-gray-large-xl rounded focus:border-green-500 "
              />
            ))}
          </div>

          {error && (
            <span className="text-red-500 text-xs font-semibold">{error}</span>
          )}

          <button
            className="flex items-center justify-center cursor-pointer w-full py-2 text-white font-bold bg-linear-to-r from-green-600 to-emerald-700 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-2-gray-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Verify Email"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
