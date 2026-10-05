import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, User, Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const { updateProfile, error, isLoading } = useAuthStore();

  const handelUpdateUserprofile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(username, email);
      toast.success("profile update successfully!!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "profile update error!!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filture backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden p-4"
    >
      <h1 className="text-2xl text-center font-bold mb-6 bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
        Update Profile
      </h1>

      <form onSubmit={handelUpdateUserprofile}>
        <Input
          icon={User}
          placeholder="User Name"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          icon={Mail}
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="text-red-500 font-semibold text-xs mt-2">{error}</p>
        )}

        <motion.button
          className="flex items-center justify-center cursor-pointer w-full py-2 text-white  font-bold bg-linear-to-r from-green-600 to-emerald-700 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-2-gray-900"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : "Save"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UpdateProfile;
