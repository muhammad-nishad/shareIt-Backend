const mongoose=require("mongoose");
const adminSchema=mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is requied"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    }

})


module.exports=mongoose.model("Admin",adminSchema)