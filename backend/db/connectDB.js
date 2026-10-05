import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB CONNECTED!!", conn.connection.host);
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED!!", error.message);

    process.exit(1);
  }
};

export { connectDB };
