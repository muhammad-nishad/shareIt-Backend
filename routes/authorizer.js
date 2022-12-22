const express=require('express');
const {addAdmin,login,getAllUsers,userManagement,reportedPosts}=require('../controllers/admin')
const router=express.Router()

router.post('/authorizer/addadmin',addAdmin)
router.post('/authorizer/login',login)
router.get("/authorizer/getUsers", getAllUsers);
router.post('/authorizer/userManagement',userManagement)
router.get('/authorizer/reportedPosts',reportedPosts)


module.exports=router;