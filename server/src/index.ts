import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import authRoute from "./routes/auth.routes";

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// middleware and security
app.use(helmet()); // security headers http
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "hhtp://localhost:3000",
    credentials: true,
  })
); // CORS configuration

app.use(morgan("dev")); // request status log
app.use(compression() as any);
app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true })); // parse urlencoded request body

// api routes
app.use("/api/auth", authRoute)


// check server status
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AZ fashion server is running" });
});

app.use(errorHandler); // global error handler


// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
