import { motion } from "framer-motion";
import { Lock, Mail, User, Loader } from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../components/Input";
import PasswordStraingthMeter from "../components/PasswordStraingthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  const handelSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, username);
      toast.success("signup successfully!!");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.response?.data?.message || "signup failed!!");
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
          Create Account
        </h1>

        <form onSubmit={handelSignUp}>
          <Input
            icon={User}
            placeholder="User Name"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
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
            <p className="text-red-500 font-semibold text-xs mt-2">{error}</p>
          )}
          <PasswordStraingthMeter password={password} />

          <motion.button
            className="flex items-center justify-center cursor-pointer w-full py-2 text-white  font-bold bg-linear-to-r from-green-600 to-emerald-700 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-2-gray-900"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Sign Up"}
          </motion.button>
        </form>
      </div>

      <div className="flex items-center justify-center py-2 bg-gray-900 text-gray-400">
        <span className="text-md">Already have an account?</span>
        <Link className="text-green-500 hover:underline" to="/sign-in">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
