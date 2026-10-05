import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import { app } from "./app.js";
dotenv.config();

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(
      PORT,
      console.log(`Server is running at http://localhost:${PORT}/api/v1/auth`),
    );
  })
  .catch((error) => {
    console.log("MONGODB CONNECTION FAILED!!", error.message);

    process.exit(1);
  });
