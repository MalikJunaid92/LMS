import cloudinary from "cloudinary"
import { catchAsyncError } from "../middleware/catchAsyncError"
import { NextFunction, Request, Response } from "express"
import ErrorHandler from "../utilis/ErrorHandler"
import { createCourse } from "../services/course.service"



// upload course 

export const uploadCourse= catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data=req.body;
        const thumbnail=data.thumbnail;
        if(thumbnail){
            const myCloud= await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"courses"
            })
            data.thumbnail={
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        }
        createCourse(data,res,next)
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})