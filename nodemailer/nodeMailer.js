// const nodemailer=require('nodemailer')

const UserOtpVerificationSchema = require("../models/Otp")


// let mailTransporter=nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//         user:'rncreations7@gmail.com',
//         pass:'ftjrafcqnmuxndps'
//     }
// })

// let details={
//     from:"rncreatons7@gmail.com",
//     to:'nishadmuhammed212@gmail.com',
//     subject:"testing",
//     text:'welcome to our project'
// }
// mailTransporter.sendMail(details,(err)=>{
//     if(err){
//         console.log('the errror is ',err);
//     }else{
//         console.log('mail send perfectly');
//     }
// })
// module.exports=mailTransporter;

const OtpVerification=async(email,otp)=>{
    console.log('verification');
    const Otpdata=await UserOtpVerificationSchema.findOne({email});
    if(!Otpdata){
        console.log('nodata');
        res.status(401).json({message:"invalid"})
    }else{
        if(Otpdata == otp){

            UserOtpVerificationSchema.deleteOne({email})
            return true;
        } else {
            return false;
        }
    }

}
module.exports=OtpVerification;


