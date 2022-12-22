const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Otp=new Schema({
    userId:mongoose.Schema.Types.ObjectId,
    otp:String,
    email:String,
    createdAt:Date,
    expiresAt:Date,

});

const UserOtpVerification=mongoose.model(
    "Otp",
    Otp
    );
    module.exports=UserOtpVerification;