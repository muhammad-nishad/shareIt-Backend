const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      text: true,
    },
    last_name: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      text: true,
    },
    user_name: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      text: true,
      unique: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
   
    gender: {
      type: String,
      // required: [true, "gender is required"],
      trim: true,
    },
    bYear: {
      type: Number,
      required: [true, "Birth Year  is required"],
      trim: true,
    },
    bMonth: {
      type: Number,
      // required: [true, "Birth Month   is required"],
      trim: true,
    },
    bDay: {
      type: Number,
      // required: [true, "Birth Day is required"],
      trim: true,
    },
    Active: {
      type: Boolean,
      default: true,
    },
    profilePicture:{
      type:String

    },
    following: [{
      type: ObjectId,
      ref: 'User'
    }],
   
    // following: {
    //   type: Array,
    //   ref:"User",
    //   default: [],
    // },
    followers: {
      type: Array,
      ref:"User",
      default: [],
    },
  
   
    savedPosts: [
      {
       
          type: ObjectId,
          ref: "Post",
        
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
