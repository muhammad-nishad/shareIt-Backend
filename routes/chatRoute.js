const express=require('express');
const { createChat, userChats, findChat }= require('../controllers/chat')

const router = express.Router()

router.post('/chat',createChat)

router.get('/chat/:userId',userChats)

router.get('/find/:firstId/:secondId',findChat);

//finding a specific chat is iam not including right now






module.exports = router;