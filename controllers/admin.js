const Admin = require('../models/Admin')
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require('../helpers/adminJwt')
const { default: mongoose } = require("mongoose");
const { post } = require('../routes/authorizer');
const Post = require('../models/Post')
exports.addAdmin = async (req, res) => {
   try {
      const { email, password } = req.body;
      const adminExist = await Admin.findOne({ email })
      if (adminExist) {
         const check = await bcrypt.compare(password, adminExist.password)
         if (!check) {
            return res.status(400).json({ message: "invalid crendentiols" })
         }
         res.status(200).json("admin loginned successfully")
      } else {
         res.status(400).json("invalid credentials")
      }
      //  if(!adminExist){
      //    const cryptedPassword=await bcrypt.hash(password,12)
      //    const admin = await new Admin({
      //       email,
      //       password: cryptedPassword,

      //   }).save()
      //    res.status(200).json("success")
      //  }else{
      //    res.status(400).json("invalid credentials")

      //  }

   } catch (error) {
      res.status(400).json(error)
   }
}

exports.login = async (req, res) => {
   try {
      const { email, password1 } = req.body;
      const admin = await Admin.findOne({ email })
      if (!admin) {
         res.status(400).json({ message: "invalid credential admin" })
      } else {

         const check = await bcrypt.compare(password1, admin.password)
         if (!check) {
            return res.status(400).json({ message: "invalid credential admin" })
         }
         const adminToken = generateToken({ id: admin._id, email: admin.email.toString(), }, "30m")

         res.json({ message: "login successfully", token: adminToken })
      }
   } catch (error) {
      res.status(400).json(error)
   }
}


//getting all users
module.exports.getAllUsers = async (req, res, next) => {
   try {
      const users = await User.find({}, { first_name: 1, last_name: 1, email: 1,Active:1,user_name:1 });
      res.status(200).json(users);
   } catch (err) {
      next(err);
   }
};

exports.userManagement = async (req, res) => {
   try {
      const userid = mongoose.Types.ObjectId(req.body.id)
      const user = await User.findOne(userid)

      const response = await user.updateOne({ $set: { Active: !user.Active } })
      console.log(user.Active, 'user');
      res.json(user.Active)
   } catch (error) {
      console.log(error);
      res.status(500).json(error)

   }
}

//get reportedPosts

exports.reportedPosts= async (req,res)=>{
   try {
      const post=await Post.find({reportedStatus:true,delete:false}).populate('report.reportedBy').populate('userid')
   
      console.log(post,'posttt');
      res.json(post)
   
      
   } catch (error) {
      console.log(error);
      
   }
}