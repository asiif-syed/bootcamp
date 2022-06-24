import express from "express";
import dotenv from "dotenv";
import bootcampsRouter from "./routes/bootcamps";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errors";

// To use .env file and it's variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes to bootcamps
app.use("/api/v1/bootcamps", bootcampsRouter);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB();
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on Port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //   Close the server
  server.close(() => process.exit(1));
});
