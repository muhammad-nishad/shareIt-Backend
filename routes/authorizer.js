const express=require('express');
const {addAdmin,login,getAllUsers,userManagement,reportedPosts, sample}=require('../controllers/admin')
const router=express.Router()
const authMiddleware=require('../middlewares/adminMiddleware')

router.post('/authorizer/addadmin',addAdmin)
router.post('/authorizer/login',login)
router.get("/authorizer/getUsers", authMiddleware,getAllUsers);
router.post('/authorizer/userManagement',authMiddleware,userManagement)
router.get('/authorizer/reportedPosts',reportedPosts)
router.get('/authorizer/sample',authMiddleware,sample)


module.exports=router;