import { motion } from "framer-motion";
import { Lock, Mail, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { error, isLoading, signin } = useAuthStore();

  const handelSignIn = async (e) => {
    e.preventDefault();

    try {
      await signin(email, password);
      toast.success("signin Successfully!!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "signin failed!!");
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{ delay: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filture backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-6">
        <h1 className="text-2xl text-center font-bold mb-6 bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome Back
        </h1>

        <form onSubmit={handelSignIn}>
          <Input
            icon={Mail}
            placeholder="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <span className="font-semibold text-xs text-red-500">{error}</span>
          )}

          <div className="flex items-center mb-5">
            <Link to="/forgot-password" className="text-green-500">
              Forgot Password?
            </Link>
          </div>

          <motion.button
            className="flex items-center justify-center cursor-pointer w-full py-2 text-white font-bold bg-linear-to-r from-green-600 to-emerald-700 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-2-gray-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Sign In"}
          </motion.button>
        </form>
      </div>

      <div className="flex items-center justify-center py-2 bg-gray-900 text-gray-400">
        <span className="text-md">Don't have an account?</span>
        <Link className="text-green-500 hover:underline" to="/sign-up">
          Sign Up
        </Link>
      </div>
    </motion.div>
  );
};

export default SignInPage;
