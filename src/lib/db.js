import mongoose from "mongoose"
import "dotenv/config"
export const connectDB=async ()=>{
    try{
   const conn=   await mongoose.connect(
     process.env.MONGO_URI
    // "mongodb://blissimeonx_db_user:w8Cb9juy7S3BUqyI@ac-uiblibz-shard-00-00.4xvkppo.mongodb.net:27017,ac-uiblibz-shard-00-01.4xvkppo.mongodb.net:27017,ac-uiblibz-shard-00-02.4xvkppo.mongodb.net:27017/?ssl=true&replicaSet=atlas-zv5pgu-shard-0&authSource=admin&appName=Cluster0"
)
   console.log(`Database connected ${conn.connection.host}`);
   
    }catch(err){
     console.log(`Error connecting to our database`,err.message);
     process.exit(1)
     
    }
}