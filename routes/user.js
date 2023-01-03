const express=require('express');
const {register,login,follow,unfollow,posts,updatePost,deletePost,likePost,
    verifyotp,userSearch,getUserPost,addComment,getUserProfile,getAllFollowing,
    getAllFollowers,reportPost,getPeopleMayKnow,savePost,getSavedPosts,addProfilePicture,getUser,updateUserDetails,deleteComment, removeProfile}=require('../controllers/user')
const router=express.Router()
const verifyToken=require('../middlewares/authMiddleware')

// register
router.post('/register',register)

// login
router.post('/login',login)

// searchUser
router.get('/usersearch/:data',userSearch)

// router.post('/verifyotp',verifyotp)

// followUser
router.post('/follow',verifyToken,follow)

// unfollowUser
router.post('/unfollow',verifyToken,unfollow)

// addingPosts
router.post('/posts',verifyToken,posts)

// getPosts
router.get('/getposts',verifyToken,getUserPost)

// deletePost
router.post('/deletePost',deletePost)

// likePost
router.post('/likePost',verifyToken,likePost)

// addComment
router.post('/addcomment',verifyToken,addComment)

// deleteComment
router.post('/deleteComment',verifyToken,deleteComment)


// updateAPost
router.post('/updatePost/:postId',verifyToken,updatePost)

// postReport
router.post('/reportPost',verifyToken,reportPost)

// savePosts
router.post('/savedPost',verifyToken,savePost)

// showAllsavedPosts
router.get('/getallSavedPosts',verifyToken,getSavedPosts)

// getUserProfile
router.get('/getUserProfile/:userid',verifyToken,getUserProfile)

// showAllfollowingList
router.get('/getallFollowing',verifyToken,getAllFollowing)

// getAllFolloweres
router.get('/getallFollowers',verifyToken,getAllFollowers)


// showPeopleYoumayknow
router.get('/getPeopleMayKnow',verifyToken,getPeopleMayKnow)



// addProfilePicture
router.post('/addProfilePicture',verifyToken,addProfilePicture)

// getAuser
router.get('/getUser/:userId',getUser)

// updateUserDetails
router.post('/updateUserDetails',verifyToken,updateUserDetails)


router.patch('/removeProfile',verifyToken,removeProfile)






module.exports=router;
