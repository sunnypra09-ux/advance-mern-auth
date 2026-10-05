import { motion } from "framer-motion";
import Input from "../components/Input";
import { useState } from "react";
import { Mail, MoveLeft, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Reset your Password!!");
    } catch (error) {
      toast.error(error.response?.error?.message || "Failed Forgot Password!!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full rounded-xl bg-gray-800 bg-opacity-50 overflow-hidden"
    >
      <div className="p-4 flex flex-col gap-4">
        <h2 className="text-2xl text-center font-bold text-transparent bg-linear-to-r from-green-400 to-emerald-600 bg-clip-text">
          Forgot Password
        </h2>
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center">
            <Mail className="text-white p-3 my-2 bg-green-400 size-15 rounded-full" />
            <p className="text-gray-400 text-center mb-2">{`If an account exists for ${email}, you will recive a password reset link shortly.`}</p>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-gray-300 font-semibold text-center">
              Enter Your Email address and we'll send you a link to reset your
              password.
            </p>
            <form onSubmit={handleSubmit}>
              <Input
                icon={Mail}
                placeholder="Email Address"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <motion.button
                className="flex items-center justify-center cursor-pointer w-full py-2 text-white  font-bold bg-linear-to-r from-green-600 to-emerald-700 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-2-gray-900"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
              >
                {isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          </div>
        )}
      </div>
      <Link
        to="/sign-in"
        className="flex items-center justify-center bg-gray-900 text-green-500 hover:underline py-2 mt-2"
      >
        <MoveLeft />
        Back to signin
      </Link>
    </motion.div>
  );
};

export default ForgotPasswordPage;
