import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'
export async function POST(request){
    try {
        const reqBody =await request.json()
        const {email,name,message} = reqBody
        const transport = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:'foodifydelivery@gmail.com',
                pass:'rufw wmxj tzih nvuu'
            }
        
         })
        const mailoptions ={
            name:name,
            from: email, 
            to: 'faizanhameed690@gmail.com', 
            subject:"Client message",
            text: message, 
        }
           
        
        const mailresponse = await transport.sendMail(mailoptions)
        console.log("message sended ",mailresponse);
        return NextResponse.json({message:"Mail sended",data:mailresponse},{status:200})
        
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
}