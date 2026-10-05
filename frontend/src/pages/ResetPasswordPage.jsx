import { useState } from "react";
import { Lock , Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { isLoading, resetPassword } = useAuthStore();
  const { token } = useParams();
  const [newPassword, setNewpassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(token, newPassword);
      toast.success("Password Reset successfuly!!");
      navigate("/sign-in");
    } catch (error) {
      toast.error(error.response?.error?.message || "Password Reset Failed!!");
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
        <div>
          <p className="mb-4 text-gray-300 font-semibold text-center">
            Enter Your Email address and we'll send you a link to reset your
            password.
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              placeholder="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewpassword(e.target.value)}
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
                "Set New Password"
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
