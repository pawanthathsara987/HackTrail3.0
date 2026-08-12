import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB, sequelize } from "./config/database.js";


dotenv.config();


const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Database
connectDB();

// app.use("/api/marks", markRoutes);

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