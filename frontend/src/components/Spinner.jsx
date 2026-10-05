import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="size-10 rounded-full border-4 border-gray-600 border-t-green-600 animate-spin"></div>
    </div>
  );
};

export default Spinner;
