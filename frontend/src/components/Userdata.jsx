import React from "react";
import { motion } from "framer-motion";
const Userdata = ({ title, sub_title, mini_title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-800 border bg-opacity-50 rounded-lg border-gray-700 "
    >
      <h3 className="text-green-500 text-xl font-bold mb-4">{title}</h3>
      {title === "Profile Information" ? (
        <div className="text-gray-300 ">
          <p>{`Name : ${sub_title}`}</p>
          <p>{`Email : ${mini_title}`}</p>
        </div>
      ) : (
        <div className="text-gray-300 ">
          <p>{`Joined : ${sub_title}`}</p>
          <p>{`Last Login : ${mini_title ? mini_title : "You Just Signup!!"}`}</p>
        </div>
      )}
    </motion.div>
  );
};

export default Userdata;
