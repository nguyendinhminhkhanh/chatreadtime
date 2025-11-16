const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./libs/db");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const { protectedRoute } = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

//midadlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

//public routes
app.use("/api/auth", authRouter);

//privete routes
app.use(protectedRoute);
app.use("/api/users", userRouter);

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
