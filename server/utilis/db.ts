import mongoose from "mongoose";
require("dotenv").config();
const db_URl: string = process.env.DB_URL || "";
export const connectDB = async () => {
  try {
    await mongoose.connect(db_URl).then((data: any) => {
      console.log(`MongoDB Connected: ${data.connection.host}`);
    });
  } catch (error) {
    console.log(error);
    setTimeout(connectDB, 5000);
  }
};
