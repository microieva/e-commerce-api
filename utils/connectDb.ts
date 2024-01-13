import mongoose from "mongoose";

export const connectDb = () => {
    const mongoURL = process.env.DB_URL as string; 
    mongoose.connect(mongoURL).then(() => console.log("MongoDB Connected!"));
  }