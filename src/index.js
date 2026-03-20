import express from  'express'
import bookRoutes from "./routes/bookRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { connectDB } from './lib/db.js'
import cors from 'cors'
import "dotenv/config"
// import dns from 'dns'
// dns.setServers(['8.8.8.8', '1.1.1.1']);
const app =express()
const PORT=process.env.PORT || 3000

app.use(express.json());
app.use(cors());



  app.use("/api/auth",authRoutes)
   app.use("/api/books",bookRoutes)
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})  