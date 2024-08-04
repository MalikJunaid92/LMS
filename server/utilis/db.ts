import mongoose from "mongoose";

require("dotenv").config()
const dbUrl:string=process.env.DB_URL ||'';

export const connectDB= async()=>{
    try {
        mongoose.connect(dbUrl).then((data:any)=>{
            console.log(`DataBase connected with ${data.connection.host}`)
        })
    } catch (error:any) {
        console.log(error.message)
        setTimeout(connectDB,5000)
    }
}