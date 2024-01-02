import express from "express";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import caetgoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import usersRoutes from "./routes/userRoute.js";

import cors from "cors";

// config env
dotenv.config();

// database config
connectDB();

//rest object
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", caetgoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", usersRoutes);

// rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome TO Api E-commerce Application</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    chalk.bgMagentaBright(
      `App is running on ${process.env.DEV_MODE}mode on PORT ${PORT} on port`
    )
  );
});
