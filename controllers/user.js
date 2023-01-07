const { validateEmail, validateLength, validateUsername } = require("../helpers/validation");
const User = require("../models/User");
const Post = require('../models/Post')
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");
const { transporter } = require("../nodemailer/nodeMailer");
const nodemailer = require('nodemailer');
const { db, ensureIndexes } = require("../models/User");
const Otp = require('../models/Otp')
const OtpVerification = require('../nodemailer/nodeMailer');
const mongoose = require("mongoose");
const { post } = require("../routes/user");
// var ObjectId = require('mongodb').ObjectID;


const sendOtp = async ({ _id, email }, res) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.APP_PASSWORD
        }
    })
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`

    let mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "verify your Email",
        html: `<p>Enter <b>${otp} to verify your email address and compleate the registration process
            <p>This code will be expires in 1 hour</b></p>`

    };


    // const cryptedOtp = await bcrypt.hash(otp, 12)

    await new Otp({
        userId: _id,
        email: email,
        otp: otp,
        //   otp:cryptedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 360000
    }).save()
    transport.sendMail(mailOptions)
        .catch((err) => {
            console.log(err);
        })
    res.send({ message: 'please check your email and verify the account.' })

}

const saveUserData = async (userData) => {
    console.log('hi', userData);
    const {
        first_name,
        last_name,
        user_name,
        email,
        password,
        gender,
        bYear,
        bMonth,
        bDay
    } = userData;
    // const cryptedPassword = await bcrypt.hash(password, 12)
    // let tempUsername = first_name + last_name;
    // let newUsername = await validateUsername(tempUsername);
    // console.log(cryptedPassword, 'pass');
    // console.log(newUsername, 'newnameeee');
    // const user = await new User({
    //     first_name,
    //     last_name,
    //     user_name: newUsername,
    //     email,
    //     password: cryptedPassword,
    //     gender,
    //     bYear,
    //     bMonth,
    //     bDay
    // })
    // user.save()
    return user;
}

//userSignup
exports.register = async (req, res) => {

    try {
        const {
            first_name,
            last_name,
            // user_name,
            email,
            password,
            gender,
            bYear,
            bMonth,
            bDay
        } = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "invalid email address", });
        }

        const check = await User.findOne({ email })
        if (check) {
            return res.status(400).json({ message: "This email address is already exists" })
        }
        if (!validateLength(first_name, 3, 30)) {
            return res.status(400).json({
                message: "first name must between 3 and 30 characters.",
            });
        }
        if (!validateLength(last_name, 3, 30)) {
            return res.status(400).json({
                message: "last name must between 3 and 30 characters.",
            });
        }
        if (!validateLength(password, 6, 40)) {
            return res.status(400).json({

                message: "password must be atleast 6 characters.",
            });
        }
        const cryptedPassword = await bcrypt.hash(password, 12)
        let tempUsername = first_name + last_name;
        let newUsername = await validateUsername(tempUsername);
        const user = await new User({
            first_name,
            last_name,
            user_name: newUsername,
            email,
            password: cryptedPassword,
            gender,
            bYear,
            bMonth,
            bDay
        })
        user.save()
        const emailVerification = generateToken({ id: user._id, email: user.email.toString(), }, "7d")
        console.log(user, 'signup');
        res.json({ user: { ...user.toObject(), token: emailVerification } })
        // req.session.tempUserData = req.body;
        // console.log(req.session,'sessionnnn');
        // console.log(req.session.tempUserData,'tempdata');
        // sendOtp(req.session.tempUserData, res);
    } catch (error) {
        res.status(500).json({ message: error.message })

    };

}

//verify otp
// exports.verifyotp = async (req, res) => {
//     console.log(req.session, 'user');
//     console.log('ki');
//     try {
//         const { otp } = req.body;
//         const { email } = req.session.tempUserData
//         console.log(req.body);
//         console.log(otp, 'otp');
//         // console.log(req.session.tempUserData);
//         // const email = req.session.tempUserData.email;
//         // console.log(req.session.tempUserData);
//         console.log('asdf');
//         if (!otp) {
//             res.status(401).json({ message: "provide valid credentiols" })
//         } else {
//             console.log(email, otp, 'chek');
//             const otpVerified = await Otp.findOne({ email, otp });
//             if (!otpVerified) {

//                 res.status(401).json({ message: 'Invalid otp.' })
//             } else {

//                 console.log('helors');
//                 console.log(req.session.tempUserData, 'data');
//                 const user = await saveUserData(req.session.tempUserData)
//                 console.log(user, 'dataatattatatatata');
//                 const token = generateToken({ id: user._id, email: user.email.toString(), }, "30m")
//                 res.json({
//                     message: 'Account created successfully.',
//                     token,
//                     user
//                 })
//             }
//         }
//     } catch (error) {
//         res.status(500).json(error)

//     }
// }


//userLogin

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "There is no user is asociated with this email address" })
        }
        if (!user.Active) {
            return res.status(400).json({ message: "You are Blocked by Admin" })
        }

        const check = await bcrypt.compare(password, user.password)
        if (!check) {
            return res.status(400).json({ message: "invalid user" })
        }
        const emailVerification = generateToken({ id: user._id, email: user.email.toString(), }, "7d")
        console.log(user, 'login');

        res.json({ user: { ...user.toObject(), token: emailVerification } })
    } catch (error) {
        res.status(600).json({ message: error.message })

    }

}


//create a post
exports.posts = async (req, res) => {
    const userid = req.user.id
    mongoose.Types.ObjectId(userid)
    const newPost = new Post({
        img: req.body.img,
        description: req.body.description,
        userid
    });
    try {
        const savedPost = await newPost.save()
        const post = await savedPost.populate("userid", "first_name last_name user_name")
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }

}
//updatePost
// exports.updatePost = async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (post.userId === req.body.userId) {
//             await post.updateOne({ $set: req.body });
//             res.status(200).json("your post has been updated successfully");
//         } else {
//             res.status(403).json("you can only update your posts only");
//         }
//     } catch (error) {
//         res.status(500).json(error)

//     }

// }


// deletePost

exports.deletePost = async (req, res) => {
    try {
        const postid = mongoose.Types.ObjectId(req.body.postid)
        const post = await Post.findByIdAndUpdate(req.body.postid, {
            $set: {
                delete: true
            }
        })
        console.log(post, 'deleted');
        res.status(200).json("This Post has been deleted")
    } catch (error) {
        res.status(500).json(error)

    }

}

//like /dislike a post

exports.likePost = async (req, res) => {
    try {
        const userid = mongoose.Types.ObjectId(req.user.id)
        const postid = mongoose.Types.ObjectId(req.body.postid)
        const post = await Post.findById(postid);
        if (!post.likes.includes(userid)) {
            await Post.updateOne({ _id: postid }, { $push: { likes: userid } });
            res.status(200).json("You liked the post")
        } else {
            await Post.updateOne({ _id: postid }, { $pull: { likes: userid } });
            res.status(200).json("The post has been disliked ")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// addingComments

exports.addComment = async (req, res) => {
    try {
        const userid = mongoose.Types.ObjectId(req.user.id)
        const postid = mongoose.Types.ObjectId(req.body.postid)
        const post = await Post.findById(postid);
        if (req.body.values.comment == null) {
            return res.json({ message: "Add any comment" })
        }
        let commented = await Post.updateOne({ _id: postid },
            {
                $push: {
                    comments: {
                        comment: req.body.values.comment,
                        commentBy: userid,
                        commentAt: new Date(),
                    }
                }
            },
            { new: true }
        )
        res.json(commented)
    } catch (error) {
        res.status(500).json(error)

    }
}


//userSearch
exports.userSearch = async (req, res) => {
    const searchResult = await User.find({ first_name: new RegExp('^' + req.params.data, 'i') })
    if (searchResult) {
        res.send(searchResult)
    } else {
        res.status(400).json({ message: "no user found" })
    }
}


exports.getUserPost = async (req, res) => {
    try {
        const userid = mongoose.Types.ObjectId(req.user.id)
        const post = await Post.find({ delete: "false" }).populate("userid", "first_name last_name user_name profilePicture savedPosts ").populate('comments.commentBy').sort({ createdAt: -1 })
        console.log(post, 'post777777777777777777777777777777777777777777777');
        res.json(post)
    } catch (error) {
        console.log(error);

    }
}


exports.getUserProfile = async (req, res) => {
    try {
        console.log('hi');
        // const { userid } = req.params;
        const userid = mongoose.Types.ObjectId(req.params.userid)
        // const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(userid)
        let following;
        req.user.id !== req.params.userid && user.followers.includes(req.user.id) ? following = true : following = false;

        const post = await Post.find({ userid: userid, delete: "false" }).populate("userid", "first_name last_name user_name")
            .sort({ createdAt: -1 })
        console.log(post, 'userpost');
        res.json({ post, user, following })

    } catch (error) {
        console.log(error);

    }
}

// follow User

exports.follow = async (req, res) => {
    try {
        const followingId = mongoose.Types.ObjectId(req.body.userid)
        console.log('frnd id', followingId)
        const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(followingId)
        console.log(user, 'dheeraj');
        const currentUser = await User.findById(req.user.id)
        console.log(currentUser, 'fiya');
        if (!user?.followers.includes(userid)) {
            await user?.updateOne({ $push: { followers: userid } });
            await currentUser?.updateOne({ $push: { following: followingId } })
            console.log("followed the user")
            res.status(200).json("followed the user")
        } else {
            console.log("you alredy follo the user")
            res.status(200).json("you alredy follow")
        }

    } catch (error) {
        console.log(error);

    }
}

// shows all following users
exports.getAllFollowing = async (req, res) => {
    try {
        const userid = mongoose.Types.ObjectId(req.user.id)
        console.log(userid, 'fareeda');
        const user = await User.findById(userid).populate('following')
        console.log(user, 'follwoingList');
        res.json(user)
    } catch (error) {
        console.log(error);

    }
}

// show All Followers
exports.getAllFollowers = async (req, res) => {
    try {
        const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(req.user.id).populate('followers')
        res.json(user)
    } catch (error) {
        console.log(error);

    }
}

// unfollow User
exports.unfollow = async (req, res) => {
    try {
        const followingId = mongoose.Types.ObjectId(req.body.userid)
        const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(followingId)
        const currentUser = await User.findById(req.user.id)
        if (user?.followers.includes(userid)) {
            await currentUser.updateOne({ $pull: { following: followingId } });
            await user.updateOne({ $pull: { followers: userid } });
            res.status(200).json("Unfollowed the user")
        } else {
            res.status(400).json("you dont follow this user")
        }
    } catch (error) {
        console.log(error);

    }
}

// report Post
exports.reportPost = async (req, res) => {
    try {
        console.log('hi');
        const userid = mongoose.Types.ObjectId(req.user.id)
        const postId = mongoose.Types.ObjectId(req.body.postid)
        const post = await Post.findById(postId)
        const reportData = {
            // report:req.body.value,
            reportedBy: userid
        }

        if (!post.report.some((report) => report.reportedBy + '' == userid)) {
            await post.updateOne({ $push: { report: reportData } })
            await post.updateOne({ $set: { reportedStatus: true } })
            res.status(200).json("Your report has been submitted successfully")
        } else {
            res.status(200).json("Alredy reported the post")
        }
    } catch (error) {
        console.log(error);

    }
}


exports.getPeopleMayKnow = async (req, res) => {
    try {
        // const userid = mongoose.Types.ObjectId(req.user.id)
        const userid = req.user.id
        if (!mongoose.isValidObjectId(userid)) {
            return res.status(400).json({ message: 'Invalid ObjectId' })
        }
        // const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(userid)
        const people = await User.find({ _id: { $nin: [...user.following, req.user.id] } })
        res.json(people)
    } catch (error) {
        console.log(error);
    }
}


// save a Post
exports.savePost = async (req, res) => {
    try {
        console.log(req.body);
        const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(userid)
        const postId = mongoose.Types.ObjectId(req.body.postid)
        console.log(postId);
        const valid = user.savedPosts.includes(postId)
        if (valid) return res.send('yes')
        await user.updateOne({
            $push: {
                savedPosts: {
                    $each: [postId],
                    $position: 0

                }
            }
        });
        const updatedUser = await User.findById(userid)
        const token = generateToken({ id: updatedUser.id, email: updatedUser.email.toString(), }, "7d")
        res.json({ user: { ...updatedUser.toObject(), token: token } })
    } catch (error) {
        console.log(error);
    }
}

exports.unsavePost = async (req, res) => {
    try {
        console.log(req.body);
        const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(userid)
        const postId = mongoose.Types.ObjectId(req.body.postid)
        console.log(postId);
        const valid = user.savedPosts.includes(postId)
        if (valid)
            user.updateOne({
                $pull: {
                    savedPosts: postId
                }
            }).then(async(data) => {
                const updatedUser = await User.findById(userid)
                const token = generateToken({ id: updatedUser.id, email: updatedUser.email.toString(), }, "7d")
                res.json({ user: { ...updatedUser.toObject(), token: token } })
                // res.status(200).json({ message: "post added to savedpost" })
            })
        else
            res.status(200).json({ message: "already removed" })
    } catch (error) {
        console.log(error, 'error');
        res.status(500).json(error)

    }
}
// show all SavedPosts
exports.getSavedPosts = async (req, res) => {
    try {
        const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(userid).populate('savedPosts').populate('savedPosts.comments.commentBy')
        console.log(user,'888888888888888888888888888888');
        res.status(200).json(user)

    } catch (error) {
        console.log(error);

    }
}

// adding ProfilePicture
exports.addProfilePicture = async (req, res) => {
    try {
        const image = req.body.img
        const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(userid)
        await user.updateOne({
            $set:
            {
                profilePicture: image
            }
        })
        const updatedUser = await User.findById(userid)
        const token = generateToken({ id: updatedUser.id, email: updatedUser.email.toString(), }, "7d")
        res.json({ user: { ...updatedUser.toObject(), token: token } })
        // res.status(200).json("image added succesfully")


    } catch (error) {
        console.log(error);

    }
}

exports.getUser = async (req, res) => {
    const id = req.params.userId
    try {

        const user = await User.findById(id)
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(500).json("No such User")
        }

    } catch (error) {
        res.status(500).json(error)

    }
}

// updateUserData
exports.updateUserDetails = async (req, res) => {
    try {
        const { firstName } = req.body.editData
        const { lastName } = req.body.editData
        const userid = mongoose.Types.ObjectId(req.user.id)
        const user = await User.findById(userid).updateOne({
            $set: {
                first_name: firstName,
                last_name: lastName
            }
        })
        console.log(user, 'after updaton');
        res.status(200).json("updated")


    } catch (error) {
        res.status(500).json(error)

    }
}
exports.deleteComment = async (req, res) => {
    try {
        console.log(req.body, 'body');
        const { commentId } = req.body
        const post = await Post.findOneAndUpdate({ "comments._id": mongoose.Types.ObjectId(commentId) }, { $set: { "comments.$.commentDelete": true } })
        res.status(200).json("comment deleted ")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)

    }
}

exports.updatePost = async (req, res) => {
    const { postId } = req.params
    const { data } = req.body
    const userid = mongoose.Types.ObjectId(req.user?.id)
    try {
        const post = await Post.findById(postId)
        console.log('hi');
        await post.updateOne({
            $set: {
                description: data
            }
        })
        // const token = generateToken({ id: user.id, email: user.email.toString(), }, "7d")
        res.status(200).json("post updated")



    } catch (error) {
        res.status(500).json(error)

    }
}
exports.removeProfile = async (req, res) => {
    try {
        const userid = mongoose.Types.ObjectId(req.user?.id)
        const user = await User.findById(userid)
        await User.updateOne({ _id: user.id }, {
            $unset: { profilePicture: 1 }
        })
        const updatedUser = await User.findById(userid)
        const token = generateToken({ id: user.id, email: user.email.toString(), }, "7d")
        console.log(token, 'token');
        res.json({ user: { ...updatedUser.toObject(), token: token } })



    } catch (error) {
        res.status(500).json(error)

    }
}



