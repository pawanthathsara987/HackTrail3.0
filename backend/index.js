import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB, sequelize } from "./config/database.js";
import "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);

// Sync Models
sequelize.sync()
.then(()=>{
    console.log("✅ Database synchronized");
})
.catch((error)=>{
    console.log(error.message);
});


// Server
const PORT = process.env.PORT || 3002;


app.listen(PORT,()=>{

    console.log(`🚀 Server running on port ${PORT}`);

});