import { motion } from "framer-motion";
import Userdata from "../components/Userdata";
import { useAuthStore } from "../store/authStore";
import formateDate from "../utils/formateDate.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signout } = useAuthStore();
  const lastLogin = formateDate(user?.lastLogin);
  const joinedAt = new Date(user?.createdAt).toLocaleString("en-Us", {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signout();
      toast.success("Logut successfully!!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logut failed!!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-md p-4 w-full rounded-xl border border-gray-800 bg-gray-900 opacity-80 backdrop-blur-2xl backdrop-filter shadow-2xl"
    >
      <h1 className="text-3xl font-bold text-center mb-6 mt-2 bg-linear-to-r from-green-400 to-emerald-600  text-transparent bg-clip-text">
        Dashboard
      </h1>
      <div className="space-y-4">
        <Userdata
          title={"Profile Information"}
          sub_title={user?.username}
          mini_title={user?.email}
        />
        <Userdata
          title={"Account Activity"}
          sub_title={joinedAt}
          mini_title={lastLogin}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/update-profile")}
          className="w-full rounded bg-linear-to-r from-green-400 to-emerald-600 mt-4 font-bold p-2 text-white cursor-pointer"
        >
          Update Profile
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleLogout}
          className="w-full rounded bg-linear-to-r from-green-400 to-emerald-600 mt-4 font-bold p-2 text-white cursor-pointer"
        >
          Signout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
